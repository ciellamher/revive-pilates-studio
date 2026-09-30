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

// The admin's Client Directory: every account with how many bookings it has
// that were not rejected.
export async function getDirectory(pool) {
  const result = await pool.query(
    `SELECT u.email, u.name, to_char(u.created_at, 'YYYY-MM-DD') AS joined,
            count(b.id) FILTER (WHERE b.status <> 'rejected')::int AS bookings
     FROM users u
     LEFT JOIN bookings b ON b.client_email = u.email
     GROUP BY u.id
     ORDER BY u.name, u.email`
  )
  return result.rows
}
