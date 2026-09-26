# Revive Pilates Studio

A full-stack web application designed for boutique pilates studios to manage class schedules, client bookings, and user accounts. It provides a seamless experience for clients to browse offerings, select their specific reformer or mat spot, and purchase pricing packages, while giving studio administrators the tools to manage operations.

Live site: [https://ciellamher.github.io/revive-pilates-studio/](https://ciellamher.github.io/revive-pilates-studio/)

> This deployment includes a functional backend using Node.js and Express. Some backend data is still using mock arrays for demonstration purposes, but the client-server architecture is in place.

## Features and Usage

The application supports the primary flow of a client discovering the studio and booking a class:
- **Discover & Explore:** Users can view the home page, read about class types (Pilates page), and browse membership options (Pricing page).
- **Authentication:** Clients can Register for a new account or Login to an existing one securely via a passwordless Magic Link (using JWT and Nodemailer).
- **Interactive Booking:** Users can view the weekly schedule, choose a specific class, and interactively select their spot (e.g., Reformer #3) in the studio.
- **Checkout:** A simulated checkout flow for purchasing class packages.
- **Client Dashboard:** Users can view their upcoming and past bookings.
- **Admin Dashboard:** Studio administrators can view schedules, manage classes, and see who is booked for each spot.

### API Endpoints
The backend provides the following REST API endpoints:
- `GET /api/users` - Fetch user list (mocked).
- `GET /api/classes` - Fetch class schedule.
- `POST /api/classes` - Add a new class.
- `PATCH /api/classes/:id` - Update class details.
- `GET /api/bookings` - Fetch bookings.
- `POST /api/bookings` - Create a booking.
- `PATCH /api/bookings/:id` - Update booking status.
- `POST /api/auth/login` - Request a magic link for login.
- `GET /api/auth/verify` - Verify magic link token and retrieve user profile.

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
```
*(Never commit real database credentials; the above are examples.)*

### Database Setup
To set up and seed the local PostgreSQL database:
```bash
cd server
npm run db:reset
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
- The frontend is now connected to the backend API, but the database connection for PostgreSQL queries is still pending. The backend currently holds state in memory (mock arrays) which resets upon server restart.
- Checkout process is visual only and does not process real payments.
- Nodemailer uses Ethereal email for development testing; real emails are not sent, but rather printed to the server console as preview links.

**Next Steps:**
- Connect and query the actual PostgreSQL database for users, classes, and bookings instead of using in-memory mock data.
- Ensure state persistence across server restarts.

## Author

Graciella Mhervie D. Jimenez | 6APSI | CS-402

## Licence

MIT, see [LICENSE](https://github.com/ciellamher/revive-pilates-studio/blob/main/LICENSE).
