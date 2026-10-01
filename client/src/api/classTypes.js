// The kinds of class the studio schedules.
//
// Group classes are Reformer Flow, Mat Pilates and Barre. A class can instead
// be a private session (solo, duo, trio or clinical), booked as a whole by one
// client; its title is then the private kind's title.
export const GROUP_CLASS_TYPES = ['Reformer Flow', 'Mat Pilates', 'Barre']

export const PRIVATE_KINDS = [
  { key: 'solo', title: 'Private Session', label: 'Solo (1 person)', capacity: 1 },
  { key: 'duo', title: 'Duo Private', label: 'Duo (2 people)', capacity: 2 },
  { key: 'trio', title: 'Trio Private', label: 'Trio (3 people)', capacity: 3 },
  { key: 'clinical', title: 'Clinical Pilates', label: 'Clinical (1 person)', capacity: 1 },
]

// A private session the admin schedules has room for the largest kind (a
// trio), so the client can book it as any kind at checkout.
export const PRIVATE_SESSION_CAPACITY = Math.max(...PRIVATE_KINDS.map(k => k.capacity))

// What each private kind is, for the client choosing one at checkout.
export const PRIVATE_KIND_DETAILS = {
  solo: 'One-on-one with your coach',
  duo: 'You and one more person',
  trio: 'You and two more people',
  clinical: 'One-on-one, therapy-focused',
}

// Clinical sessions can add dry needling, an additional service.
export const DRY_NEEDLING_PRICE = 500

// The schedule's class filter. All private kinds come under 'Private Session';
// the client picks solo, duo, trio or clinical when booking.
export const PRIVATE_FILTER = 'Private Session'
export const CLASS_FILTER_OPTIONS = ['Classes', ...GROUP_CLASS_TYPES, PRIVATE_FILTER]

// Links into the schedule (/book?category=…) and the filter each one opens.
export const CATEGORY_FILTERS = {
  reformer: 'Reformer Flow',
  mat: 'Mat Pilates',
  barre: 'Barre',
  private: PRIVATE_FILTER,
}

// Every title the schedule can show, for the class filter.
export const CLASS_TYPES = [...GROUP_CLASS_TYPES, ...PRIVATE_KINDS.map(k => k.title)]

export const DEFAULT_CAPACITY = {
  'Reformer Flow': 4,
  'Mat Pilates': 10,
  'Barre': 10,
  ...Object.fromEntries(PRIVATE_KINDS.map(k => [k.title, k.capacity])),
  'Private Session': PRIVATE_SESSION_CAPACITY,
}

// One-to-one or small-group sessions, as opposed to group classes.
export const isPrivateType = (title = '') => /private|clinical/i.test(title)

// 'solo', 'duo', 'trio', 'clinical' for a private title, else null.
export function privateKindOf(title = '') {
  const t = title.toLowerCase()
  if (t.includes('duo')) return 'duo'
  if (t.includes('trio')) return 'trio'
  if (t.includes('clinical')) return 'clinical'
  if (t.includes('private')) return 'solo'
  return null
}

// A duo, trio or clinical class is always that kind; any other private
// session can be booked as whichever kind fits the class.
export const hasFixedKind = (title = '') => /duo|trio|clinical/i.test(title)

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
