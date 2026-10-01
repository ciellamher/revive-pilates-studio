import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { pool } from './db/pool.js';
import * as classesRepo from './classesRepo.js';
import * as bookingsRepo from './bookingsRepo.js';
import * as coachesRepo from './coachesRepo.js';
import * as usersRepo from './usersRepo.js';
import * as packagesRepo from './packagesRepo.js';
import * as settingsRepo from './settingsRepo.js';
import { allow, clientIp } from './rateLimit.js';
import { PACKAGES, findPackage, creditTypesForClass } from './packagesCatalog.js';
import { sendMail, sendReminder, sendCancellation, sendConfirmation, sendPackageActivated, sendBookingReceived, sendPackageReceived, sendBookingCancelled, sendBookingMoved, sendClassRescheduled, sendPaymentRejected, sendPackageRejected, MAIL_MODE } from './mailer.js';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.disable('x-powered-by');

// Security headers on every response. The API only returns JSON, so it can be
// strict: nothing may frame it, sniff its type or cache personal data.
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  });
  // Anything sent with a session or secret is someone's own data.
  if (req.headers.authorization) res.set('Cache-Control', 'no-store');
  next();
});

// Refuses with 429 when `key` has been used `limit` times in `minutes`.
async function rateLimited(res, key, limit, minutes) {
  if (await allow(pool, key, limit, minutes)) return false;
  res.status(429).json({ error: 'Too many requests. Please wait a few minutes and try again.' });
  return true;
}
// Most requests are tiny. The few that can carry an image (a payment receipt,
// or the studio's QR codes) get a larger allowance; images are shrunk in the
// browser before they are sent.
const smallJson = express.json({ limit: '100kb' });
const imageJson = express.json({ limit: '3mb' });
const IMAGE_ROUTES = ['/api/bookings', '/api/me/packages', '/api/settings/payment'];
app.use((req, res, next) => (IMAGE_ROUTES.includes(req.path) ? imageJson : smallJson)(req, res, next));

// An optional image sent as a data: URL. Returns { image } (null when absent)
// or { error }.
const IMAGE_DATA_URL = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
function parseImage(value, label) {
  if (value === undefined || value === null || value === '') return { image: null };
  if (typeof value !== 'string' || value.length > 1_500_000 || !IMAGE_DATA_URL.test(value)) {
    return { error: `${label} must be a PNG, JPEG or WebP image under 1 MB` };
  }
  return { image: value };
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

// JWT_SECRET signs the login links and the sessions, including the admin's. On
// a live site it must be your own secret: with the fallback below, anyone who
// has read this file could sign themselves in as the admin.
if (IS_PRODUCTION && !process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Add it in the host dashboard, then redeploy.');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET || 'local-development-only-secret';

// Who may use the admin dashboard. Comma-separated emails.
const adminEmails = (process.env.ADMIN_EMAILS || 'gdjimenez@student.hau.edu.ph')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BRANCHES = ['Angeles', 'San Fernando'];

// Two kinds of token, told apart by `purpose` so one cannot stand in for the
// other: the link in the email lasts 15 minutes and is only good for signing
// in; the session it is exchanged for lasts a week.
const signToken = (payload, expiresIn) => jwt.sign(payload, JWT_SECRET, { expiresIn });

function readToken(req, purpose) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.purpose === purpose ? decoded : null;
  } catch {
    return null;
  }
}

const isAdmin = (email) => adminEmails.includes(email.toLowerCase());

function requireAdmin(req, res, next) {
  const session = readToken(req, 'session');
  if (!session) return res.status(401).json({ error: 'Please sign in' });
  if (!isAdmin(session.email)) return res.status(403).json({ error: 'Admins only' });
  req.userEmail = session.email;
  next();
}

function requireUser(req, res, next) {
  const session = readToken(req, 'session');
  if (!session) return res.status(401).json({ error: 'Please sign in' });
  req.userEmail = session.email;
  next();
}

const toUser = (row) => ({ email: row.email, name: row.name, isAdmin: isAdmin(row.email) });

app.get('/api/users', requireAdmin, async (req, res, next) => {
  try {
    res.json({ users: await usersRepo.getDirectory(pool) });
  } catch (error) {
    next(error);
  }
});

