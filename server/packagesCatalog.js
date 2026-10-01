// The packages the studio sells. This is the one source of truth for prices,
// credits and expiry: the pricing page reads it from GET /api/packages, and a
// purchase copies the package's details at the moment it is bought, so later
// price changes here never alter what a client already paid for.
//
// Credit types:
//   reformer  Reformer group classes
//   mat       Mat Pilates or Barre group classes
//   group     any group class
//   private   private, duo and trio sessions
//   clinical  clinical Pilates sessions

const MONTH = 30

const pkg = (id, category, title, price, expiryDays, credits, extra = {}) => ({
  id, category, title, price, expiryDays, credits, ...extra,
})

export const PACKAGES = [
  pkg('revive-starter', 'Starter Packages', 'Revive Starter', 5220, MONTH, { private: 1, group: 3 }, { sessions: '1 Private + 3 Group', originalPrice: 5800, note: 'Not shareable' }),
  pkg('intro-boost', 'Starter Packages', 'Intro Boost', 7380, MONTH, { private: 3, group: 2 }, { sessions: '3 Private + 2 Group', originalPrice: 8200, note: 'Not shareable', isIntro: true }),
  pkg('trial-one', 'Starter Packages', 'Trial One', 3240, 14, { private: 1, group: 1 }, { sessions: '1 Private + 1 Group', originalPrice: 3600, note: 'Not shareable' }),
  pkg('trial-two', 'Starter Packages', 'Trial Two', 2880, MONTH, { reformer: 2, mat: 2 }, { sessions: '2 Reformer + 2 Mat Group', originalPrice: 3198, note: 'Not shareable' }),

  pkg('reformer-1', 'Group Classes', 'Single Session', 1100, MONTH, { reformer: 1 }, { subtitle: 'Reformer Group Classes' }),
  pkg('reformer-5', 'Group Classes', '5-Session Package', 5250, MONTH, { reformer: 5 }, { subtitle: 'Reformer Group Classes' }),
  pkg('reformer-10', 'Group Classes', '10-Session Package', 10000, 2 * MONTH, { reformer: 10 }, { subtitle: 'Reformer Group Classes' }),
  pkg('reformer-22', 'Group Classes', '22-Session Package', 20000, 4 * MONTH, { reformer: 22 }, { subtitle: 'Reformer Group Classes' }),
  pkg('reformer-36', 'Group Classes', '36-Session Package', 32000, 6 * MONTH, { reformer: 36 }, { subtitle: 'Reformer Group Classes' }),
  pkg('mat-1', 'Group Classes', 'Single Session', 500, MONTH, { mat: 1 }, { subtitle: 'Mat/Barre Group Classes' }),
  pkg('mat-5', 'Group Classes', '5-Session Package', 2375, 2 * MONTH, { mat: 5 }, { subtitle: 'Mat/Barre Group Classes' }),
  pkg('mat-10', 'Group Classes', '10-Session Package', 4500, 4 * MONTH, { mat: 10 }, { subtitle: 'Mat/Barre Group Classes' }),
  pkg('mat-20', 'Group Classes', '20-Session Package', 8500, 8 * MONTH, { mat: 20 }, { subtitle: 'Mat/Barre Group Classes' }),
  pkg('mat-30', 'Group Classes', '30-Session Package', 12000, 365, { mat: 30 }, { subtitle: 'Mat/Barre Group Classes' }),

  pkg('private-1', 'Private Classes', 'Single Session', 2500, MONTH, { private: 1 }, { subtitle: 'Private Classes' }),
  pkg('private-intro', 'Private Classes', 'Intro Class', 6000, MONTH, { private: 3 }, { subtitle: 'Private Classes', sessions: '3-Session Package For First Timers', isIntro: true }),
  pkg('private-8', 'Private Classes', '8-Session Package', 19000, 2 * MONTH, { private: 8 }, { subtitle: 'Private Classes' }),
  pkg('private-12', 'Private Classes', '12-Session Package', 27600, 3 * MONTH, { private: 12 }, { subtitle: 'Private Classes' }),
  pkg('duo-1', 'Private Classes', 'Duo Private Session', 2200, MONTH, { private: 1 }, { subtitle: 'Duo Private Classes', note: 'per pax' }),
  pkg('duo-8', 'Private Classes', '8-Session Package', 17000, 2 * MONTH, { private: 8 }, { subtitle: 'Duo Private Classes', note: 'per pax' }),
  pkg('duo-12', 'Private Classes', '12-Session Package', 24000, 3 * MONTH, { private: 12 }, { subtitle: 'Duo Private Classes', note: 'per pax' }),
  pkg('trio-1', 'Private Classes', 'Trio Private Session', 2000, MONTH, { private: 1 }, { subtitle: 'Trio Private Classes', note: 'per pax' }),
  pkg('trio-8', 'Private Classes', '8-Session Package', 15500, 2 * MONTH, { private: 8 }, { subtitle: 'Trio Private Classes', note: 'per pax' }),
  pkg('trio-12', 'Private Classes', '12-Session Package', 22500, 3 * MONTH, { private: 12 }, { subtitle: 'Trio Private Classes', note: 'per pax' }),

  pkg('clinical-1', 'Clinical Pilates', 'Single Session', 2800, MONTH, { clinical: 1 }),
  pkg('clinical-8', 'Clinical Pilates', '8-Session Package', 22000, 2 * MONTH, { clinical: 8 }),
  pkg('clinical-12', 'Clinical Pilates', '12-Session Package', 32000, 3 * MONTH, { clinical: 12 }),
]

export const CREDIT_TYPES = ['reformer', 'mat', 'group', 'private', 'clinical']

export const findPackage = (id) => PACKAGES.find((p) => p.id === id) ?? null

// Which credit a group class uses. A class-specific credit is spent before a
// general 'group' credit, so mixed packages keep their flexibility longest.
export function creditTypesForClass(title) {
  const t = title.toLowerCase()
  if (t.includes('clinical')) return ['clinical']
  if (t.includes('private')) return ['private']
  if (t.includes('reformer')) return ['reformer', 'group']
  if (t.includes('mat') || t.includes('barre')) return ['mat', 'group']
  return []
}

export const formatPeso = (value) => `₱${value.toLocaleString('en-US')}`
