# Revive Pilates Studio

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

A full-stack booking application for a boutique Pilates studio with two branches. Clients can browse classes, pick their spot, purchase packages, and manage bookings, while the studio manages the schedule, coaches, and payments from an admin dashboard.

> **Live site:** https://revive-pilates-studio-6b8h.vercel.app
> **API:** https://revive-pilates-studio.vercel.app
> **Demo video:** https://drive.google.com/file/d/1RWbD6pSrBPUFyJ21UNNw4K2OX9kEm51Y/view?usp=sharing

---

### 01 — FEATURES

**For Clients**
- Browse classes and purchase packages (e.g., 10 Reformer classes).
- Pick specific spots (reformer, mat, or barre) for a chosen class.
- Pay via GCash or BPI and upload a receipt for admin verification.
- Manage profiles, upcoming bookings, and billing history through a passwordless magic-link account.
- Receive automated email notifications for bookings, package activations, and class reminders.

**For the Studio (Admin)**
- Verify and confirm/reject pending payment receipts for bookings and packages.
- Manage the schedule using a drag-and-drop, Google Calendar-style interface.
- Add and edit coaches, assigning them to specific branches.
- Access the client directory to view client details, packages, and booking history.

---

### 02 — HOW TO USE IT

**Book a class**
1. Open **Schedule**. Pick a day, then narrow it down with **Location**, **Classes** and **Instructor**.
2. Press **Book Now** on a class. If you are not signed in, enter your email and open the sign-in link sent to you; it brings you back to the same class.
3. On **Book this class**, click a free spot on the room map. Taken spots are greyed out.
4. Pay one of two ways:
   - **With a package credit** — confirmed straight away, with a confirmation email.
   - **With GCash or BPI** — send the amount shown, enter the reference number, attach the receipt, and submit. The booking stays **Pending** until the studio checks it.
5. See it under your name → **My schedule**. You can cancel up to 12 hours before class.

**Buy a package**
1. Open **Pricing** and choose a package.
2. Pay by GCash or BPI and submit the reference and receipt. It shows as **Pending** in **My packages** until the studio activates it; then the credits appear with their expiry date.

**Run the studio (admin)**
1. Sign in with an email listed in `ADMIN_EMAILS`. You land on the admin dashboard; from the site, use your name → **Studio admin**.
2. Choose the branch at the top left. Everything below follows it.
3. **Pending Verifications** — open a booking to see its receipt, compare the reference number with your GCash or BPI records, then **Confirm Booking** or **Reject**. Package payments are below: **Activate** or **Reject**. The client is emailed either way.
4. **Manage Schedule** — drag a class to move it, drag its bottom edge to change its length, or click an empty hour to add one. Open a class to see its roster and confirm, move or cancel bookings.
5. **Coaches** and **Client Directory** — add coaches to a branch; look up any client's bookings and packages.

---

### 03 — SCREENSHOTS

Every screen, from a local copy running the demo data (`npm run db:reset`). The client is **Ella**; the studio admin is **Revive**.

**Public pages**

| | |
| --- | --- |
| ![Home](docs/screenshots/01-home.jpg) **Home** | ![Pilates classes](docs/screenshots/02-pilates.jpg) **Pilates classes** |
| ![Pricing](docs/screenshots/03-pricing.jpg) **Pricing** | ![Sign in](docs/screenshots/06-login.jpg) **Sign in** |
| ![Schedule — list](docs/screenshots/04-schedule-list.jpg) **Schedule — list** | ![Schedule — calendar](docs/screenshots/05-schedule-calendar.jpg) **Schedule — calendar** |

**Client account**

| | |
| --- | --- |
| ![Book this class — spot picker and payment](docs/screenshots/07-checkout.jpg) **Book this class — spot picker and payment** | ![Buy a package](docs/screenshots/08-buy-package.jpg) **Buy a package** |
| ![My profile](docs/screenshots/09-client-profile.jpg) **My profile** | ![My schedule](docs/screenshots/10-client-schedule.jpg) **My schedule** |
| ![My packages](docs/screenshots/11-client-packages.jpg) **My packages** | ![Billing](docs/screenshots/12-client-billing.jpg) **Billing** |
| ![Notification settings](docs/screenshots/13-client-notifications.jpg) **Notification settings** |  |

**Admin dashboard**

| | |
| --- | --- |
| ![Pending Verifications and package payments](docs/screenshots/14-admin-pending.jpg) **Pending Verifications and package payments** | ![Manage Schedule — calendar](docs/screenshots/15-admin-calendar.jpg) **Manage Schedule — calendar** |
| ![Manage Schedule — list](docs/screenshots/16-admin-list.jpg) **Manage Schedule — list** | ![Coaches](docs/screenshots/17-admin-coaches.jpg) **Coaches** |
| ![Client Directory](docs/screenshots/18-admin-clients.jpg) **Client Directory** | ![Client profile](docs/screenshots/19-admin-client-profile.jpg) **Client profile** |
| ![Studio Settings](docs/screenshots/20-admin-settings.jpg) **Studio Settings** |  |

**On a phone (390px)**

| | | | |
| --- | --- | --- | --- |
| ![Home](docs/screenshots/21-phone-home.jpg) | ![Schedule](docs/screenshots/22-phone-schedule.jpg) | ![Checkout](docs/screenshots/23-phone-checkout.jpg) | ![My schedule](docs/screenshots/24-phone-dashboard.jpg) |

---

### 04 — TECH STACK

- **Client:** React 19, Vite, Tailwind CSS, React Router.
- **Server:** Node.js, Express, PostgreSQL (`pg`), JSON Web Tokens (`jsonwebtoken`), Nodemailer.
- **Hosting:** Vercel (client and API), Neon (PostgreSQL), GitHub Actions (reminder job).

