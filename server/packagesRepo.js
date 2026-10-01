// Data access for package purchases and the credits they hold. Every value
// goes in the parameter array.

import { CREDIT_TYPES, formatPeso } from './packagesCatalog.js'
import { BOOKABLE } from './bookingsRepo.js'

// Credits still free on a purchase, per type: bought minus the bookings that
// still hold one (a rejected or cancelled booking gives its credit back).
const REMAINING = Object.fromEntries(CREDIT_TYPES.map((type) => [type, `
  up.${type}_credits - (
    SELECT count(*) FROM bookings b
    WHERE b.user_package_id = up.id AND b.credit_type = '${type}'
      AND b.status NOT IN ('rejected', 'cancelled')
  )::int AS ${type}_left`]))

const COLUMNS = `
  up.id, up.user_email, up.package_id, up.name, up.price, up.expiry_days,
  up.reference_id, up.status, up.created_at, (up.receipt IS NOT NULL) AS has_receipt, up.activated_at, up.expires_at,
  up.unlimited, up.starts_on,
  (up.status = 'active' AND up.expires_at <= now()) AS is_expired,
  (SELECT name FROM users WHERE email = up.user_email) AS client_name,
  ${CREDIT_TYPES.map((type) => `up.${type}_credits, ${REMAINING[type]}`).join(',')}`

function toPurchase(row) {
  const credits = {}
  for (const type of CREDIT_TYPES) {
    if (row[`${type}_credits`] > 0) credits[type] = { total: row[`${type}_credits`], left: row[`${type}_left`] }
  }
  return {
    id: String(row.id),
    packageId: row.package_id,
    name: row.name,
    price: row.price,
    referenceId: row.reference_id,
    hasReceipt: row.has_receipt,
    status: row.is_expired ? 'expired' : row.status,
    clientEmail: row.user_email,
    clientName: row.client_name ?? '',
    expiryDays: row.expiry_days,
    purchasedAt: row.created_at,
    activatedAt: row.activated_at,
    expiresAt: row.expires_at,
    // An unlimited pass covers any group class while it is valid.
    unlimited: row.unlimited,
    // 'first-booking': the validity starts when the first credit is used, so
    // expiresAt stays empty until then.
    startsOn: row.starts_on,
    credits,
  }
}

export async function create(pool, email, pkg, referenceId, receipt) {
  const result = await pool.query(
    `INSERT INTO user_packages
       (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits,
        any_credits, private_credits, duo_credits, trio_credits, clinical_credits,
        unlimited, starts_on, expiry_days, reference_id, receipt)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
     RETURNING id`,
    [
      email, pkg.id, pkg.subtitle ? `${pkg.subtitle.replace(/ Packages$/, '')}: ${pkg.title}` : pkg.title, formatPeso(pkg.price),
      pkg.credits.reformer ?? 0, pkg.credits.mat ?? 0, pkg.credits.group ?? 0,
      pkg.credits.any ?? 0, pkg.credits.private ?? 0, pkg.credits.duo ?? 0, pkg.credits.trio ?? 0, pkg.credits.clinical ?? 0,
      Boolean(pkg.unlimited), pkg.startsOn, pkg.expiryDays, referenceId,
      receipt ?? null,
    ]
  )
  return getById(pool, result.rows[0].id)
}

export async function getReceipt(pool, id) {
  const result = await pool.query('SELECT receipt FROM user_packages WHERE id = $1', [id])
  return result.rows[0] ? result.rows[0].receipt : undefined
}

export async function getById(pool, id) {
  const result = await pool.query(`SELECT ${COLUMNS} FROM user_packages up WHERE up.id = $1`, [id])
  return result.rows[0] ? toPurchase(result.rows[0]) : null
}

export async function getForClient(pool, email) {
  const result = await pool.query(
    `SELECT ${COLUMNS} FROM user_packages up WHERE up.user_email = $1 ORDER BY up.created_at DESC`,
    [email]
  )
  return result.rows.map(toPurchase)
}

