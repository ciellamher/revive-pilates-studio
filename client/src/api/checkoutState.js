import { isPrivateType, privateKindOf, privateKind, hasFixedKind } from './classTypes'

// What the schedule hands to /checkout about the class being booked.
// Private sessions are booked whole, so there is no spot to pick. classTitle
// is the class's own title; title is what is being booked ("Duo Private").
export function checkoutClassState(cls) {
  const takenSpots = cls.takenSpots ?? []
  const isPrivate = isPrivateType(cls.title)
  return {
    classId: cls.id,
    title: cls.title,
    classTitle: cls.title,
    instructor: cls.instructor,
    time: cls.time,
    date: cls.date,
    duration: cls.duration,
    branch: cls.branch,
    capacity: cls.capacity,
    allowPrivate: cls.allowPrivate !== false,
    takenSpots,
    isPrivate,
    privateKind: isPrivate ? privateKindOf(cls.title) : null,
    isWaitlist: cls.isFull,
    slotsLeft: Math.max(0, cls.capacity - takenSpots.length),
  }
}

// The private kind to start checkout on: the one asked for if the class has
// room for it, otherwise solo. Duo, trio and clinical classes keep their own.
function startingKind(cls, kind) {
  if (hasFixedKind(cls.title)) return privateKindOf(cls.title)
  return privateKind(kind) && privateKind(kind).capacity <= cls.capacity ? kind : 'solo'
}

// A class booked whole as a private session. The client can still switch
// between the kinds the class has room for at checkout.
export function checkoutPrivateState(cls, kind = 'solo') {
  const chosen = startingKind(cls, kind)
  return {
    ...checkoutClassState(cls),
    title: privateKind(chosen).title,
    isPrivate: true,
    privateKind: chosen,
    isWaitlist: false,
    slotsLeft: 1,
  }
}

// An empty Reformer class can be taken whole as a private session, unless the
// admin made it group-only.
export const canBookPrivately = (cls, kind = 'solo') =>
  cls.allowPrivate !== false &&
  !cls.isCancelled && !cls.isDone && (cls.takenSpots?.length ?? 0) === 0 &&
  cls.title.toLowerCase().includes('reformer') && cls.capacity >= privateKind(kind).capacity

// The 'Private Session' filter shows every private session plus the Reformer
// classes that can be taken as one.
export const matchesPrivateFilter = (cls) => isPrivateType(cls.title) || canBookPrivately(cls)

// The checkout link for a class shown under the private filter. `kind` is the
// kind to start on (from /book?category=private&kind=clinical, say).
export const privateFilterState = (cls, kind = 'solo') => checkoutPrivateState(cls, kind)
