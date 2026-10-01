# Revive Pilates Studio

A full-stack booking application for a boutique Pilates studio with two branches. Clients can browse classes, pick their spot, purchase packages, and manage bookings, while the studio manages the schedule, coaches, and payments from an admin dashboard.

> **Live site:** https://revive-pilates-studio-6b8h.vercel.app
> **API:** https://revive-pilates-studio.vercel.app

![Revive Pilates Studio Home Page](./docs/screenshot.jpg?v=1)

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

### 02 — TECH STACK

- **Client:** React 19, Vite, Tailwind CSS, React Router.
- **Server:** Node.js, Express, PostgreSQL (`pg`), JSON Web Tokens (`jsonwebtoken`), Nodemailer.
- **Hosting:** Vercel (Client and API), Neon (PostgreSQL), GitHub Actions (Cron jobs).

---

### 03 — API ENDPOINTS

Routes marked *admin* require a signed-in admin session; *signed in* routes require a client session.

**Schedule & Coaches**
- `GET /api/classes` — Retrieve the class schedule.
- `POST /api/classes`, `PATCH /api/classes/:id` — Add or modify a class (*admin*).
- `GET /api/coaches` — Retrieve coaches and branch assignments.
- `POST /api/coaches`, `PUT /api/coaches/:id`, `DELETE /api/coaches/:id` — Manage coaches (*admin*).

**Bookings & Packages**
- `POST /api/bookings` — Book a spot or private class.
- `GET /api/bookings`, `PATCH /api/bookings/:id` — List and manage bookings (*admin*).
- `GET /api/packages` — View the package catalog.
- `GET /api/package-purchases`, `PATCH /api/package-purchases/:id` — Manage package purchases (*admin*).

**Accounts & Studio**
- `POST /api/auth/login`, `GET /api/auth/verify` — Magic link authentication.
- `GET /api/me/profile`, `GET /api/me/bookings` — View client profile and bookings (*signed in*).
- `GET /api/settings/payment`, `PUT /api/settings/payment` — Studio payment settings.

---

### 04 — RUN IT LOCALLY

**Prerequisites:** Node.js 20+, PostgreSQL, Git.

**Clone and Install:**
```bash
git clone https://github.com/ciellamher/revive-pilates-studio.git
cd revive-pilates-studio
cd client && npm install
cd ../server && npm install
```

**Environment Variables:**
Copy `.env.example` to `.env` in both `client` and `server` directories and configure your database URL, JWT secret, and email settings.

**Database Setup & Start:**
```bash
cd server
npm run db:schema
npm run dev

# In a new terminal
cd client
npm run dev
```

---

### 05 — PROJECT STRUCTURE

- `client/` — React frontend utilizing atomic design (`src/components/atoms, molecules, organisms`).
- `server/` — Express API, database repositories (`*Repo.js`), and mailer configuration.
- `.github/workflows/` — CI/CD for GitHub Pages and chron jobs for email reminders.
- `docs/` — Proposal, mockups, design system, and security notes.

---

### 06 — DEVELOPMENT PROGRESS

- **Week 1:** Wireframes, design system, and full React frontend built with mock data.
- **Week 2:** Express API with mock data, magic-link sign-in, and Nodemailer integration.
- **Week 3:** PostgreSQL migration, real bookings, spot selection, Vercel/Neon deployment, and drag-and-drop admin calendar.

---

### 07 — KNOWN LIMITATIONS

- Payments are not processed online; clients upload receipts for manual admin verification.
- Full classes cannot be waitlisted currently.
- The free Neon database pauses when idle, causing brief cold-start delays.

---

### 08 — AI USAGE CREDIT

This project was developed with the assistance of Claude for generating boilerplate code, debugging, and step-by-step guidance on features outside the core scope. The original UI design, core business logic, domain research, and database schema were all authored manually by me. See `AI-USAGE.md` for a detailed breakdown.

---

### 09 — AUTHOR & LICENSE

**Author:** Graciella Mhervie D. Jimenez | 6APSI | CS-402

**License:** MIT
