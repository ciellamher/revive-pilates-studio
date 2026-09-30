# Revive Pilates Studio

A full-stack web application designed for boutique pilates studios to manage class schedules, client bookings, and user accounts. It provides a seamless experience for clients to browse offerings, select their specific reformer or mat spot, and purchase pricing packages, while giving studio administrators the tools to manage operations.

Live site: [https://ciellamher.github.io/revive-pilates-studio/](https://ciellamher.github.io/revive-pilates-studio/)

> This deployment includes a functional backend using Node.js and Express. Classes, coaches, bookings and client accounts are stored in PostgreSQL.

## Features and Usage

The application supports the primary flow of a client discovering the studio and booking a class:
- **Discover & Explore:** Users can view the home page, read about class types (Pilates page), and browse membership options (Pricing page).
- **Authentication:** Clients can Register for a new account or Login to an existing one securely via a passwordless Magic Link (using JWT and Nodemailer).
- **Interactive Booking:** Users can view the weekly schedule, choose a specific class, and interactively select their spot (e.g., Reformer #3) in the studio.
- **Checkout:** A simulated checkout flow for purchasing class packages.
- **Client Dashboard:** Users can view their upcoming and past bookings.
- **Admin Dashboard:** Studio administrators can manage classes, verify bookings, manage coaches per branch, and see the client directory. It is only open to the emails listed in `ADMIN_EMAILS`.
- **Emails:** Clients are emailed when a booking is confirmed, about 12 hours before their class, and if the class is cancelled.

### API Endpoints
The backend provides the following REST API endpoints:
Routes marked *admin* need a signed-in admin session (`Authorization: Bearer <session token>`).
- `GET /api/classes` - Fetch the class schedule.
- `POST /api/classes` - Add a new class. *admin*
- `PATCH /api/classes/:id` - Update a class, or cancel/restore it with `{ "isCancelled": true }`. Cancelling emails everyone booked. *admin*
- `GET /api/coaches` - Fetch coaches and the branches they teach at.
- `POST /api/coaches`, `PUT /api/coaches/:id`, `DELETE /api/coaches/:id` - Manage coaches. *admin*
- `POST /api/bookings` - Book a spot in a class (name, email, spot, payment reference).
- `GET /api/bookings` - Fetch bookings. *admin*
- `PATCH /api/bookings/:id` - Confirm or reject a booking. Confirming emails the client. *admin*
- `GET /api/users` - Fetch the client directory. *admin*
- `POST /api/auth/login` - Email a one-time sign-in link.
- `GET /api/auth/verify` - Exchange the link's token for a week-long session.
- `GET /api/auth/me` - Who the current session belongs to.
- `POST /api/reminders/send` - Email a reminder to every confirmed booking whose class starts within 12 hours. Requires `Authorization: Bearer <CRON_SECRET>`; called every half hour by `.github/workflows/send-reminders.yml`.

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ciellamher/revive-pilates-studio.git
   cd revive-pilates-studio
   ```

2. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install Server Dependencies:**
   ```bash
   cd ../server
   npm install
   ```

### Environment and Configuration
Both the `client` and `server` directories contain a `.env.example` file. Copy these to create your `.env` files:

**Client `.env`:**
```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000/api
```

**Server `.env`:**
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/pilates
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=a_long_random_string
ADMIN_EMAILS=you@example.com
GMAIL_USER=yourstudio@gmail.com
GMAIL_APP_PASSWORD=a_gmail_app_password
CRON_SECRET=another_long_random_string
```
Leave `GMAIL_USER` and `GMAIL_APP_PASSWORD` empty locally and email goes to an Ethereal test inbox instead of being delivered.

*(Never commit real database credentials; the above are examples.)*

### Database Setup
To create the tables in the database that `DATABASE_URL` points to:
```bash
cd server
npm run db:schema
```

## How to run it

To start the application in development mode:

1. **Start the API Server** (in one terminal):
   ```bash
   cd server
   npm run dev
   ```
   *Expected output: "Server running on port 3000"*

2. **Start the Client** (in a second terminal):
   ```bash
   cd client
   npm run dev
   ```
   *Expected output: "Vite server running at http://localhost:5173"*

Open `http://localhost:5173` in your browser. You should see the Revive Pilates Studio home page.

## Screenshots

![Revive Pilates Studio Home Page](./docs/screenshot.jpg?v=1)

## Project structure

- `client/` - React frontend built with Vite and Tailwind CSS.
  - `src/components/` - Organized using Atomic Design (atoms, molecules, organisms).
  - `src/pages/` - Main route components (Home, Booking, Dashboard, etc.).
  - `src/assets/` - Static images and styles.
- `server/` - Node/Express backend API.
  - `db/` - Database schema, seed data, and connection pool.
- `docs/` - Planning documents and weekly reports.

## Known issues and next steps

**Known Issues:**
- The client dashboard (schedule, packages, billing) still shows sample data apart from the signed-in name and email.
- The proof-of-payment upload is visual only; the admin verifies a booking by its payment reference number.
- Checkout process is visual only and does not process real payments.
- Without a Gmail account configured, Nodemailer falls back to Ethereal: emails are not delivered, and preview links are printed to the server console.

**Next Steps:**
- Show a client's real bookings in their dashboard.
- Store proof-of-payment images.

## Author

Graciella Mhervie D. Jimenez | 6APSI | CS-402

## Licence

MIT, see [LICENSE](https://github.com/ciellamher/revive-pilates-studio/blob/main/LICENSE).
