# Revive Pilates Studio

A full-stack booking app for a boutique Pilates studio with two branches (Angeles City and San Fernando). Clients browse classes, pick their own reformer or mat spot, pay by GCash or BPI, buy class packages and manage their bookings. The studio runs everything from an admin dashboard: the schedule, coaches, payment checks and clients.

**Live site:** https://revive-pilates-studio-6b8h.vercel.app
**API:** https://revive-pilates-studio.vercel.app (health check: [`/api/health`](https://revive-pilates-studio.vercel.app/api/health))

The site, API and database are all live. Classes, coaches, bookings, packages and client accounts are stored in PostgreSQL, and real emails are sent through the studio's Gmail account.

![Revive Pilates Studio Home Page](./docs/screenshot.jpg?v=1)

## Features

### For clients
- **Browse:** home, Pilates and pricing pages describe the studio, its class types and its packages.
- **Schedule:** a week view in list or calendar form, filterable by category (group or private), branch, class type and instructor. Classes that have started, are full or were cancelled are greyed out and cannot be booked. Classes at the same time sit side by side.
- **Booking:** pick a class, choose your spot on a picture of the room (reformers, mats or barre spots), then pay by GCash or BPI and enter the reference number, with an optional photo of the receipt. Private, duo, trio and clinical sessions can be booked online too, and an empty Reformer class can be booked as a private session.
- **Packages:** buy a package (for example 10 Reformer classes), which the studio activates after checking the payment. At checkout, "Current Packages" books a class with one credit, confirmed straight away.
- **Account:** sign in with a one-time emailed link (no password). The account page has an editable profile, upcoming and past bookings (cancellable up to 12 hours before class), packages with credits left, a billing history, and email preferences.
- **Emails:** sign-in link, booking or purchase received, booking confirmed, package activated, a reminder about 12 hours before class, and a notice if the studio cancels a class. Clients can switch reminders off.

### For the studio (admin)
Open to the email addresses listed in `ADMIN_EMAILS`.
- **Pending Verifications:** check each booking's reference number and receipt image, then confirm or reject it. Package purchases are activated or rejected the same way. Confirming emails the client.
- **Manage Schedule:** a Google Calendar-style week (8 AM to 8 PM). Drag a class to another day or time, drag its bottom edge to change its length, click an empty hour to add a class, or click a class to edit, cancel or restore it. Class types are Reformer Flow, Mat Pilates, Barre, Private Session, Duo Private, Trio Private and Clinical Pilates, each with a default capacity that can be changed. Times can be picked by the hour or typed (for example 10:15).
- **Coaches:** add and edit coaches with a specialty and bio, and choose whether each teaches at Angeles, San Fernando or both. Only a branch's coaches can be picked as its instructors, on both the admin and client side.
- **Client Directory:** every client with their booking count. "View Profile" shows their details, packages and bookings.
- **Studio Settings:** the GCash and BPI account names, numbers and QR codes shown to clients at checkout.

## Tech stack

- **Client:** React 19, Vite, Tailwind CSS, React Router. Components follow atomic design (atoms, molecules, organisms).
- **Server:** Node.js and Express, `pg` for PostgreSQL, `jsonwebtoken` for sign-in links and sessions, Nodemailer with Gmail for email.
- **Hosting:** Vercel (client and API as two projects, API in the Singapore region), Neon PostgreSQL (Singapore), and GitHub Actions for the half-hourly reminder job.

## Progress

| Week | What was done |
|---|---|
| Week 1 (Sep 14–20) | Proposal approved, wireframes and design system. Built the full React front end with mock data: home, Pilates, pricing, booking, checkout, login, client and admin dashboards. Deployed to GitHub Pages. |
| Week 2 (Sep 21–27) | Express API with mock data, magic-link sign-in with JWT and Nodemailer, front end connected to the API, security requirements. |
| Week 3 (Sep 28–Oct 4) | Moved everything into PostgreSQL and deployed the API and database (Vercel, Neon). Real bookings with spot selection and payment references, booking confirmation and cancellation, coaches per branch, real sign-in sessions with protected admin routes, Gmail email with 12-hour reminders, client account pages, package purchases and credits, receipt uploads, studio payment settings, private sessions, a newsletter sign-up, a privacy policy page, phone layouts, and a drag-and-drop admin calendar. |

The commit history on `main` shows each step.

## API endpoints

Routes marked *admin* need a signed-in admin session, and *signed in* routes need any client session (`Authorization: Bearer <session token>`).

**Schedule and coaches**
- `GET /api/classes`: the class schedule.
- `POST /api/classes`, `PATCH /api/classes/:id`: add or change a class; `{ "isCancelled": true }` cancels it and emails everyone booked. *admin*
- `GET /api/coaches`: coaches and the branches they teach at.
- `POST /api/coaches`, `PUT /api/coaches/:id`, `DELETE /api/coaches/:id`: manage coaches. *admin*

**Bookings**
- `POST /api/bookings`: book a spot (name, email, spot, payment reference, optional receipt image). Add `private: true` to book a whole empty Reformer class, or `packageId` to pay with a package credit.
- `GET /api/bookings`, `PATCH /api/bookings/:id`: list bookings, and confirm or reject one. Confirming emails the client. *admin*
- `GET /api/bookings/:id/receipt`: a booking's receipt image. *admin*

**Packages**
- `GET /api/packages`: the package catalog (prices, credits, expiry).
- `GET /api/me/packages`, `POST /api/me/packages`: a client's packages, and buying one. *signed in*
- `GET /api/package-purchases`, `PATCH /api/package-purchases/:id`, `GET /api/package-purchases/:id/receipt`: activate or reject purchases, and see their receipts. *admin*