function parseCoachInput(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const specialty = typeof body.specialty === 'string' ? body.specialty.trim() : '';
  const bio = typeof body.bio === 'string' ? body.bio.trim() : '';
  const branches = Array.isArray(body.branches) ? BRANCHES.filter((branch) => body.branches.includes(branch)) : [];

  if (!name || name.length > 100) return { error: 'Please enter the coach\'s name (up to 100 characters)' };
  if (specialty.length > 100) return { error: 'Specialty must be 100 characters or fewer' };
  if (bio.length > 1000) return { error: 'Bio must be 1000 characters or fewer' };
  if (branches.length === 0) return { error: 'Choose at least one branch' };
  return { input: { name, specialty, bio, branches } };
}

app.get('/api/coaches', async (req, res, next) => {
  try {
    res.json({ coaches: await coachesRepo.getAll(pool) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/coaches', requireAdmin, async (req, res, next) => {
  try {
    const { input, error } = parseCoachInput(req.body ?? {});
    if (error) return res.status(400).json({ error });
    res.status(201).json(await coachesRepo.create(pool, input));
  } catch (error) {
    next(error);
  }
});

app.put('/api/coaches/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(404).json({ error: 'Coach not found' });
    const { input, error } = parseCoachInput(req.body ?? {});
    if (error) return res.status(400).json({ error });
    const id = Number(req.params.id);

    // Taking a coach off a branch would leave that branch's upcoming classes
    // with an instructor who no longer teaches there.
    const stillTeaching = (await coachesRepo.getBranchesWithUpcomingClasses(pool, id))
      .filter((branch) => !input.branches.includes(branch));
    if (stillTeaching.length > 0) {
      return res.status(409).json({
        error: `This coach still has upcoming classes at ${stillTeaching.join(' and ')}. Reassign or cancel those classes first.`,
      });
    }

    const updated = await coachesRepo.update(pool, id, input);
    if (!updated) return res.status(404).json({ error: 'Coach not found' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/coaches/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(404).json({ error: 'Coach not found' });
    const outcome = await coachesRepo.remove(pool, Number(req.params.id));
    if (outcome === 'not-found') return res.status(404).json({ error: 'Coach not found' });
    if (outcome === 'in-use') {
      return res.status(409).json({ error: 'This coach is on the schedule, so they cannot be deleted. Reassign their classes first.' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Classes live in PostgreSQL, so every browser and every computer sees the
// same schedule and it survives a server restart.
const CLOCK_TIME = /^(0[1-9]|1[0-2]):[0-5]\d (AM|PM)$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Checks the fields that are present and returns { input } or { error }.
// POST passes requireAll so a missing field is an error; PATCH does not, so a
// request can change one field, such as cancelling a class.
function parseClassInput(body, { requireAll }) {
  const input = {};
  const has = (key) => body[key] !== undefined;
  const missing = (key) => requireAll && !has(key);

  if (missing('title') || missing('date') || missing('time') || missing('duration') ||
      missing('coachId') || missing('branch') || missing('capacity')) {
    return { error: 'title, date, time, duration, coachId, branch and capacity are required' };
  }

  if (has('title')) {
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 100) {
      return { error: 'title must be 1 to 100 characters' };
    }
    input.title = body.title.trim();
  }
  if (has('date')) {
    if (typeof body.date !== 'string' || !ISO_DATE.test(body.date) || Number.isNaN(Date.parse(body.date))) {
      return { error: 'date must be a real date in YYYY-MM-DD format' };
    }
    input.date = body.date;
  }
  if (has('time')) {
    if (typeof body.time !== 'string' || !CLOCK_TIME.test(body.time)) {
      return { error: 'time must look like 08:30 AM' };
    }
    input.time = body.time;
  }
  if (has('duration')) {
    const minutes = parseInt(body.duration, 10);
    if (!Number.isInteger(minutes) || minutes < 15 || minutes > 480) {
      return { error: 'A class must be between 15 minutes and 8 hours long' };
    }
    input.durationMin = minutes;
  }
  if (has('coachId')) {
    const coachId = Number(body.coachId);
    if (!Number.isInteger(coachId) || coachId < 1) {
      return { error: 'Please choose an instructor' };
    }
    input.coachId = coachId;
  }
  if (has('branch')) {
    if (!BRANCHES.includes(body.branch)) {
      return { error: `branch must be one of: ${BRANCHES.join(', ')}` };
    }
    input.branch = body.branch;
  }
  if (has('capacity')) {
    if (!Number.isInteger(body.capacity) || body.capacity < 1 || body.capacity > 50) {
      return { error: 'capacity must be a whole number from 1 to 50' };
    }
    input.capacity = body.capacity;
  }
  if (has('isCancelled')) {
    if (typeof body.isCancelled !== 'boolean') {
      return { error: 'isCancelled must be true or false' };
    }
    input.isCancelled = body.isCancelled;
  }
  return { input };
}

// An instructor has to be a coach who teaches at the class's branch.
async function checkCoachTeachesAt(coachId, branch) {
  const coach = await coachesRepo.getById(pool, coachId);
  if (!coach) return 'That instructor no longer exists. Please choose another.';
  if (!coach.branches.includes(branch)) return `${coach.name} does not teach at the ${branch} branch.`;
  return null;
}

app.get('/api/classes', async (req, res, next) => {
  try {
    res.json({ classes: await classesRepo.getAll(pool) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/classes', requireAdmin, async (req, res, next) => {
  try {
    const { input, error } = parseClassInput(req.body ?? {}, { requireAll: true });
    if (error) return res.status(400).json({ error });
    const coachError = await checkCoachTeachesAt(input.coachId, input.branch);
    if (coachError) return res.status(400).json({ error: coachError });
    res.status(201).json(await classesRepo.create(pool, input));
  } catch (error) {
    next(error);
  }
});

app.patch('/api/classes/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) {
      return res.status(404).json({ error: 'Class not found' });
    }
    const { input, error } = parseClassInput(req.body ?? {}, { requireAll: false });
    if (error) return res.status(400).json({ error });
    const id = Number(req.params.id);
    const before = await classesRepo.getById(pool, id);
    if (!before) return res.status(404).json({ error: 'Class not found' });
    if (input.coachId !== undefined || input.branch !== undefined) {
      const coachError = await checkCoachTeachesAt(input.coachId ?? Number(before.coachId), input.branch ?? before.branch);
      if (coachError) return res.status(400).json({ error: coachError });
    }
    const updated = await classesRepo.update(pool, id, input);

    // Tell everyone who booked, but only on the change from open to cancelled.
    // The cancellation itself is already saved: a mail failure is logged and
    // reported in `notified`, it does not undo the cancel.
    // Tell everyone booked when the class is cancelled, or when its day, time
    // or length changes (rescheduled, including by dragging on the calendar).
    const rescheduled = !updated.isCancelled && (
      before.date !== updated.date || before.time !== updated.time || before.duration !== updated.duration
    );
    let notify = null;
    if (!before.isCancelled && updated.isCancelled) notify = sendCancellation;
    else if (rescheduled) {
      // Reminders already sent were for the old time; send fresh ones.
      await bookingsRepo.resetRemindersForClass(pool, id);
      notify = (recipient) => sendClassRescheduled(recipient, before);
    }
    if (notify) {
      const recipients = await bookingsRepo.getRecipientsForClass(pool, id);
      const results = await Promise.allSettled(recipients.map(notify));
      results.forEach((result) => {
        if (result.status === 'rejected') console.error('Class change email failed:', result.reason.message);
      });
      updated.notified = results.filter((result) => result.status === 'fulfilled').length;
      updated.notifyFailed = results.length - updated.notified;
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

const REMINDER_HOURS = 12;

app.get('/api/bookings', requireAdmin, async (req, res, next) => {
  try {
    res.json({ bookings: await bookingsRepo.getAll(pool) });
  } catch (error) {
    next(error);
  }
});

// Whether a booking takes the whole class. Private, duo and trio classes are
// always booked whole; a group Reformer class can be taken whole as a private,
// duo or trio session when the client asks (body.private and body.privateKind).
const PRIVATE_KINDS = ['solo', 'duo', 'trio'];
function privateBookingOf(body, cls) {
  const t = cls.title.toLowerCase();
  if (t.includes('duo')) return { isPrivate: true, privateKind: 'duo' };
  if (t.includes('trio')) return { isPrivate: true, privateKind: 'trio' };
  if (t.includes('private') || t.includes('clinical')) return { isPrivate: true, privateKind: 'solo' };
  if (body.private === true) return { isPrivate: true, privateKind: PRIVATE_KINDS.includes(body.privateKind) ? body.privateKind : 'solo' };
  return { isPrivate: false, privateKind: null };
}

// The other attendees of a duo (one more) or trio (two more) session.
// Returns { guestNames } or { error }.
const GUESTS_NEEDED = { duo: 1, trio: 2 };
function parseGuestNames(body, privateKind) {
  const needed = GUESTS_NEEDED[privateKind] ?? 0;
  if (needed === 0) return { guestNames: [] };
  const names = Array.isArray(body.guestNames) ? body.guestNames : [];
  const clean = names.slice(0, needed).map((n) => (typeof n === 'string' ? n.trim() : ''));
  if (clean.length < needed || clean.some((n) => !n || n.length > 100)) {
    return { error: needed === 1 ? "Please enter the second attendee's name" : "Please enter both other attendees' names" };
  }
  return { guestNames: clean };
}

// Booking with a package credit: the client must be signed in, the spot is
// confirmed straight away (the package was paid for already) and one credit of
// the right type is used.
async function bookWithPackage(req, res, body) {
  const session = readToken(req, 'session');
  if (!session) return res.status(401).json({ error: 'Please sign in to use your package' });
  const purchaseId = Number(body.packageId);
  const classId = Number(body.classId);
  if (!Number.isInteger(purchaseId) || purchaseId < 1) return res.status(400).json({ error: 'Please choose a package' });
  if (!Number.isInteger(classId) || classId < 1) return res.status(400).json({ error: 'classId is required' });
  const cls = await classesRepo.getById(pool, classId);
  if (!cls) return res.status(409).json({ error: 'This class can no longer be booked.' });
  const { isPrivate, privateKind } = privateBookingOf(body, cls);
  if (!isPrivate && (!Number.isInteger(body.spot) || body.spot < 1)) return res.status(400).json({ error: 'Please select a spot' });
  const creditTypes = creditTypesForClass(cls.title, privateKind);
  const guests = parseGuestNames(body, privateKind);
  if (guests.error) return res.status(400).json({ error: guests.error });
  if (creditTypes.length === 0) return res.status(400).json({ error: 'This class cannot be booked with a package online.' });

  const profile = await usersRepo.upsert(pool, { email: session.email, name: body.clientName });
  const clientName = (typeof body.clientName === 'string' && body.clientName.trim()) || profile.name || session.email;

  const { bookingId, problem, validUntil } = await packagesRepo.bookWithCredit(pool, {
    purchaseId, email: session.email, classId, spot: isPrivate ? 1 : body.spot, clientName: clientName.slice(0, 100),
    creditTypes, isPrivate, privateKind, guestNames: guests.guestNames,
  });
  if (problem === 'no-package') return res.status(409).json({ error: 'That package is not active, or has expired.' });
  if (problem === 'no-credit') return res.status(409).json({ error: 'That package has no credits left for this class.' });
  if (problem === 'after-expiry') return res.status(409).json({ error: `That package is valid until ${validUntil}, before this class. Please choose an earlier class or another package.` });
  if (problem === 'spot-taken') return res.status(409).json({ error: 'That spot was just taken. Please choose another one.' });
  if (problem === 'unavailable') return res.status(409).json({ error: 'This class can no longer be booked.' });

  const recipient = await bookingsRepo.getRecipient(pool, bookingId);
  const [booking] = (await bookingsRepo.getForClient(pool, session.email)).filter((b) => b.id === String(bookingId));
  // Awaited, because a serverless host may stop the process once the response is sent.
  try {
    await sendConfirmation(recipient);
  } catch (error) {
    console.error(`Confirmation email for booking ${bookingId} failed:`, error.message);
  }
  res.status(201).json(booking);
}

// Booking needs an account: the booking, and every email about it, go to the
// signed-in email address, so nobody can book (or send emails) in someone
// else's name.
app.post('/api/bookings', requireUser, async (req, res, next) => {
  try {
    const body = req.body ?? {};
    if (await rateLimited(res, `booking:${req.userEmail}`, 20, 60)) return;
    if (body.packageId !== undefined) return await bookWithPackage(req, res, body);
    const classId = Number(body.classId);
    const clientName = typeof body.clientName === 'string' ? body.clientName.trim() : '';
    const clientEmail = req.userEmail;
    const referenceId = typeof body.referenceId === 'string' ? body.referenceId.trim() : '';
    const amount = typeof body.amount === 'string' ? body.amount.trim() : '';

    if (!Number.isInteger(classId) || classId < 1) {
      return res.status(400).json({ error: 'classId is required' });
    }
    if (!clientName || clientName.length > 100) {
      return res.status(400).json({ error: 'Please enter your name' });
    }
    if (!EMAIL.test(clientEmail) || clientEmail.length > 254) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    // A private session takes the whole room, so there is no spot to choose.
    const cls = Number.isInteger(classId) && classId > 0 ? await classesRepo.getById(pool, classId) : null;
    const { isPrivate, privateKind } = cls ? privateBookingOf(body, cls) : { isPrivate: body.private === true, privateKind: 'solo' };
    if (!isPrivate && (!Number.isInteger(body.spot) || body.spot < 1)) {
      return res.status(400).json({ error: 'Please select a spot' });
    }
    if (referenceId.length > 60 || amount.length > 20) {
      return res.status(400).json({ error: 'Reference number or amount is too long' });
    }
    const receipt = parseImage(body.receipt, 'The receipt');
    if (receipt.error) return res.status(400).json({ error: receipt.error });
    const guests = parseGuestNames(body, isPrivate ? privateKind : null);
    if (guests.error) return res.status(400).json({ error: guests.error });

    const { booking, problem } = await bookingsRepo.create(pool, {
      classId, clientName, clientEmail, spot: isPrivate ? 1 : body.spot, referenceId, amount,
      isPrivate, privateKind, receipt: receipt.image, guestNames: guests.guestNames,
    });
    if (problem === 'spot-taken') {
      return res.status(409).json({ error: 'That spot was just taken. Please choose another one.' });
    }
    if (problem === 'unavailable') {
      return res.status(409).json({ error: 'This class can no longer be booked.' });
    }
    // So the client shows up in the admin's Client Directory.
    await usersRepo.upsert(pool, { email: clientEmail, name: clientName });
    // Awaited: a serverless host may stop once the response is sent. A failed
    // email does not undo the booking.
    try {
      await sendBookingReceived(await bookingsRepo.getRecipient(pool, Number(booking.id)));
    } catch (error) {
      console.error(`Booking-received email for booking ${booking.id} failed:`, error.message);
    }
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/bookings/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const status = req.body?.status;
    if (!['pending', 'confirmed', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'status must be pending, confirmed, rejected or cancelled' });
    }
    const id = Number(req.params.id);
    const before = await bookingsRepo.getRecipient(pool, id);
    if (!before) return res.status(404).json({ error: 'Booking not found' });
    const { booking, problem } = await bookingsRepo.setStatus(pool, id, status);
    if (problem === 'spot-taken') {
      return res.status(409).json({ error: 'That spot has since been booked by someone else.' });
    }

    // Tell the client, but only on the change to confirmed. The confirmation is
    // already saved: a mail failure is logged and reported in `emailed`.
    // The studio cancelling an active booking also tells the client.
    const send = before.status !== 'confirmed' && status === 'confirmed' ? sendConfirmation
      : ['pending', 'confirmed'].includes(before.status) && status === 'cancelled' ? sendBookingCancelled
      : ['pending', 'confirmed'].includes(before.status) && status === 'rejected' ? sendPaymentRejected
      : null;
    if (send) {
      try {
        await send(before);
        booking.emailed = true;
      } catch (error) {
        console.error(`Email for booking ${id} (${status}) failed:`, error.message);
        booking.emailed = false;
      }
    }
    res.json(booking);
  } catch (error) {
    next(error);
  }
});

// Sends one reminder to every confirmed booking whose class starts within the
// next 12 hours. A scheduler calls this every half hour (see
// .github/workflows/send-reminders.yml); it is safe to call as often as you
// like, because a booking is only ever reminded once.
//
// It sends email, so it is not open to the public: the caller must present
// CRON_SECRET.
app.post('/api/reminders/send', async (req, res, next) => {
  try {
    const secret = process.env.CRON_SECRET;
    if (!secret) return res.status(503).json({ error: 'CRON_SECRET is not set on the server' });
    if (req.headers.authorization !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'Not authorised' });
    }

    const due = await bookingsRepo.getDueReminders(pool, REMINDER_HOURS);
    let sent = 0;
    let failed = 0;
    for (const recipient of due) {
      if (!(await bookingsRepo.claimReminder(pool, recipient.bookingId))) continue;
      try {
        await sendReminder(recipient);
        sent += 1;
      } catch (error) {
        console.error(`Reminder for booking ${recipient.bookingId} failed:`, error.message);
        await bookingsRepo.releaseReminder(pool, recipient.bookingId);
        failed += 1;
      }
    }
    res.json({ sent, failed });
  } catch (error) {
    next(error);
  }
});

// Step 1 of signing in: email a one-time link. `name` comes from the sign-up
// form and rides inside the link, so it is only saved once the person has
// proved the address is theirs.
app.post('/api/auth/login', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const name = typeof req.body?.name === 'string' ? req.body.name.trim().slice(0, 100) : '';
  if (!EMAIL.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  // Limits per address and per caller, so nobody can flood someone's inbox or
  // use up the studio's daily Gmail allowance.
  try {
    if (await rateLimited(res, `login-email:${email}`, 5, 15)) return;
    if (await rateLimited(res, `login-ip:${clientIp(req)}`, 20, 60)) return;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return res.status(500).json({ error: 'Something went wrong on the server' });
  }

  const token = signToken({ email, name, purpose: 'login' }, '15m');
  const magicLink = `${allowedOrigins[0]}/verify?token=${token}`;

  try {
    const previewUrl = await sendMail({
      to: email,
      subject: "Your Login Link",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Sign in to Revive Pilates</h2>
          <p>Click the link below to securely sign in to your account. This link expires in 15 minutes.</p>
          <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background: #4A1D1D; color: white; text-decoration: none; border-radius: 20px; margin-top: 10px;">Sign In</a>
        </div>
      `,
    });

    // previewUrl only exists in test mode (no Gmail account configured), where
    // the frontend shows it so you can open the link without a real inbox. It
    // is never sent from a live site: it would hand the sign-in link for any
    // address, the admin's included, to whoever asked for it.
    res.json({
      message: 'A login link has been sent to your email!',
      previewUrl: IS_PRODUCTION ? undefined : previewUrl,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send link' });
  }
});

// Step 2: the link's token is exchanged for a week-long session.
app.get('/api/auth/verify', async (req, res, next) => {
  try {
    const link = readToken(req, 'login');
    if (!link) return res.status(401).json({ error: 'Invalid or expired link' });

    const user = await usersRepo.upsert(pool, { email: link.email, name: link.name });
    res.json({
      token: signToken({ email: user.email, purpose: 'session' }, '7d'),
      user: toUser(user),
    });
  } catch (error) {
    next(error);
  }
});

// Who the session belongs to. The client calls this on load, so a session that
// has expired signs itself out.
app.get('/api/auth/me', async (req, res, next) => {
  try {
    const session = readToken(req, 'session');
    if (!session) return res.status(401).json({ error: 'Please sign in' });
    res.json({ user: toUser(await usersRepo.upsert(pool, { email: session.email })) });
  } catch (error) {
    next(error);
  }
});

// The signed-in client's own account: profile, email choices and bookings.
const GENDERS = ['', 'Female', 'Male', 'Prefer not to say'];

function parseProfileInput(body) {
  const input = {};
  const text = (key, max) => {
    if (body[key] === undefined) return null;
    if (typeof body[key] !== 'string' || body[key].trim().length > max) return `${key} must be ${max} characters or fewer`;
    input[key] = body[key].trim();
    return null;
  };
  const error = text('name', 100) || text('phone', 30) || text('address', 200);
  if (error) return { error };
  if (input.name === '') return { error: 'Please enter your name' };
  if (input.phone && !/^[0-9+()\-\s]{7,30}$/.test(input.phone)) return { error: 'Please enter a valid mobile number' };

  if (body.birthDate !== undefined) {
    if (body.birthDate !== '' && (typeof body.birthDate !== 'string' || !ISO_DATE.test(body.birthDate) ||
        Number.isNaN(Date.parse(body.birthDate)) || body.birthDate > new Date().toISOString().slice(0, 10))) {
      return { error: 'Please enter a valid date of birth' };
    }
    input.birthDate = body.birthDate;
  }
  if (body.gender !== undefined) {
    if (!GENDERS.includes(body.gender)) return { error: 'Please choose an option for gender' };
    input.gender = body.gender;
  }
  for (const key of ['emailReminders', 'emailPromotions']) {
    if (body[key] !== undefined) {
      if (typeof body[key] !== 'boolean') return { error: `${key} must be true or false` };
      input[key] = body[key];
    }
  }
  return { input };
}

app.get('/api/me/profile', requireUser, async (req, res, next) => {
  try {
    await usersRepo.upsert(pool, { email: req.userEmail });
    res.json({ profile: await usersRepo.getProfile(pool, req.userEmail) });
  } catch (error) {
    next(error);
  }
});

app.put('/api/me/profile', requireUser, async (req, res, next) => {
  try {
    const { input, error } = parseProfileInput(req.body ?? {});
    if (error) return res.status(400).json({ error });
    await usersRepo.upsert(pool, { email: req.userEmail });
    res.json({ profile: await usersRepo.updateProfile(pool, req.userEmail, input) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/me/bookings', requireUser, async (req, res, next) => {
  try {
    res.json({ bookings: await bookingsRepo.getForClient(pool, req.userEmail) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/me/bookings/:id/cancel', requireUser, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(404).json({ error: 'Booking not found' });
    const outcome = await bookingsRepo.cancelForClient(pool, Number(req.params.id), req.userEmail);
    if (outcome === 'not-found') return res.status(404).json({ error: 'Booking not found' });
    if (outcome === 'too-late') {
      return res.status(409).json({ error: 'This booking can no longer be cancelled online. Cancellations close 12 hours before class; please message the studio.' });
    }
    res.json({ status: 'cancelled' });
  } catch (error) {
    next(error);
  }
});

// Packages: the catalog is public; buying one needs an account, and the admin
// activates it once the payment is checked.
app.get('/api/packages', (req, res) => {
  res.json({ packages: PACKAGES });
});

app.get('/api/me/packages', requireUser, async (req, res, next) => {
  try {
    res.json({ packages: await packagesRepo.getForClient(pool, req.userEmail) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/me/packages', requireUser, async (req, res, next) => {
  try {
    if (await rateLimited(res, `purchase:${req.userEmail}`, 10, 60)) return;
    const pkg = findPackage(req.body?.packageId);
    if (!pkg) return res.status(400).json({ error: 'That package does not exist' });
    const referenceId = typeof req.body?.referenceId === 'string' ? req.body.referenceId.trim() : '';
    if (!referenceId || referenceId.length > 60) {
      return res.status(400).json({ error: 'Please enter the reference number from your payment' });
    }
    const receipt = parseImage(req.body?.receipt, 'The receipt');
    if (receipt.error) return res.status(400).json({ error: receipt.error });
    await usersRepo.upsert(pool, { email: req.userEmail });
    const purchase = await packagesRepo.create(pool, req.userEmail, pkg, referenceId, receipt.image);
    try {
      await sendPackageReceived(purchase);
    } catch (error) {
      console.error(`Purchase-received email for purchase ${purchase.id} failed:`, error.message);
    }
    res.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
});

app.get('/api/package-purchases', requireAdmin, async (req, res, next) => {
  try {
    res.json({ purchases: await packagesRepo.getAll(pool) });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/package-purchases/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(404).json({ error: 'Purchase not found' });
    const status = req.body?.status;
    if (!['active', 'rejected'].includes(status)) return res.status(400).json({ error: 'status must be active or rejected' });
    const purchase = await packagesRepo.setStatus(pool, Number(req.params.id), status);
    if (!purchase) return res.status(409).json({ error: 'This purchase has already been handled.' });

    try {
      await (status === 'active' ? sendPackageActivated : sendPackageRejected)(purchase);
      purchase.emailed = true;
    } catch (error) {
      console.error(`Package email for purchase ${purchase.id} (${status}) failed:`, error.message);
      purchase.emailed = false;
    }
    res.json(purchase);
  } catch (error) {
    next(error);
  }
});

// A class's roster: everyone booked in it, for the admin.
app.get('/api/classes/:id/bookings', requireAdmin, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(404).json({ error: 'Class not found' });
    res.json({ bookings: await bookingsRepo.getForClass(pool, Number(req.params.id)) });
  } catch (error) {
    next(error);
  }
});

// Moves a booking to another class (rescheduling) and tells the client.
app.post('/api/bookings/:id/move', requireAdmin, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(404).json({ error: 'Booking not found' });
    const id = Number(req.params.id);
    const toClassId = Number(req.body?.classId);
    if (!Number.isInteger(toClassId) || toClassId < 1) return res.status(400).json({ error: 'Please choose a class to move to' });

    const before = await bookingsRepo.getRecipient(pool, id);
    const { problem } = await bookingsRepo.move(pool, id, toClassId, creditTypesForClass);
    const messages = {
      'not-found': [404, 'Booking not found'],
      'inactive': [409, 'Only pending or confirmed bookings can be moved.'],
      'same-class': [409, 'The booking is already in that class.'],
      'unavailable': [409, 'That class cannot take this booking (cancelled, started, or held privately).'],
      'credit-mismatch': [409, "This booking was paid with a package credit that can't be used for that type of class."],
      'full': [409, 'That class is full.'],
    };
    if (problem) {
      const [code, error] = messages[problem];
      return res.status(code).json({ error });
    }

    const after = await bookingsRepo.getRecipient(pool, id);
    let emailed = true;
    try {
      await sendBookingMoved(after, before);
    } catch (error) {
      console.error(`Moved email for booking ${id} failed:`, error.message);
      emailed = false;
    }
    res.json({ booking: (await bookingsRepo.getAll(pool)).find((b) => b.id === String(id)), emailed });
  } catch (error) {
    next(error);
  }
});

// Receipt images are fetched one at a time when the admin opens a booking or
// purchase, so the lists stay small.
app.get('/api/bookings/:id/receipt', requireAdmin, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(404).json({ error: 'Booking not found' });
    const receipt = await bookingsRepo.getReceipt(pool, Number(req.params.id));
    if (receipt === undefined) return res.status(404).json({ error: 'Booking not found' });
    res.json({ receipt });
  } catch (error) {
    next(error);
  }
});

app.get('/api/package-purchases/:id/receipt', requireAdmin, async (req, res, next) => {
  try {
    if (!/^\d{1,9}$/.test(req.params.id)) return res.status(404).json({ error: 'Purchase not found' });
    const receipt = await packagesRepo.getReceipt(pool, Number(req.params.id));
    if (receipt === undefined) return res.status(404).json({ error: 'Purchase not found' });
    res.json({ receipt });
  } catch (error) {
    next(error);
  }
});

// The payment accounts shown at checkout. Anyone can read them; only the
// admin can change them.
app.get('/api/settings/payment', async (req, res, next) => {
  try {
    res.json({ payment: await settingsRepo.getPayment(pool) });
  } catch (error) {
    next(error);
  }
});

app.put('/api/settings/payment', requireAdmin, async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const payment = {};
    for (const [key, label, max] of [
      ['bpiName', 'BPI account name', 100], ['bpiNumber', 'BPI account number', 40],
      ['gcashName', 'GCash account name', 100], ['gcashNumber', 'GCash number', 40],
    ]) {
      const value = typeof body[key] === 'string' ? body[key].trim() : '';
      if (!value || value.length > max) return res.status(400).json({ error: `Please enter the ${label}` });
      payment[key] = value;
    }
    for (const [key, label] of [['bpiQr', 'The BPI QR code'], ['gcashQr', 'The GCash QR code']]) {
      const { image, error } = parseImage(body[key], label);
      if (error) return res.status(400).json({ error });
      payment[key] = image ?? '';
    }
    res.json({ payment: await settingsRepo.setPayment(pool, payment) });
  } catch (error) {
    next(error);
  }
});

// Newsletter sign-up from the home page.
app.post('/api/newsletter', async (req, res, next) => {
  try {
    if (await rateLimited(res, `newsletter:${clientIp(req)}`, 10, 60)) return;
    const firstName = typeof req.body?.firstName === 'string' ? req.body.firstName.trim() : '';
    const lastName = typeof req.body?.lastName === 'string' ? req.body.lastName.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!firstName || !lastName || `${firstName} ${lastName}`.length > 100) {
      return res.status(400).json({ error: 'Please enter your first and last name' });
    }
    if (!EMAIL.test(email) || email.length > 254) return res.status(400).json({ error: 'Please enter a valid email address' });
    await usersRepo.subscribe(pool, { email, name: `${firstName} ${lastName}` });
    res.status(201).json({ message: "You're on the list!" });
  } catch (error) {
    next(error);
  }
});

// One client's details for the admin's Client Directory.
app.get('/api/users/:email', requireAdmin, async (req, res, next) => {
  try {
    const email = String(req.params.email).toLowerCase();
    const profile = await usersRepo.getProfile(pool, email);
    if (!profile) return res.status(404).json({ error: 'Client not found' });
    res.json({
      profile,
      bookings: await bookingsRepo.getForClient(pool, email),
      packages: await packagesRepo.getForClient(pool, email),
    });
  } catch (error) {
    next(error);
  }
});

// A quick health check, including which mail service is in use. No secrets.
app.get('/api/health', (req, res) => {
  res.json({ ok: true, email: MAIL_MODE });
});

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

// Vercel imports this file and calls the app itself, so it must not also open
// a port there. Everywhere else (your laptop, Docker) it listens as usual.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`)
  });
}

export default app;
