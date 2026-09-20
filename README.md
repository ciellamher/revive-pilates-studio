# Revive Pilates Studio

A full-stack web application designed for boutique pilates studios to manage class schedules, client bookings, and user accounts. It provides a seamless experience for clients to browse offerings, select their specific reformer or mat spot, and purchase pricing packages, while giving studio administrators the tools to manage operations.

Live site: [https://ciellamher.github.io/revive-pilates-studio/](https://ciellamher.github.io/revive-pilates-studio/)

> This deployment is currently running a frontend-only build. The interface is real, but the backend data is mocked in the browser. 

## Features and Usage

The application supports the primary flow of a client discovering the studio and booking a class:
- **Discover & Explore:** Users can view the home page, read about class types (Pilates page), and browse membership options (Pricing page).
- **Authentication:** Clients can Register for a new account or Login to an existing one.
- **Interactive Booking:** Users can view the weekly schedule, choose a specific class, and interactively select their spot (e.g., Reformer #3) in the studio.
- **Checkout:** A simulated checkout flow for purchasing class packages.
- **Client Dashboard:** Users can view their upcoming and past bookings.
- **Admin Dashboard:** Studio administrators can view schedules, manage classes, and see who is booked for each spot.

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

![Revive Pilates Studio Home Page](./docs/screenshot.png?v=2)

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
- The frontend currently relies heavily on complex mocked data state. Managing this mock state for the `AdminDashboard` and `Booking` flows can sometimes lead to synchronization bugs if refreshed.
- Checkout process is visual only and does not process real payments.

**Next Steps:**
- Complete the Node.js/Express backend implementation.
- Connect the frontend pages to real API endpoints, removing the mock data.
- Implement real JWT/Session-based authentication for the Login and Register flows.
- Connect and query the actual PostgreSQL database for class schedules.

## Author

Graciella Mhervie D. Jimenez | 6APSI | CS-402

## Licence

MIT, see [LICENSE](https://github.com/ciellamher/revive-pilates-studio/blob/main/LICENSE).
