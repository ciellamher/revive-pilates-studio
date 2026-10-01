// Display helpers for packages. The catalog itself comes from GET /api/packages.

export const formatPeso = (value) => `₱${Number(value).toLocaleString('en-US')}`

export function expiryLabel(days) {
  if (days === 365) return '1 year'
  if (days % 30 === 0) return days === 30 ? '1 month' : `${days / 30} months`
  return `${days} days`
}

const CREDIT_LABELS = {
  reformer: 'Reformer group',
  mat: 'Mat/Barre group',
  group: 'Any group class',
  private: 'Private',
  clinical: 'Clinical',
}
export const creditLabel = (type) => CREDIT_LABELS[type] ?? type

// Which credits a class can use, mirroring the server's rule.
export function creditTypesForClass(title = '') {
  const t = title.toLowerCase()
  if (t.includes('clinical')) return ['clinical']
  if (t.includes('private')) return ['private']
  if (t.includes('reformer')) return ['reformer', 'group']
  if (t.includes('mat') || t.includes('barre')) return ['mat', 'group']
  return []
}
