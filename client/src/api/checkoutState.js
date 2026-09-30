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
