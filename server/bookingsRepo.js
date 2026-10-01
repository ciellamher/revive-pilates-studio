// Data access for bookings. Every value goes in the parameter array.

// Class times are stored as the studio's wall-clock time ('08:30 AM' on a
// DATE), so turning one into a real moment needs the studio's timezone.
const STUDIO_TIMEZONE = 'Asia/Manila'
const CLASS_START = `((c.class_date + to_timestamp(c.start_time, 'HH12:MI AM')::time) AT TIME ZONE '${STUDIO_TIMEZONE}')`

const BOOKING_WITH_CLASS = `
  b.id, b.status, b.client_name, b.client_email, b.spot, b.reference_id, b.amount,
  c.title, to_char(c.class_date, 'YYYY-MM-DD') AS date, c.start_time,
  (SELECT name FROM coaches WHERE id = c.coach_id) AS instructor, c.branch`

// What the admin's Pending Verifications table reads.
function toBooking(row) {
  return {
    id: String(row.id),
    status: row.status,
    clientName: row.client_name,
    clientEmail: row.client_email,
    className: row.title,
    date: row.date,
    time: row.start_time,
    branch: row.branch,
    spot: row.spot,
    referenceId: row.reference_id,
    amount: row.amount,
  }
}

// What an email needs: who to write to and which class it is about.
function toRecipient(row) {
  return {
    bookingId: row.id,
    name: row.client_name,
    email: row.client_email,
    spot: row.spot,
    title: row.title,
    date: row.date,
    time: row.start_time,
    instructor: row.instructor,
    branch: row.branch,
  }
}

export async function getAll(pool) {
  const result = await pool.query(
    `SELECT ${BOOKING_WITH_CLASS}
     FROM bookings b JOIN classes c ON c.id = b.class_id
     ORDER BY b.created_at DESC`
  )
  return result.rows.map(toBooking)
}

// Returns { booking } on success, or { problem } naming why it was refused.
// The checks and the insert are one statement, so a class cannot be cancelled
// or start between the check and the insert.
export async function create(pool, input) {
  try {
    const inserted = await pool.query(
      `INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount)
       SELECT c.id, $2, $3, $4, $5, $6
       FROM classes c
       WHERE c.id = $1
         AND NOT c.is_cancelled
         AND $4 <= c.capacity
         AND ${CLASS_START} > now()
       RETURNING id`,
      [
        input.classId, input.clientName, input.clientEmail, input.spot,
        input.referenceId, input.amount,
      ]
    )
    if (inserted.rowCount === 0) return { problem: 'unavailable' }

    const result = await pool.query(
      `SELECT ${BOOKING_WITH_CLASS}
       FROM bookings b JOIN classes c ON c.id = b.class_id
       WHERE b.id = $1`,
      [inserted.rows[0].id]
    )
    return { booking: toBooking(result.rows[0]) }
  } catch (error) {
    // 23505 is unique_violation: someone else holds that spot.
    if (error.code === '23505') return { problem: 'spot-taken' }
    throw error
  }
}

// The booking's current status plus what an email about it needs.
export async function getRecipient(pool, id) {
  const result = await pool.query(
    `SELECT ${BOOKING_WITH_CLASS}
     FROM bookings b JOIN classes c ON c.id = b.class_id
     WHERE b.id = $1`,
    [id]
  )
  return result.rows[0]
    ? { ...toRecipient(result.rows[0]), status: result.rows[0].status }
    : null
}

export async function setStatus(pool, id, status) {
  try {
    const result = await pool.query(
      `UPDATE bookings b SET status = $2
       FROM classes c
       WHERE b.id = $1 AND c.id = b.class_id
       RETURNING ${BOOKING_WITH_CLASS}`,
      [id, status]
    )
    return { booking: result.rows[0] ? toBooking(result.rows[0]) : null }
  } catch (error) {
    // Un-rejecting a booking whose spot has since gone to someone else.
    if (error.code === '23505') return { problem: 'spot-taken' }
    throw error
  }
}

// Confirmed bookings whose class starts within the next `hours` hours and that
// have not been reminded yet.
export async function getDueReminders(pool, hours) {
  const result = await pool.query(
    `SELECT ${BOOKING_WITH_CLASS}
     FROM bookings b JOIN classes c ON c.id = b.class_id
     WHERE b.status = 'confirmed'
       AND b.reminder_sent_at IS NULL
       AND NOT c.is_cancelled
       -- Clients can switch reminders off in their account. No account means on.
       AND COALESCE((SELECT email_reminders FROM users WHERE email = b.client_email), true)
       AND ${CLASS_START} > now()
       AND ${CLASS_START} <= now() + make_interval(hours => $1)
     ORDER BY b.id`,
    [hours]
  )
  return result.rows.map(toRecipient)
}

// Claims a reminder before it is sent. Returns false if another run of the job
// got there first, which is what makes overlapping runs safe.
export async function claimReminder(pool, bookingId) {
  const result = await pool.query(
    `UPDATE bookings SET reminder_sent_at = now()
     WHERE id = $1 AND reminder_sent_at IS NULL`,
    [bookingId]
  )
  return result.rowCount > 0
}

// Gives the claim back when the email failed, so the next run tries again.
export async function releaseReminder(pool, bookingId) {
  await pool.query('UPDATE bookings SET reminder_sent_at = NULL WHERE id = $1', [bookingId])
}

// A client's own bookings, newest class first, for their account page.
// can_cancel follows the studio policy: up to 12 hours before the class.
export async function getForClient(pool, email) {
  const result = await pool.query(
    `SELECT ${BOOKING_WITH_CLASS}, b.created_at, c.duration_min, c.is_cancelled,
            ${CLASS_START} > now() AS is_upcoming,
            (${CLASS_START} > now() + interval '12 hours'
              AND b.status IN ('pending', 'confirmed')
              AND NOT c.is_cancelled) AS can_cancel
     FROM bookings b JOIN classes c ON c.id = b.class_id
     WHERE b.client_email = $1
     ORDER BY c.class_date DESC, b.id DESC`,
    [email]
  )
  return result.rows.map((row) => ({
    ...toBooking(row),
    instructor: row.instructor,
    duration: `${row.duration_min} min`,
    bookedAt: row.created_at,
    classCancelled: row.is_cancelled,
    isUpcoming: row.is_upcoming,
    canCancel: row.can_cancel,
  }))
}

// Cancels a client's own booking if the policy still allows it. Returns
// 'cancelled', 'not-found' (not theirs, or no such booking) or 'too-late'.
export async function cancelForClient(pool, id, email) {
  const result = await pool.query(
    `UPDATE bookings b SET status = 'cancelled'
     FROM classes c
     WHERE b.id = $1 AND b.client_email = $2 AND c.id = b.class_id
       AND b.status IN ('pending', 'confirmed')
       AND NOT c.is_cancelled
       AND ${CLASS_START} > now() + interval '12 hours'
     RETURNING b.id`,
    [id, email]
  )
  if (result.rowCount > 0) return 'cancelled'
  const owned = await pool.query('SELECT 1 FROM bookings WHERE id = $1 AND client_email = $2', [id, email])
  return owned.rowCount > 0 ? 'too-late' : 'not-found'
}

// Everyone who should hear that a class was cancelled.
export async function getRecipientsForClass(pool, classId) {
  const result = await pool.query(
    `SELECT ${BOOKING_WITH_CLASS}
     FROM bookings b JOIN classes c ON c.id = b.class_id
     WHERE b.class_id = $1 AND b.status NOT IN ('rejected', 'cancelled')
     ORDER BY b.id`,
    [classId]
  )
  return result.rows.map(toRecipient)
}
