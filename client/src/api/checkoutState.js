import { isPrivateType, privateKindOf, privateKind } from './classTypes'

// What the schedule hands to /checkout about the class being booked.
// Private, duo and trio classes are booked whole, so there is no spot to pick.
export function checkoutClassState(cls) {
  const takenSpots = cls.takenSpots ?? []
  const isPrivate = isPrivateType(cls.title)
  return {
    classId: cls.id,
    title: cls.title,
    instructor: cls.instructor,
    time: cls.time,
    date: cls.date,
    duration: cls.duration,
    branch: cls.branch,
    capacity: cls.capacity,
    takenSpots,
    isPrivate,
    privateKind: isPrivate ? privateKindOf(cls.title) : null,
    isWaitlist: cls.isFull,
    slotsLeft: Math.max(0, cls.capacity - takenSpots.length),
  }
}

// An empty group Reformer class taken whole as a private, duo or trio session.
export function checkoutPrivateState(cls, kind = 'solo') {
  return {
    ...checkoutClassState(cls),
    title: privateKind(kind).title,
    isPrivate: true,
    privateKind: kind,
    isWaitlist: false,
    slotsLeft: 1,
  }
}

// An empty Reformer class with room for the group can be taken as that kind
// of private session.
export const canBookPrivately = (cls, kind = 'solo') =>
  !cls.isCancelled && !cls.isDone && (cls.takenSpots?.length ?? 0) === 0 &&
  cls.title.toLowerCase().includes('reformer') && cls.capacity >= privateKind(kind).capacity

// The class filter's private choices ('Private Session', 'Duo Private',
// 'Trio Private') show sessions of that kind plus Reformer classes that can
// be taken as one.
export function matchesPrivateFilter(cls, filterTitle) {
  const kind = privateKindOf(filterTitle)
  if (cls.title === filterTitle) return true
  return canBookPrivately(cls, kind)
}

// The link for a class shown under a private filter.
export const privateFilterState = (cls, filterTitle) =>
  (cls.title === filterTitle ? checkoutClassState(cls) : checkoutPrivateState(cls, privateKindOf(filterTitle)))
