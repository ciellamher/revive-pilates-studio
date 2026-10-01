import { isPrivateType } from './classTypes'

// What the schedule hands to /checkout about the class being booked.
export function checkoutClassState(cls) {
  const takenSpots = cls.takenSpots ?? []
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
    isWaitlist: cls.isFull,
    slotsLeft: Math.max(0, cls.capacity - takenSpots.length),
  }
}

// The same class booked as a private session: the whole room for one client.
export function checkoutPrivateState(cls) {
  return { ...checkoutClassState(cls), title: 'Private Class', isPrivate: true, isWaitlist: false, slotsLeft: 1 }
}

// A Reformer class nobody has booked yet can be taken as a private session.
export const canBookPrivately = (cls) =>
  !cls.isCancelled && !cls.isDone && (cls.takenSpots?.length ?? 0) === 0 && cls.title.toLowerCase().includes('reformer')

// What the schedule's 'Private Sessions' filter shows: classes that are
// private by type, and group Reformer classes that can be taken privately.
export const showsAsPrivate = (cls) => (isPrivateType(cls.title) && !cls.isCancelled && !cls.isDone) || canBookPrivately(cls)

// The link for a class under that filter.
export const privateFilterState = (cls) => (isPrivateType(cls.title) ? checkoutClassState(cls) : checkoutPrivateState(cls))
