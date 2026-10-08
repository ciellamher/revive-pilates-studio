// Data access for client accounts. Every value goes in the parameter array.

// Creates the account the first time an email is seen. A later call only fills
// in the name if the account does not have one yet, so a booking made under a
// nickname cannot rename someone's account.
export async function upsert(pool, { email, name }) {
  const result = await pool.query(
    `INSERT INTO users (email, name)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE
       SET name = CASE WHEN users.name = '' THEN EXCLUDED.name ELSE users.name END
     RETURNING email, name`,
    [email, name ?? '']
  )
  return result.rows[0]
}

const PROFILE_COLUMNS = `
  id, email, name, phone, to_char(birth_date, 'YYYY-MM-DD') AS birth_date, gender,
  address, email_reminders, email_promotions, to_char(created_at, 'YYYY-MM-DD') AS joined`

function toProfile(row) {
  return {
    clientNo: String(row.id).padStart(6, '0'),
    email: row.email,
    name: row.name,
    phone: row.phone,
    birthDate: row.birth_date ?? '',
    gender: row.gender,
    address: row.address,
    emailReminders: row.email_reminders,
    emailPromotions: row.email_promotions,
    joined: row.joined,
  }
}

export async function getProfile(pool, email) {
  const result = await pool.query(`SELECT ${PROFILE_COLUMNS} FROM users WHERE email = $1`, [email])
  return result.rows[0] ? toProfile(result.rows[0]) : null
}

// Saves whichever fields are present; the rest keep their current value.
export async function updateProfile(pool, email, input) {
  const result = await pool.query(
    `UPDATE users SET
       name             = COALESCE($2, name),
       phone            = COALESCE($3, phone),
       birth_date       = CASE WHEN $4::text IS NULL THEN birth_date ELSE NULLIF($4::text, '')::date END,
       gender           = COALESCE($5, gender),
       address          = COALESCE($6, address),
       email_reminders  = COALESCE($7, email_reminders),
       email_promotions = COALESCE($8, email_promotions)
     WHERE email = $1
     RETURNING ${PROFILE_COLUMNS}`,
    [
      email, input.name ?? null, input.phone ?? null, input.birthDate ?? null,
      input.gender ?? null, input.address ?? null,
      input.emailReminders ?? null, input.emailPromotions ?? null,
    ]
  )
  return result.rows[0] ? toProfile(result.rows[0]) : null
}

// Newsletter sign-up: creates the account if needed, fills in a missing name,
// and switches promotional emails on.
export async function subscribe(pool, { email, name }) {
  await upsert(pool, { email, name })
  await pool.query('UPDATE users SET email_promotions = true WHERE email = $1', [email])
}

// The admin's Client Directory: every account with how many bookings it has
// that were not rejected.
export async function getDirectory(pool) {
  const result = await pool.query(
    `SELECT u.email, u.name, to_char(u.created_at, 'YYYY-MM-DD') AS joined,
            count(b.id) FILTER (WHERE b.status NOT IN ('rejected', 'cancelled'))::int AS bookings,
            COALESCE(array_agg(DISTINCT c.branch) FILTER (WHERE b.status NOT IN ('rejected', 'cancelled')), '{}') AS branches
     FROM users u
     LEFT JOIN bookings b ON b.client_email = u.email
     LEFT JOIN classes c ON c.id = b.class_id
     GROUP BY u.id
     ORDER BY u.name, u.email`
  )
  return result.rows
}
