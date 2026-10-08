# Weekly reports

Five minutes a week. Add a new section at the top; never edit an old one.

The value is entirely in writing them **while it is happening**. What took four
hours and why is invisible a month later, and it is exactly what your journal
needs.

---

## Week of 2026-10-05 (finals week)

**Done.** The final submission, polished. Demo schedule for the rest of
October and demo clients with packages, so the live site and the admin
dashboard show real-looking data. Removed leftover template code (the
"sightings" example and the browser-only demo backend) and unused components.
Malformed JSON now gets a 400 instead of a 500. Filled in these docs.

**Stuck.** Nothing blocking. Pushes to GitHub failed for a few minutes with an
Internal Server Error on GitHub's side and went through on retry.

**Next.** Waitlists for full classes, the one feature cut from the proposal.

---

## Week of 2026-09-28 (week 3)

**Done.** The app moved from mock data to PostgreSQL on Neon and was deployed
to Vercel (site and API). Bookings with spot selection and a database-level
guard against double booking; packages with credits and expiry; private
sessions (solo, duo, trio, clinical); email sign-in links, confirmations and
reminders via a GitHub Actions job; a Google Calendar-style admin schedule with
drag and drop; a class roster where the admin confirms, moves or cancels
bookings; filtering the admin dashboard by branch. The register page was
removed in favour of email sign-in.

**Stuck.** Times shifting by a day: a `DATE` passed through a JavaScript
`Date` picks up a timezone. Fixed by reading dates back as text
(`to_char(class_date, 'YYYY-MM-DD')`). Smooth scrolling made every page change
visibly scroll to the top; fixed by switching it off for the jump.

**Next.** Presentation, slides and the square image.

---

## Week of 2026-09-21 (weeks 1 and 2)

Recorded in [REPORT.md](../REPORT.md), which was submitted each week: the full
React frontend on mock data in week 1, then the Express API, email sign-in and
the first deployment in week 2.
