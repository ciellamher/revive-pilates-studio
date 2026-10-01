// Display helpers for packages. The catalog itself comes from GET /api/packages.

export const formatPeso = (value) => `₱${Number(value).toLocaleString('en-US')}`

export function expiryLabel(days) {
  if (days === 7) return '1 week'
  if (days === 365) return '1 year'
  if (days % 30 === 0) return days === 30 ? '1 month' : `${days / 30} months`
  return `${days} days`
}

// 'Valid for 2 months from date of first booking'
export const validityText = (pkg) =>
  `Valid for ${expiryLabel(pkg.expiryDays)} from ${pkg.startsOn === 'first-booking' ? 'your first booking' : 'purchase'}`

const CREDIT_LABELS = {
  reformer: 'Reformer group class',
  mat: 'Mat/Barre group class',
  group: 'Any group class',
  any: 'Any class or private session',
  private: 'Private session',
  duo: 'Duo private session',
  trio: 'Trio private session',
  clinical: 'Clinical session',
  unlimited: 'Unlimited group classes',
}
export const creditLabel = (type) => CREDIT_LABELS[type] ?? type

// Which credits a class can use, mirroring the server's rule.
export function creditTypesForClass(title = '', privateKind = null) {
  const t = title.toLowerCase()
  const kind = privateKind ?? (t.includes('duo') ? 'duo' : t.includes('trio') ? 'trio' : t.includes('private') ? 'solo' : null)
  if (kind === 'clinical' || t.includes('clinical')) return ['clinical', 'any']
  if (kind === 'duo') return ['duo', 'any']
  if (kind === 'trio') return ['trio', 'any']
  if (kind === 'solo') return ['private', 'any']
  if (t.includes('reformer')) return ['reformer', 'group', 'any', 'unlimited']
  if (t.includes('mat') || t.includes('barre')) return ['mat', 'group', 'any', 'unlimited']
  return []
}

// Whether a package can pay for a class with these credit types.
export const packageCovers = (purchase, types) =>
  types.some(type => (type === 'unlimited' ? purchase.unlimited : (purchase.credits?.[type]?.left ?? 0) > 0))

const CREDITS_FOR = {
  reformer: 'Reformer group classes',
  mat: 'Mat/Barre group classes',
  group: 'any group class',
  any: 'classes and appointments',
  private: 'private sessions',
  duo: 'duo private sessions',
  trio: 'trio private sessions',
  clinical: 'clinical sessions',
}

// '5 credits for Reformer group classes', or 'Unlimited group classes'.
export function creditsSummary(pkg) {
  if (pkg.unlimited) return 'Unlimited group classes'
  return Object.entries(pkg.credits)
    .map(([type, n]) => `${n} ${n === 1 ? 'credit' : 'credits'} for ${CREDITS_FOR[type] ?? type}`)
    .join(' + ')
}

export const PACKAGE_CATEGORIES = ['Starter Packages', 'Group Classes', 'Private Classes', 'Clinical Pilates', 'Membership']

// How many people a shareable package can be shared with (the server's MAX_SHARES).
export const MAX_SHARES = 3