**Accounts**
- `POST /api/auth/login`: email a one-time sign-in link.
- `GET /api/auth/verify`: exchange the link for a week-long session.
- `GET /api/auth/me`: who the current session belongs to.
- `GET /api/me/profile`, `PUT /api/me/profile`: a client's profile and email preferences. *signed in*
- `GET /api/me/bookings`, `POST /api/me/bookings/:id/cancel`: a client's bookings, and cancelling one up to 12 hours before class. *signed in*
- `GET /api/users`, `GET /api/users/:email`: the client directory, and one client's details. *admin*

**Studio**
- `GET /api/settings/payment`, `PUT /api/settings/payment`: the payment accounts shown at checkout. Saving is *admin*.
- `POST /api/newsletter`: sign up for studio news.
- `POST /api/reminders/send`: email reminders for confirmed classes starting within 12 hours. Needs `Authorization: Bearer <CRON_SECRET>`; the GitHub Actions workflow `.github/workflows/send-reminders.yml` calls it every half hour.
- `GET /api/health`: whether the API is up, and whether email goes through Gmail or the test inbox.

## Run it locally

### Prerequisites
- Node.js 20 or newer
- A PostgreSQL database: a local one, or a free Neon database
- Git

### Steps

1. **Clone and install:**
   ```bash
   git clone https://github.com/ciellamher/revive-pilates-studio.git
   cd revive-pilates-studio
   cd client && npm install
   cd ../server && npm install
   ```

2. **Configure the server.** Copy `server/.env.example` to `server/.env` and fill it in:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/pilates
   CORS_ORIGINS=http://localhost:5173
   JWT_SECRET=a_long_random_string
   ADMIN_EMAILS=you@example.com
   GMAIL_USER=
   GMAIL_APP_PASSWORD=
   CRON_SECRET=another_long_random_string
   ```
   - **`CORS_ORIGINS`:** the first address is also where sign-in links point.
   - **`GMAIL_USER` and `GMAIL_APP_PASSWORD`:** leave them empty locally and emails go to an Ethereal test inbox instead, with preview links on the sign-in page and in the server log. For real email, use a Gmail address and an [app password](https://myaccount.google.com/apppasswords).
   - **`JWT_SECRET` and `CRON_SECRET`:** generate each with `openssl rand -hex 32`.

3. **Configure the client.** Copy `client/.env.example` to `client/.env`:
   ```env
   VITE_USE_MOCK_API=false
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Create the tables:**
   ```bash
   cd server
   npm run db:schema
   ```
   This is safe to run again; it also brings an older database up to date.

5. **Start both** (two terminals):
   ```bash
   cd server && npm run dev     # API on http://localhost:3000
   cd client && npm run dev     # site on http://localhost:5173
   ```

6. **Sign in as admin:** open http://localhost:5173/login, enter an address from `ADMIN_EMAILS`, and click the link in the email (or the test-inbox link shown on the page). Add a coach under **Coaches**, then classes under **Manage Schedule**.

## Deployment

- **API:** a Vercel project with root directory `server`, running in the Singapore region (`server/vercel.json`). Set `DATABASE_URL` (added by the Neon integration), `JWT_SECRET`, `CORS_ORIGINS`, `ADMIN_EMAILS`, `GMAIL_USER`, `GMAIL_APP_PASSWORD` and `CRON_SECRET` in its environment variables. On Vercel the API refuses to start without `JWT_SECRET`, and refuses to fake email when Gmail is not set.
- **Site:** a second Vercel project with root directory `client`. The API address comes from `client/.env.production`, so it needs no environment variables.
- **Reminders:** the GitHub repository needs the Actions variable `VITE_API_BASE_URL` and the secret `CRON_SECRET` (the same value as on the API).
- **Updates:** every push to `main` redeploys both projects. Run `npm run db:schema` against the live database before pushing code that needs new tables or columns.

## Project structure

- `client/`: React front end.
  - `src/pages/`: one component per page (Home, Booking, Checkout, Dashboard, AdminDashboard, BuyPackage, Privacy…).
  - `src/components/`: atoms, molecules and organisms (schedule calendar, spot picker, payment panel, admin coaches and settings…).
  - `src/api/`: API address and session helpers, plus shared rules for times, class types and packages.
- `server/`: Express API.
  - `server.js`: routes and validation.
  - `*Repo.js`: database queries, one file per table.
  - `mailer.js`: every email the app sends.
  - `packagesCatalog.js`: package prices, credits and expiry.
  - `db/schema.sql`: the full database schema.
- `.github/workflows/`: GitHub Pages build and the reminder job.
- `docs/`: proposal, mockups, design system, weekly reports and security notes.

## Known limitations

- **Manual payment checks:** payments are not processed online. Clients pay by GCash or BPI and the studio checks each reference number and receipt by hand.
- **No waitlist:** a full class cannot be waitlisted yet.
- **Database wake-up:** the free Neon database pauses when idle, so the first request after a quiet spell can take a second or two longer.
- **School email filtering:** some school email systems (such as Microsoft 365) may hold sign-in emails in Junk or quarantine.

## AI Usage Credit

This project was developed with the assistance of Claude for generating boilerplate code, debugging, and step-by-step guidance on features outside the core scope. The original UI design (created in Figma), core business logic, domain research, and database schema were all authored manually by me. See `AI-USAGE.md` for a detailed breakdown.

## Author

Graciella Mhervie D. Jimenez | 6APSI | CS-402

## Licence

MIT, see [LICENSE](https://github.com/ciellamher/revive-pilates-studio/blob/main/LICENSE).