export async function getAll(pool) {
  const result = await pool.query(`SELECT ${COLUMNS} FROM user_packages up ORDER BY up.created_at DESC`)
  return result.rows.map(toPurchase)
}

// Activating starts the expiry clock. Only a pending purchase can change.
export async function setStatus(pool, id, status) {
  const result = await pool.query(
    `UPDATE user_packages SET
       status = $2,
       activated_at = CASE WHEN $2 = 'active' THEN now() ELSE activated_at END,
       expires_at = CASE WHEN $2 = 'active' AND starts_on = 'purchase' THEN now() + make_interval(days => expiry_days) ELSE expires_at END
     WHERE id = $1 AND status = 'pending'
     RETURNING id`,
    [id, status]
  )
  return result.rowCount > 0 ? getById(pool, id) : null
}

// Books a spot paid with one credit, inside a transaction that locks the
// purchase, so two bookings at once cannot spend the same last credit.
// Returns { booking } or { problem }.
export async function bookWithCredit(pool, { purchaseId, email, classId, spot, clientName, creditTypes, isPrivate = false, privateKind = null, guestNames = [] }) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const purchase = await client.query(
      `SELECT * FROM user_packages
       WHERE id = $1 AND user_email = $2 AND status = 'active' AND (expires_at IS NULL OR expires_at > now())
       FOR UPDATE`,
      [purchaseId, email]
    )
    if (purchase.rowCount === 0) {
      await client.query('ROLLBACK')
      return { problem: 'no-package' }
    }

    let creditType = null
    for (const type of creditTypes) {
      if (type === 'unlimited') {
        if (purchase.rows[0].unlimited) {
          creditType = 'unlimited'
          break
        }
        continue
      }
      const used = await client.query(
        `SELECT count(*)::int AS n FROM bookings
         WHERE user_package_id = $1 AND credit_type = $2 AND status NOT IN ('rejected', 'cancelled')`,
        [purchaseId, type]
      )
      if (used.rows[0].n < purchase.rows[0][`${type}_credits`]) {
        creditType = type
        break
      }
    }
    if (!creditType) {
      await client.query('ROLLBACK')
      return { problem: 'no-credit' }
    }

    // The class must happen while the package is still valid. A package that
    // starts at the first booking would run from now.
    const fits = await client.query(
      `SELECT ((c.class_date + to_timestamp(c.start_time, 'HH12:MI AM')::time) AT TIME ZONE 'Asia/Manila')
                <= COALESCE($2::timestamptz, now() + make_interval(days => $3)) AS ok,
              to_char(COALESCE($2::timestamptz, now() + make_interval(days => $3)) AT TIME ZONE 'Asia/Manila', 'FMDay, FMDD FMMonth YYYY') AS valid_until
       FROM classes c WHERE c.id = $1`,
      [classId, purchase.rows[0].expires_at, purchase.rows[0].expiry_days]
    )
    if (fits.rows[0] && !fits.rows[0].ok) {
      await client.query('ROLLBACK')
      return { problem: 'after-expiry', validUntil: fits.rows[0].valid_until }
    }

    // A package that starts at the first booking starts now.
    await client.query(
      `UPDATE user_packages SET expires_at = now() + make_interval(days => expiry_days)
       WHERE id = $1 AND expires_at IS NULL`,
      [purchaseId]
    )

    const inserted = await client.query(
      `INSERT INTO bookings
         (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, guest_names)
       SELECT c.id, $2, $3, $4, $5, '1 credit', 'confirmed', $6, $7, $8, $9, $10
       FROM classes c
       WHERE ${BOOKABLE('$4', '$8::boolean')}
       RETURNING id`,
      [classId, clientName, email, spot, `Package #${purchaseId}`, purchaseId, creditType, isPrivate, isPrivate ? (privateKind ?? 'solo') : null, guestNames]
    )
    if (inserted.rowCount === 0) {
      await client.query('ROLLBACK')
      return { problem: 'unavailable' }
    }
    await client.query('COMMIT')
    return { bookingId: inserted.rows[0].id }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    if (error.code === '23505') return { problem: 'spot-taken' }
    throw error
  } finally {
    client.release()
  }
}
