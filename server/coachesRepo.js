// Data access for coaches. Every value goes in the parameter array.

function toCoach(row) {
  const branches = []
  if (row.in_angeles) branches.push('Angeles')
  if (row.in_san_fernando) branches.push('San Fernando')
  return {
    id: String(row.id),
    name: row.name,
    specialty: row.specialty,
    bio: row.bio,
    branches,
  }
}

export async function getAll(pool) {
  const result = await pool.query('SELECT * FROM coaches ORDER BY name, id')
  return result.rows.map(toCoach)
}

export async function getById(pool, id) {
  const result = await pool.query('SELECT * FROM coaches WHERE id = $1', [id])
  return result.rows[0] ? toCoach(result.rows[0]) : null
}

export async function create(pool, { name, specialty, bio, branches }) {
  const result = await pool.query(
    `INSERT INTO coaches (name, specialty, bio, in_angeles, in_san_fernando)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, specialty, bio, branches.includes('Angeles'), branches.includes('San Fernando')]
  )
  return toCoach(result.rows[0])
}

export async function update(pool, id, { name, specialty, bio, branches }) {
  const result = await pool.query(
    `UPDATE coaches
     SET name = $2, specialty = $3, bio = $4, in_angeles = $5, in_san_fernando = $6
     WHERE id = $1
     RETURNING *`,
    [id, name, specialty, bio, branches.includes('Angeles'), branches.includes('San Fernando')]
  )
  return result.rows[0] ? toCoach(result.rows[0]) : null
}

// The branches where this coach has a class today or later that has not been
// cancelled. A coach cannot be switched off at a branch while they are on its
// upcoming schedule.
export async function getBranchesWithUpcomingClasses(pool, id) {
  const result = await pool.query(
    `SELECT DISTINCT branch FROM classes
     WHERE coach_id = $1 AND NOT is_cancelled AND class_date >= CURRENT_DATE`,
    [id]
  )
  return result.rows.map((row) => row.branch)
}

// Returns 'deleted', 'not-found', or 'in-use' when classes still point at the
// coach (the database refuses, which keeps old classes showing who taught them).
export async function remove(pool, id) {
  try {
    const result = await pool.query('DELETE FROM coaches WHERE id = $1', [id])
    return result.rowCount > 0 ? 'deleted' : 'not-found'
  } catch (error) {
    // 23503 is foreign_key_violation.
    if (error.code === '23503') return 'in-use'
    throw error
  }
}
