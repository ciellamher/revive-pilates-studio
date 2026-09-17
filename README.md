# Revive Pilates Studio

A full-stack application for booking and managing pilates classes. Built for pilates studios to handle schedules, bookings, and user accounts.

Live site: [https://ciellamher.github.io/revive-pilates-studio/](https://ciellamher.github.io/revive-pilates-studio/)
API: (coming soon)
Demo video: (coming soon)

> This deployment is running in demo mode. The interface is real; the backend is simulated in your browser so the site works without a server. See [Demo mode](#demo-mode) below. Delete this quote once your API is live.

## What it does

- Browse available pilates classes and schedules
- Book a spot in a class
- Manage your bookings

## Built with

React and Vite on the front end, Express and PostgreSQL on the back end. The client is on GitHub Pages, the API on (host), the database on (host).

## Demo mode

This repository can run two ways, chosen by one environment variable at build time.
Demo mode is the default. Only the exact string `false` turns it off, so a forgotten or mistyped variable leaves you on the simulated backend with a visible notice rather than on a silently broken build.

`VITE_USE_MOCK_API`

- **unset, or true:** The client answers its own requests from localStorage. No server, no database, nothing shared between visitors.
- **false:** The client calls the Express API at `VITE_API_BASE_URL`, which reads and writes real PostgreSQL.

## Running it yourself

The client only, in demo mode. No database needed.

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The whole stack. Needs a PostgreSQL, either local or hosted.

```bash
# 1. the database
docker run --name my-pg -e POSTGRES_PASSWORD=your_password_here -e POSTGRES_DB=pilates -p 5432:5432 -d postgres:17

# 2. the API
cd server
npm install
cp .env.example .env
npm run db:reset
npm run dev

# 3. the client, in another terminal
cd client
npm install
cp .env.example .env
# set VITE_USE_MOCK_API=false
npm run dev
```

## Environment variables

None of these are committed. `.env.example` in each folder lists them with placeholder values.

| Name | Where | What it is |
| --- | --- | --- |
| `DATABASE_URL` | server | PostgreSQL connection string. Contains a password |
| `CORS_ORIGINS` | server | comma-separated origins allowed to call the API |
| `NODE_ENV` | server | production on your host |
| `PORT` | server | set by the host, do not set it yourself |
| `VITE_USE_MOCK_API` | client, at build time | only false turns demo mode off; unset means on |
| `VITE_API_BASE_URL` | client, at build time | your API's public URL, no trailing slash |

## Deploying

Client, to GitHub Pages. Already wired up in `.github/workflows/deploy-pages.yml`. Two one-time steps:
Settings > Pages > Build and deployment > Source: GitHub Actions. Without this the workflow goes green and publishes nothing.

Nothing else, until your API is live. Demo mode is the default, so the first deploy works on its own. When the API is up, add `VITE_USE_MOCK_API = false` and `VITE_API_BASE_URL` under Settings > Secrets and variables > Actions > Variables, then re-run the workflow.

The repository must be public for Pages to serve it on a free account.

## Project structure

- `client/` React front end, built by Vite
  - `src/api/` ONE interface, two implementations, chosen by a variable
  - `src/components/`
- `server/` Express API
  - `db/` pool, schema.sql, seed.sql, and a runner for them
- `compose.yml` only if you self-host
- `docs/` your planning documents and weekly reports

## Architecture

(To be added)

## What I would do next

- Replace mock data with real studio schedule data
- Implement user authentication for class bookings
- Connect to real PostgreSQL database

## Author

Graciella Mhervie D. Jimenez | 6APSI | CS-402

## Licence

MIT, see [LICENSE](https://github.com/ciellamher/revive-pilates-studio/blob/main/LICENSE).
