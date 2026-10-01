// Times are stored as the studio's wall-clock label, like '08:30 AM'. These
// helpers turn them into minutes after midnight and back, and read what an
// admin types into a time box.

// The studio's day, as shown on the calendar.
export const DAY_START = 8 * 60
export const DAY_END = 20 * 60

export function labelToMinutes(label) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(label ?? '').trim())
  if (!match) return null
  let hours = Number(match[1]) % 12
  if (match[3].toUpperCase() === 'PM') hours += 12
  return hours * 60 + Number(match[2])
}

export function minutesToLabel(minutes) {
  const h24 = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  const suffix = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${suffix}`
}

// Accepts what people actually type: '9', '9am', '9:15', '9.15 pm', '14:30',
// '09:15 PM'. Without am/pm, 8–11 mean morning and 12–7 mean afternoon,
// matching the studio's hours. Returns minutes, or null if it isn't a time.
export function parseTimeInput(text) {
  const match = /^(\d{1,2})(?:[:.](\d{2}))?\s*(a\.?m?\.?|p\.?m?\.?)?$/i.exec(String(text ?? '').trim())
  if (!match) return null
  let hours = Number(match[1])
  const minutes = Number(match[2] ?? 0)
  if (minutes > 59 || hours > 23) return null
  const suffix = match[3]?.[0]?.toLowerCase()
  if (suffix) {
    if (hours < 1 || hours > 12) return null
    hours = (hours % 12) + (suffix === 'p' ? 12 : 0)
  } else if (hours >= 1 && hours <= 7) {
    hours += 12
  }
  return hours * 60 + minutes
}

export const durationOf = (cls) => parseInt(cls?.duration, 10) || 60

// Whole hours between two times, as labels, for the time dropdowns.
export function hourLabels(from, to) {
  const labels = []
  for (let m = from; m <= to; m += 60) labels.push(minutesToLabel(m))
  return labels
}

// Short form for the calendar: '9 AM', '9:30 AM'.
export function shortLabel(minutes) {
  const label = minutesToLabel(minutes)
  return label.replace(/^0/, '').replace(':00', '')
}
