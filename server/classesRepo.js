// Data access for class sessions. Same rules as sightingsRepo.js: every value
// goes in the parameter array, never into the SQL string.

// class_date is read back as text so it never passes through a JavaScript Date
// on the way out: a DATE has no timezone, and converting it would shift the day
// on a server that is not in the studio's timezone.
//
// taken_spots is the spot numbers already held in this class. A rejected or
// cancelled booking does not hold its spot; an active private booking holds
// all of them.
const COLUMNS = `
  id, title, to_char(class_date, 'YYYY-MM-DD') AS date, start_time,
  duration_min, coach_id, branch, capacity, is_cancelled, allow_private,
  ((class_date + to_timestamp(start_time, 'HH12:MI AM')::time) AT TIME ZONE 'Asia/Manila') <= now() AS has_started,
  (SELECT name FROM coaches WHERE id = classes.coach_id) AS instructor,
  CASE WHEN EXISTS (
    SELECT 1 FROM bookings
    WHERE class_id = classes.id AND is_private AND status NOT IN ('rejected', 'cancelled')
  )
  THEN ARRAY(SELECT generate_series(1, capacity))
  ELSE ARRAY(
    SELECT spot FROM bookings
    WHERE class_id = classes.id AND status NOT IN ('rejected', 'cancelled')
    ORDER BY spot
  ) END AS taken_spots`

// The shape the React client already works with.
function toClass(row) {
  const [year, month, day] = row.date.split('-').map(Number)
  return {
    id: String(row.id),
    title: row.title,
    date: row.date,
    dateId: new Date(year, month - 1, day).toDateString(),
    time: row.start_time,
    duration: `${row.duration_min} min`,
    coachId: String(row.coach_id),
    instructor: row.instructor,
    branch: row.branch,
    capacity: row.capacity,
    isCancelled: row.is_cancelled,
    // A Reformer class nobody has booked yet can be taken whole as a private
    // session, unless the admin switched that off.
    allowPrivate: row.allow_private,
    takenSpots: row.taken_spots,
    isFull: row.taken_spots.length >= row.capacity,
    isEmpty: row.taken_spots.length === 0,
    // Started classes are history: the schedule greys them out and the API
    // refuses new bookings for them.
    isDone: row.has_started,
  }
}

export async function getAll(pool) {
  const result = await pool.query(
    `SELECT ${COLUMNS} FROM classes ORDER BY class_date, id`
  )
  return result.rows.map(toClass)
}

export async function getById(pool, id) {
  const result = await pool.query(
    `SELECT ${COLUMNS} FROM classes WHERE id = $1`,
    [id]
  )
  return result.rows[0] ? toClass(result.rows[0]) : null
}

export async function create(pool, input) {
  const result = await pool.query(
    `INSERT INTO classes
       (title, class_date, start_time, duration_min, coach_id, branch, capacity, allow_private)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${COLUMNS}`,
    [
      input.title, input.date, input.time, input.durationMin,
      input.coachId, input.branch, input.capacity, input.allowPrivate ?? true,
    ]
  )
  return toClass(result.rows[0])
}

// A partial update: any field left out keeps its current value.
export async function update(pool, id, input) {
  const result = await pool.query(
    `UPDATE classes SET
       title        = COALESCE($2, title),
       class_date   = COALESCE($3::date, class_date),
       start_time   = COALESCE($4, start_time),
       duration_min = COALESCE($5::integer, duration_min),
       coach_id     = COALESCE($6::integer, coach_id),
       branch       = COALESCE($7, branch),
       capacity     = COALESCE($8::integer, capacity),
       is_cancelled = COALESCE($9::boolean, is_cancelled),
       allow_private = COALESCE($10::boolean, allow_private)
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [
      id,
      input.title ?? null, input.date ?? null, input.time ?? null,
      input.durationMin ?? null, input.coachId ?? null, input.branch ?? null,
      input.capacity ?? null, input.isCancelled ?? null, input.allowPrivate ?? null,
    ]
  )
  return result.rows[0] ? toClass(result.rows[0]) : null
}
