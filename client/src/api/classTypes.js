// The kinds of class the studio schedules.
//
// Group classes are Reformer Flow, Mat Pilates and Barre. A class can instead
// be a private session for one, two or three people, booked as a whole by one
// client; its title is then the private kind's title.
export const GROUP_CLASS_TYPES = ['Reformer Flow', 'Mat Pilates', 'Barre']

export const PRIVATE_KINDS = [
  { key: 'solo', title: 'Private Session', label: 'Solo (1 person)', capacity: 1 },
  { key: 'duo', title: 'Duo Private', label: 'Duo (2 people)', capacity: 2 },
  { key: 'trio', title: 'Trio Private', label: 'Trio (3 people)', capacity: 3 },
]

// Every title the schedule can show, for the class filter.
export const CLASS_TYPES = [...GROUP_CLASS_TYPES, ...PRIVATE_KINDS.map(k => k.title)]

export const DEFAULT_CAPACITY = {
  'Reformer Flow': 4,
  'Mat Pilates': 10,
  'Barre': 10,
  ...Object.fromEntries(PRIVATE_KINDS.map(k => [k.title, k.capacity])),
}

// One-to-one or small-group sessions, as opposed to group classes.
export const isPrivateType = (title = '') => /private|clinical/i.test(title)

// 'solo', 'duo', 'trio' for a private title, else null.
export function privateKindOf(title = '') {
  const t = title.toLowerCase()
  if (t.includes('duo')) return 'duo'
  if (t.includes('trio')) return 'trio'
  if (t.includes('private') || t.includes('clinical')) return 'solo'
  return null
}

export const privateKind = (key) => PRIVATE_KINDS.find(k => k.key === key)

// Price of one booking paid directly, in pesos. Private, duo and trio prices
// are for the whole session.
export function priceFor(title = '') {
  const t = title.toLowerCase()
  if (t.includes('duo')) return 4400
  if (t.includes('trio')) return 6000
  if (t.includes('clinical')) return 2800
  if (t.includes('private')) return 2500
  if (t.includes('mat') || t.includes('barre')) return 600
  return 1100
}
