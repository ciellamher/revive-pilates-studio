// The kinds of class the studio schedules, and how many people each takes by
// default. The admin can still change the capacity of any class.
export const CLASS_TYPES = [
  'Reformer Flow',
  'Mat Pilates',
  'Barre',
  'Private Session',
  'Duo Private',
]

export const DEFAULT_CAPACITY = {
  'Reformer Flow': 4,
  'Mat Pilates': 10,
  'Barre': 10,
  'Private Session': 1,
  'Duo Private': 2,
  'Trio Private': 3,
  'Clinical Pilates': 1,
}

// One-to-one or small-group sessions, as opposed to group classes.
export const isPrivateType = (title = '') => /private|clinical/i.test(title)

// Price of one booking paid directly, in pesos.
export function priceFor(title = '') {
  const t = title.toLowerCase()
  if (t.includes('duo')) return 2200
  if (t.includes('trio')) return 2000
  if (t.includes('clinical')) return 2800
  if (t.includes('private')) return 2500
  if (t.includes('mat') || t.includes('barre')) return 500
  return 1100
}
