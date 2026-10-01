// The packages the studio sells. This is the one source of truth for prices,
// credits and validity: the pricing pages read it from GET /api/packages, and
// a purchase copies the package's details at the moment it is bought, so later
// price changes here never alter what a client already paid for.
//
// Credit types:
//   reformer   Reformer group classes
//   mat        Mat Pilates or Barre group classes
//   group      any group class
//   any        any class or private session ("classes and appointments")
//   private    a solo private session
//   duo        a duo private session (one credit books the session for two)
//   trio       a trio private session (one credit books the session for three)
//   clinical   a clinical Pilates session (booked with the studio)
// A membership is `unlimited`: any group class, as often as wanted, while valid.
//
// startsOn says when the validity clock starts: 'purchase' (when the studio
// activates the payment) or 'first-booking' (when the first credit is used).

const DAYS = { week: 7, month: 30 }

const pkg = (id, category, title, price, expiryDays, startsOn, credits, extra = {}) => ({
  id, category, title, price, expiryDays, startsOn, credits, ...extra,
})

const REFORMER = 'Reformer Group Class Packages'
const MAT = 'Mat/Barre Group Class Packages'
const PRIVATE = 'Private Pilates Packages'
const DUO = 'Duo Private Pilates Packages'
const TRIO = 'Trio Private Pilates Packages'

export const PACKAGES = [
  pkg('revive-starter', 'Starter Packages', 'Revive Starter', 5220, DAYS.month, 'first-booking', { any: 3 }),
  pkg('intro-boost', 'Starter Packages', 'Intro Boost', 7380, DAYS.month, 'first-booking', { any: 5 }, { isIntro: true }),
  pkg('trial-one', 'Starter Packages', 'Trial One', 3240, 14, 'first-booking', { any: 2 }),
  pkg('trial-two', 'Starter Packages', 'Trial Two', 2880, DAYS.month, 'first-booking', { group: 4 }),

  pkg('reformer-1', 'Group Classes', 'Single Session', 1100, DAYS.week, 'purchase', { reformer: 1 }, { subtitle: REFORMER }),
  pkg('reformer-5', 'Group Classes', '5 Reformer Group Sessions', 5250, DAYS.month, 'first-booking', { reformer: 5 }, { subtitle: REFORMER }),
  pkg('reformer-10', 'Group Classes', '10 Reformer Group Sessions', 10000, 2 * DAYS.month, 'first-booking', { reformer: 10 }, { subtitle: REFORMER, shareable: true }),
  pkg('reformer-22', 'Group Classes', '22 Reformer Group Sessions', 20000, 4 * DAYS.month, 'first-booking', { reformer: 22 }, { subtitle: REFORMER, shareable: true }),
  pkg('reformer-36', 'Group Classes', '36 Reformer Group Sessions', 32000, 6 * DAYS.month, 'first-booking', { reformer: 36 }, { subtitle: REFORMER, shareable: true }),
  pkg('mat-1', 'Group Classes', 'Single Session', 600, DAYS.week, 'purchase', { mat: 1 }, { subtitle: MAT }),
  pkg('mat-5', 'Group Classes', '5 Mat/Barre Group Sessions', 2875, 2 * DAYS.month, 'purchase', { mat: 5 }, { subtitle: MAT }),
  pkg('mat-10', 'Group Classes', '10 Mat/Barre Group Sessions', 5500, 4 * DAYS.month, 'purchase', { mat: 10 }, { subtitle: MAT, shareable: true }),
  pkg('mat-20', 'Group Classes', '20 Mat/Barre Group Sessions', 10500, 8 * DAYS.month, 'first-booking', { mat: 20 }, { subtitle: MAT, shareable: true }),
  pkg('mat-30', 'Group Classes', '30 Mat/Barre Group Sessions', 15000, 365, 'first-booking', { mat: 30 }, { subtitle: MAT, shareable: true }),

  pkg('private-1', 'Private Classes', 'Single Session', 2500, DAYS.week, 'first-booking', { private: 1 }, { subtitle: PRIVATE }),
  pkg('private-intro', 'Private Classes', 'Intro Class', 6000, DAYS.month, 'purchase', { private: 3 }, { subtitle: PRIVATE, isIntro: true }),
  pkg('private-8', 'Private Classes', '8 Private Sessions', 19000, 2 * DAYS.month, 'purchase', { private: 8 }, { subtitle: PRIVATE }),
  pkg('private-12', 'Private Classes', '12 Private Sessions', 27600, 3 * DAYS.month, 'first-booking', { private: 12 }, { subtitle: PRIVATE }),
  pkg('duo-1', 'Private Classes', 'Duo Single Session', 4400, DAYS.week, 'first-booking', { duo: 1 }, { subtitle: DUO, shareable: true }),
  pkg('duo-8', 'Private Classes', '8 Duo Private Sessions', 34000, 2 * DAYS.month, 'first-booking', { duo: 8 }, { subtitle: DUO }),
  pkg('duo-12', 'Private Classes', '12 Duo Private Sessions', 48000, 3 * DAYS.month, 'first-booking', { duo: 12 }, { subtitle: DUO }),
  pkg('trio-1', 'Private Classes', 'Trio Single Session', 6000, DAYS.week, 'first-booking', { trio: 1 }, { subtitle: TRIO }),
  pkg('trio-8', 'Private Classes', '8 Trio Private Sessions', 46500, 2 * DAYS.month, 'first-booking', { trio: 8 }, { subtitle: TRIO }),
  pkg('trio-12', 'Private Classes', '12 Trio Private Sessions', 67500, 3 * DAYS.month, 'first-booking', { trio: 12 }, { subtitle: TRIO }),

  pkg('clinical-1', 'Clinical Pilates', 'Single Session', 2800, DAYS.month, 'purchase', { clinical: 1 }, { description: 'One-on-one Clinical Pilates session tailored to your individual goals and needs.' }),
  pkg('clinical-8', 'Clinical Pilates', '8 Clinical Private Sessions', 22000, 2 * DAYS.month, 'purchase', { clinical: 8 }, { description: 'Eight personalized Clinical Pilates sessions designed to help you develop strength, control, mobility, and consistency.' }),
  pkg('clinical-12', 'Clinical Pilates', '12 Clinical Private Sessions', 32000, 3 * DAYS.month, 'first-booking', { clinical: 12 }),

  pkg('unlimited-week', 'Membership', 'Unlimited Class Pass', 3500, DAYS.week, 'purchase', {}, { unlimited: true, description: 'Unlimited group classes at both branches for one week.' }),
]

export const CREDIT_TYPES = ['reformer', 'mat', 'group', 'any', 'private', 'duo', 'trio', 'clinical']

export const findPackage = (id) => PACKAGES.find((p) => p.id === id) ?? null

// Which credits a class can use, most specific first, so flexible credits
// last longest. Private kinds: 'solo', 'duo', 'trio', 'clinical'.
export function creditTypesForClass(title, privateKind = null) {
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

// How many people a shareable package can be shared with, besides the buyer.
export const MAX_SHARES = 3

export const formatPeso = (value) => `₱${value.toLocaleString('en-US')}`
