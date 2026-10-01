// The one place email leaves the server.
//
// With GMAIL_USER and GMAIL_APP_PASSWORD set, mail is really delivered through
// that Gmail account. Without them it goes to an Ethereal test inbox instead:
// nothing reaches the recipient, and a preview link is printed to the console.
// That is the right behaviour on a laptop and the wrong one on a live site, so
// set both variables on your host.

import nodemailer from 'nodemailer'

const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env
const USING_GMAIL = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD)
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL)

// 'gmail' or 'test inbox', for GET /api/health.
export const MAIL_MODE = USING_GMAIL ? 'gmail' : 'test inbox'

let transporterPromise

function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = USING_GMAIL
      ? Promise.resolve(nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        }))
      : nodemailer.createTestAccount().then((account) => {
          console.warn('GMAIL_USER / GMAIL_APP_PASSWORD are not set: email goes to an Ethereal test inbox and is NOT delivered.')
          return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { user: account.user, pass: account.pass },
          })
        })
    // A failed setup should be retried on the next send, not remembered.
    transporterPromise.catch(() => { transporterPromise = undefined })
  }
  return transporterPromise
}

// Returns the Ethereal preview link in test mode, otherwise undefined.
export async function sendMail({ to, subject, html }) {
  // On a live site the test inbox would swallow every email while reporting
  // success. Fail loudly instead, so the problem shows up in the logs and the
  // admin's screen.
  if (IS_PRODUCTION && !USING_GMAIL) {
    throw new Error('Email is not set up: add GMAIL_USER and GMAIL_APP_PASSWORD on the host')
  }
  const transporter = await getTransporter()
  const info = await transporter.sendMail({
    from: `"Revive Pilates Studio" <${USING_GMAIL ? GMAIL_USER : 'noreply@revivestudio.com'}>`,
    to,
    subject,
    html,
  })
  const previewUrl = nodemailer.getTestMessageUrl(info) || undefined
  if (previewUrl) console.log('Email sent! Preview URL: %s', previewUrl)
  return previewUrl
}

// Names and class titles are typed in by people, so they are escaped before
// they go into an HTML email.
const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

// '2026-10-01' -> 'Thursday, October 1'. Parsed and formatted as UTC so the
// server's own timezone cannot move the day.
const formatDate = (isoDate) =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
  })

const layout = (heading, body) => `
  <div style="font-family: sans-serif; padding: 20px; color: #3A2A20;">
    <h2>${heading}</h2>
    ${body}
    <p style="margin-top: 24px; font-size: 13px; color: #8a7f76;">Revive Pilates Studio</p>
  </div>`

const classDetails = (r) => `
  <p style="line-height: 1.6;">
    <strong>${escapeHtml(r.title)}</strong> with ${escapeHtml(r.instructor)}<br>
    ${formatDate(r.date)} at ${escapeHtml(r.time)}<br>
    ${escapeHtml(r.branch)} Branch, spot ${r.spot}
  </p>`

export function sendReminder(recipient) {
  return sendMail({
    to: recipient.email,
    subject: `Reminder: ${recipient.title} on ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('See you in class', `
      <p>Hi ${escapeHtml(recipient.name)}, this is a reminder of your upcoming class.</p>
      ${classDetails(recipient)}
      <p>Please arrive a few minutes early. If you are more than 15 minutes late your session may be forfeited.</p>`),
  })
}

// Sent as soon as a client submits a booking paid directly, so they know it
// arrived while the studio checks the payment.
export function sendBookingReceived(recipient) {
  return sendMail({
    to: recipient.email,
    subject: `Booking received: ${recipient.title} on ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('We received your booking', `
      <p>Hi ${escapeHtml(recipient.name)}, thanks for booking with us. We are checking your payment and will email you again once your spot is confirmed.</p>
      ${classDetails(recipient)}`),
  })
}

export function sendPackageReceived(purchase) {
  return sendMail({
    to: purchase.clientEmail,
    subject: `Purchase received: ${purchase.name}`,
    html: layout('We received your purchase', `
      <p>Hi ${escapeHtml(purchase.clientName || 'there')}, thanks for buying <strong>${escapeHtml(purchase.name)}</strong> (${escapeHtml(purchase.price)}).</p>
      <p>We are checking your payment (reference ${escapeHtml(purchase.referenceId)}) and will email you once the package is active.</p>`),
  })
}