---

### 05 — API ENDPOINTS

*Public* needs nothing; *signed in* needs a client session; *admin* needs a session for an `ADMIN_EMAILS` address. Errors come back as `{ "error": "..." }` with 400, 401, 403, 404, 409, 413 or 429 (too many requests).

| Method | Path | Access | What it does |
| --- | --- | --- | --- |
| GET | `/api/classes` | public | The schedule, with spots taken per class |
| POST, PATCH | `/api/classes`, `/api/classes/:id` | admin | Add a class; move, resize or cancel one |
| GET | `/api/classes/:id/bookings` | admin | A class's roster |
| GET | `/api/coaches` | public | Coaches and their branches |
| POST, PUT, DELETE | `/api/coaches`, `/api/coaches/:id` | admin | Manage coaches |
| POST | `/api/bookings` | signed in | Book a spot or a private session |
| GET, PATCH | `/api/bookings`, `/api/bookings/:id` | admin | List bookings; confirm or reject one |
| POST | `/api/bookings/:id/move` | admin | Move a booking to another class |
| GET | `/api/bookings/:id/receipt` | admin | The uploaded receipt image |
| GET | `/api/packages` | public | The package price list |
| GET, POST | `/api/me/packages` | signed in | My packages; buy one |
| GET, PATCH | `/api/package-purchases`, `/api/package-purchases/:id` | admin | List purchases; activate or reject one |
| POST | `/api/auth/login` | public | Email a one-time sign-in link |
| GET | `/api/auth/verify`, `/api/auth/me` | public / signed in | Exchange the link for a session; who am I |
| GET, PUT | `/api/me/profile` | signed in | My profile and email preferences |
| GET | `/api/me/bookings` | signed in | My bookings |
| POST | `/api/me/bookings/:id/cancel` | signed in | Cancel my booking (12-hour policy) |
| GET | `/api/users`, `/api/users/:email` | admin | Client directory; one client's history |
| GET, PUT | `/api/settings/payment` | public / admin | GCash and BPI details shown at checkout |
| POST | `/api/newsletter` | public | Join the mailing list |
| POST | `/api/reminders/send` | cron secret | Send due class reminders (GitHub Actions) |
| GET | `/api/health` | public | Health check |

---

### 06 — RUN IT LOCALLY

**Prerequisites:** Node.js 20+, PostgreSQL, Git.

**Clone and Install:**
```bash
git clone https://github.com/ciellamher/revive-pilates-studio.git
cd revive-pilates-studio
cd client && npm install
cd ../server && npm install
```

**Environment Variables:**
Copy `.env.example` to `.env` in both `client` and `server`. In `server/.env`, set `DATABASE_URL` to your PostgreSQL database and `ADMIN_EMAILS` to your own email. Leave the Gmail fields empty to send mail to a test inbox.

**Database Setup & Start:**
```bash
cd server
npm run db:reset   # tables, coaches, the October schedule and demo clients
npm run dev        # API on http://localhost:3000

# In a new terminal
cd client
npm run dev        # site on http://localhost:5173
```

> To sign in, enter your email on the site. With no Gmail set, the server terminal prints a preview link to the email; open it and click the sign-in link. Use the `ADMIN_EMAILS` address to reach the admin dashboard.

> `db:reset` only adds rows and replaces its own demo clients (`@example.com`), so it is safe to run twice.

---

### 07 — PROJECT STRUCTURE

- `client/` — React frontend: `src/pages/` per route, `src/components/` for shared pieces, `src/api/` for calls to the API.
- `server/` — Express API, database repositories (`*Repo.js`), and mailer configuration.
- `.github/workflows/` — CI/CD for GitHub Pages and cron jobs for email reminders.
- `docs/` — Proposal, mockups, design system, weekly reports, architecture, and screenshots.

---

### 08 — DEVELOPMENT PROGRESS

- **Week 1:** Wireframes, design system, and the full React frontend on mock data — [`04cd415`](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415), [`851472a`](https://github.com/ciellamher/revive-pilates-studio/commit/851472a); GitHub Pages fixes [`6b8518b`](https://github.com/ciellamher/revive-pilates-studio/commit/6b8518b), [`c995e32`](https://github.com/ciellamher/revive-pilates-studio/commit/c995e32).
- **Week 2:** Express API, magic-link sign-in and Nodemailer — [`47abd5c`](https://github.com/ciellamher/revive-pilates-studio/commit/47abd5c); security setup [`09f401a`](https://github.com/ciellamher/revive-pilates-studio/commit/09f401a).
- **Week 3:** PostgreSQL on Neon, real bookings and spot selection, packages, the drag-and-drop admin calendar, and Vercel deployment — [`2ead604`](https://github.com/ciellamher/revive-pilates-studio/commit/2ead604) onward; see [docs/04-weekly-reports.md](docs/04-weekly-reports.md).
- **Finals week:** demo data, template code removed, Client Directory query fixed — see [docs/04-weekly-reports.md](docs/04-weekly-reports.md).

---

### 09 — KNOWN LIMITATIONS

- Payments are not processed online; clients upload receipts for manual admin verification.
- Full classes cannot be waitlisted currently.
- The free Neon database pauses when idle, causing brief cold-start delays.

---

### 10 — AI USAGE

Built with **Claude** (Anthropic) as a coding assistant, used moderately: for boilerplate, library setup, debugging, and the finals-week demo data and clean-up. The UI design, the database schema, the booking and package rules, and the admin schedule were written by hand.

> Full breakdown, with commits: [AI-USAGE.md](AI-USAGE.md)

---

### 11 — LICENSE

MIT. See [LICENSE](LICENSE).
