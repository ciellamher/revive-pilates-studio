# Proposal

The submitted version was the Canvas answer for M6A1. This copy lives in the
repository so the plan and the code sit next to each other, and it is kept
updated: what changed since the proposal is recorded below rather than erased.

## The app

**Revive Studio Pilates Booking.** A booking site for a Pilates studio with two
branches, Angeles and San Fernando. Clients see live availability, pick their
own spot in a class, and pay by GCash or BPI with a receipt upload. The studio
admin checks each receipt and confirms or rejects the booking from a
dashboard.

**Who it is for.** Regular clients who currently book by direct message and
cannot see which slots are open, and the studio admin who verifies GCash
receipts by hand with no central record.

## Routes, as proposed and as built

| Route | Proposed | Built |
| --- | --- | --- |
| `/` | Home: branches, classes, schedule preview | Built |
| `/register` | Multi-step onboarding wizard | **Replaced** by `/login` (see below) |
| `/book` | Weekly schedule, filter by branch, class type, coach | Built |
| `/checkout` | Spot picker, GCash/BPI details, receipt upload | Built |
| `/admin` | Bookings with Pending / Confirmed / Cancelled status | Built, and grew (see below) |

Added along the way: `/pricing` and `/buy/:packageId` (packages), `/dashboard`
(the client's own bookings, packages and profile), `/pilates` (class types),
`/login` and `/verify` (sign-in), `/privacy`.

## The data it holds

| Object | Proposed | Built as |
| --- | --- | --- |
| User profile | id, email, role, health goals, injury flags | `users` table with name, phone and email preferences; admin is decided by `ADMIN_EMAILS`, not a column; health goals were cut |
| Scheduled classes | id, coach, branch, type, date and time, capacity, booked count | `classes` table; the booked count is computed from `bookings`, never stored |
| Booking requests | id, client, class, spot, receipt, status | `bookings` table; a unique index stops two people holding one spot |
| Class packages | id, client, type, sessions left, expiry | `user_packages` table; sessions left = bought minus bookings still holding a credit |

## The parts most likely to drift

- **Core features.**
  - *Cut: the registration wizard.* Accounts are now created by the first
    sign-in through an emailed one-time link. No passwords to store or reset,
    and one fewer screen between a new client and a booking. The health-goals
    and injury questions went with it; the studio asks them in person at the
    first class instead.
  - *Cut to stretch goal: waitlists.* A full class shows as full. Waitlisting
    needs automatic promotion when someone cancels, plus an email, and the
    payment-verification flow came first.
  - *Changed: the 3D isometric room.* Built as a flat, numbered spot map. It
    reads better on a phone and is quicker to tap.
  - *Added: packages and credits,* private sessions (solo, duo, trio,
    clinical), shareable packages, coach management, a drag-and-drop admin
    calendar, and email confirmations and reminders.
- **Where each piece is hosted.**
  - Client: Vercel (also built to GitHub Pages). Free tier catch: none that
    matters at this size.
  - API: Vercel serverless functions. Catch: a cold start on the first request
    after a quiet spell.
  - Database: Neon PostgreSQL, Singapore region. Catch: it pauses when idle,
    so the first query after a pause takes a few seconds.
  - Reminder job: GitHub Actions every 30 minutes. Catch: scheduled runs can
    start a few minutes late.
- **The date demo mode went off.** 2026-10-01, when the production API address
  was set in `client/.env.production`. The browser-only demo backend from the
  template has since been removed.
- **Risks.**
  - *Keeping the chosen class and spot across a refresh or sign-in:* solved.
    The checkout state is saved to `localStorage` before sign-in and restored
    after the emailed link brings the client back.
  - *The schedule's slot counts staying accurate:* solved at the database
    level rather than with live updates. Every booking checks the spot is still
    free inside the insert, and the unique index rejects a double booking, so
    a stale screen can never oversell a class.
  - *New risk that grew:* email delivery. Sign-in depends on it, so Gmail app
    passwords and rate limits became as important as the database.