export function sendConfirmation(recipient) {
  return sendMail({
    to: recipient.email,
    subject: `Booking confirmed: ${recipient.title} on ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('Your booking is confirmed', `
      <p>Hi ${escapeHtml(recipient.name)}, we have verified your payment and your spot is reserved.</p>
      ${classDetails(recipient)}
      <p>We will email you a reminder about 12 hours before the class. To reschedule or cancel, let us know at least 12 hours before your session.</p>`),
  })
}

// '2026-11-30T08:00:00Z' -> 'Monday, November 30' in the studio's timezone.
const formatMoment = (moment) =>
  new Date(moment).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Manila',
  })

export function sendPackageActivated(purchase) {
  return sendMail({
    to: purchase.clientEmail,
    subject: `Your package is active: ${purchase.name}`,
    html: layout('Your package is ready to use', `
      <p>Hi ${escapeHtml(purchase.clientName || 'there')}, we have verified your payment for <strong>${escapeHtml(purchase.name)}</strong>.</p>
      <p>It is valid until ${formatMoment(purchase.expiresAt)}. Choose "Current Packages" when you book a class to use a credit.</p>`),
  })
}

export function sendPaymentRejected(recipient) {
  return sendMail({
    to: recipient.email,
    subject: `We couldn't verify your payment: ${recipient.title} on ${formatDate(recipient.date)}`,
    html: layout('We could not verify your payment', `
      <p>Hi ${escapeHtml(recipient.name)}, we could not match your payment for this booking, so your spot has been released.</p>
      ${classDetails(recipient)}
      <p>If you did pay, please reply to this email with your receipt and we will sort it out.</p>`),
  })
}

export function sendPackageRejected(purchase) {
  return sendMail({
    to: purchase.clientEmail,
    subject: `We couldn't verify your payment: ${purchase.name}`,
    html: layout('We could not verify your payment', `
      <p>Hi ${escapeHtml(purchase.clientName || 'there')}, we could not match your payment for <strong>${escapeHtml(purchase.name)}</strong> (reference ${escapeHtml(purchase.referenceId)}).</p>
      <p>If you did pay, please reply to this email with your receipt and we will sort it out.</p>`),
  })
}

export function sendBookingCancelled(recipient) {
  return sendMail({
    to: recipient.email,
    subject: `Booking cancelled: ${recipient.title} on ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('Your booking has been cancelled', `
      <p>Hi ${escapeHtml(recipient.name)}, the studio has cancelled your booking for this class.</p>
      ${classDetails(recipient)}
      <p>If you paid for it, please reply to this email or message the studio about a refund or a new booking.</p>`),
  })
}

export function sendBookingMoved(recipient, from) {
  return sendMail({
    to: recipient.email,
    subject: `Booking moved: ${recipient.title} on ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('Your booking has a new time', `
      <p>Hi ${escapeHtml(recipient.name)}, the studio has moved your booking from ${escapeHtml(from.title)} on ${formatDate(from.date)} at ${escapeHtml(from.time)} to:</p>
      ${classDetails(recipient)}
      <p>If this time does not work for you, please reply to this email or message the studio.</p>`),
  })
}

// `before` is the class as it was: { title, date, time, duration }.
export function sendClassRescheduled(recipient, before) {
  return sendMail({
    to: recipient.email,
    subject: `Class rescheduled: ${recipient.title} is now ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('Your class has a new time', `
      <p>Hi ${escapeHtml(recipient.name)}, the studio has changed the schedule for a class you booked. It was on ${formatDate(before.date)} at ${escapeHtml(before.time)} (${escapeHtml(before.duration)}). It is now:</p>
      ${classDetails(recipient)}
      <p>Your spot is kept. If the new time does not work for you, please reply to this email or message the studio.</p>`),
  })
}

export function sendCancellation(recipient) {
  return sendMail({
    to: recipient.email,
    subject: `Cancelled: ${recipient.title} on ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('Your class has been cancelled', `
      <p>Hi ${escapeHtml(recipient.name)}, we are sorry, the studio has had to cancel this class.</p>
      ${classDetails(recipient)}
      <p>Please reply to this email or message the studio to rebook or arrange a refund.</p>`),
  })
}
