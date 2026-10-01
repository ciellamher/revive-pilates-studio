// Studio settings, one JSON value per key. Every value goes in the parameter array.

// What checkout showed before the admin saved anything, so nothing changes
// until they do.
export const DEFAULT_PAYMENT = {
  bpiName: 'Klaudine Ann Mendoza Magbuhos',
  bpiNumber: '0280001011',
  bpiQr: '',
  gcashName: 'Shameel Jelaine Kehyeng',
  gcashNumber: '09283967447',
  gcashQr: '',
}

export async function getPayment(pool) {
  const result = await pool.query("SELECT value FROM studio_settings WHERE key = 'payment'")
  return { ...DEFAULT_PAYMENT, ...(result.rows[0]?.value ?? {}) }
}

export async function setPayment(pool, payment) {
  const result = await pool.query(
    `INSERT INTO studio_settings (key, value) VALUES ('payment', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
     RETURNING value`,
    [JSON.stringify(payment)]
  )
  return { ...DEFAULT_PAYMENT, ...result.rows[0].value }
}
