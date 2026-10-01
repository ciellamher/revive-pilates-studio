// Database-backed rate limiting. Each server instance on a serverless host
// starts empty, so counts kept in memory would reset constantly; the database
// sees every request.

// Records one use of `key` and returns true, or returns false (recording
// nothing) if `key` was already used `limit` times in the last `minutes`.
export async function allow(pool, key, limit, minutes) {
  // Keep the table small: anything older than a day is no longer counted.
  await pool.query("DELETE FROM rate_limit_events WHERE created_at < now() - interval '1 day'")
  const result = await pool.query(
    `INSERT INTO rate_limit_events (key)
     SELECT $1
     WHERE (SELECT count(*) FROM rate_limit_events
            WHERE key = $1 AND created_at > now() - make_interval(mins => $3)) < $2
     RETURNING 1`,
    [key, limit, minutes]
  )
  return result.rowCount > 0
}

// The caller's address. Vercel puts the real client first in x-forwarded-for.
export function clientIp(req) {
  return String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown').split(',')[0].trim()
}
