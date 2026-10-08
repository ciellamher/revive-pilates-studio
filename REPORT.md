# Weekly Increment Report

Newest week first. Each change links the commit behind it.

## Week of: October 5, 2026 (Finals week)

## What changed this week

- Demo schedule for the rest of October and demo clients with package purchases and bookings, so the live site and admin dashboard show realistic data. [`2a377c9`](https://github.com/ciellamher/revive-pilates-studio/commit/2a377c9), [`84d6d93`](https://github.com/ciellamher/revive-pilates-studio/commit/84d6d93), [`ed5f588`](https://github.com/ciellamher/revive-pilates-studio/commit/ed5f588)
- Removed the class template's leftovers: the "sightings" example API and table, the browser-only demo backend, ten one-off Python scripts, and seven components nothing imported. [`3062ea3`](https://github.com/ciellamher/revive-pilates-studio/commit/3062ea3)
- `npm run db:reset` now builds a working database from nothing: schema, coaches, the schedule and demo clients. [`3062ea3`](https://github.com/ciellamher/revive-pilates-studio/commit/3062ea3)
- Malformed JSON now gets a 400 and an oversized body a 413, instead of a 500. [`3062ea3`](https://github.com/ciellamher/revive-pilates-studio/commit/3062ea3)
- Fixed the admin **Client Directory**, which returned a 500 on every load (see below). [`2f1542c`](https://github.com/ciellamher/revive-pilates-studio/commit/2f1542c)
- README: usage steps for booking, packages and the admin dashboard; screenshots of each main screen; an endpoint table checked against `server.js`.

## Why

The grader runs the app from the README, so it has to come up with data and every step has to work. Dead template code made the project look unfinished and hid what is actually mine.

## What broke or what I got stuck on

- The Client Directory query had `FILTER (...)` *inside* `array_agg(...)`; PostgreSQL only accepts it after the closing bracket, so the endpoint failed on every request. I found it while taking the admin screenshots, when the page said "No clients found" with 18 clients in the database. It now also returns an empty list instead of `NULL` for clients with no bookings.
- The first demo schedule had 7 AM classes, but the admin calendar only draws 8 AM to 8 PM, so they overlapped the header. Moved them to 10 or 11 AM. [`84d6d93`](https://github.com/ciellamher/revive-pilates-studio/commit/84d6d93)

## What is left

- Waitlists for full classes, the one proposal feature not built.
- About 15 React lint warnings (state set inside effects) that I left alone this close to the deadline.

## Week of: September 28, 2026 (Week 3)

## What changed this week

- Moved from mock data to PostgreSQL on Neon: classes, bookings, coaches and users are stored for real. [`2ead604`](https://github.com/ciellamher/revive-pilates-studio/commit/2ead604)
- Removed the separate register page; the first email sign-in creates the account. [`cad6337`](https://github.com/ciellamher/revive-pilates-studio/commit/cad6337)
- Client account pages and package purchases. [`8c74058`](https://github.com/ciellamher/revive-pilates-studio/commit/8c74058)
- Google Calendar-style admin schedule with drag and drop. [`3341683`](https://github.com/ciellamher/revive-pilates-studio/commit/3341683)
- Admin class roster: confirm, move and cancel bookings, with emails to the clients affected. [`01661d2`](https://github.com/ciellamher/revive-pilates-studio/commit/01661d2), [`05db03d`](https://github.com/ciellamher/revive-pilates-studio/commit/05db03d)
- Booking and purchase confirmation emails. [`c5c7523`](https://github.com/ciellamher/revive-pilates-studio/commit/c5c7523)
- New price list, private sessions (solo, duo, trio, clinical), package expiry and shareable packages. [`4303c6c`](https://github.com/ciellamher/revive-pilates-studio/commit/4303c6c), [`5867d42`](https://github.com/ciellamher/revive-pilates-studio/commit/5867d42), [`8fbb8c1`](https://github.com/ciellamher/revive-pilates-studio/commit/8fbb8c1)
- Admin dashboard filtered by branch. [`13ff20e`](https://github.com/ciellamher/revive-pilates-studio/commit/13ff20e)
- Deployed client and API to Vercel. [`662f466`](https://github.com/ciellamher/revive-pilates-studio/commit/662f466)

## Why

Week 2 left the API serving in-memory arrays, so nothing survived a restart. The studio's real problem is checking payments and keeping the schedule right, so the database and the admin tools came first.

## What broke or what I got stuck on

- Class dates risked shifting by a day: a PostgreSQL `DATE` passed through a JavaScript `Date` picks up a timezone, and Manila is 8 hours ahead of UTC. Avoided by reading it back as text with `to_char(class_date, 'YYYY-MM-DD')` (`server/classesRepo.js`).
- Every page change visibly scrolled to the top because the site uses smooth scrolling. Fixed by switching smooth scrolling off just for that jump. [`178fddf`](https://github.com/ciellamher/revive-pilates-studio/commit/178fddf)
- Several buttons and schedule dropdowns did nothing after the move to real data. [`122e2ba`](https://github.com/ciellamher/revive-pilates-studio/commit/122e2ba), [`fa0af40`](https://github.com/ciellamher/revive-pilates-studio/commit/fa0af40)

## What is left

- Presentation, slides and square image.
- Waitlists.

## Week of: September 20, 2026 (Week 1)

## What changed this week

- Finalized the core project concept and received official approval from the professor.
- Completed the low-fidelity wireframes to map out user flows and established the foundational design system.
- Initialized the final project repository (`revive-pilates-studio`) and migrated frontend draft work. [`4d826c8`](https://github.com/ciellamher/revive-pilates-studio/commit/4d826c8)
- Designed and built the complete frontend structure using React, Vite, and Tailwind CSS. [`04cd415`](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415)
- Implemented key pages including: Home, Pilates classes, Pricing, Booking, Checkout, Login, Register, Client Dashboard, and Admin Dashboard.
- Created a robust component architecture using atomic design principles (atoms, molecules, organisms).
- Integrated studio assets, photos, and styling; fixed brand colours missing from the Tailwind theme. [`851472a`](https://github.com/ciellamher/revive-pilates-studio/commit/851472a)

## Why

- To establish the foundational user interface and user experience for the Revive Pilates application.
- Building the frontend first allows me to visualize the user flows (like booking a class or purchasing a package) before designing the backend API that will support them.

## What broke or what I got stuck on

- Setting up the component folder structure and ensuring Tailwind CSS styles were consistently applied across all pages required some refactoring.
- Managing complex state for pages like the `AdminDashboard` and `Booking` flow using mock data was challenging to keep organized.

## What is left

- Backend API implementation using Node.js, Express, and PostgreSQL.
- Setting up the database schema and queries for users, classes, and bookings.
- Replacing frontend mock data with real API calls to the backend.
- User authentication (JWT or session-based) for logging in and protecting routes.
- Final deployment and video presentation.

## Week of: September 27, 2026 (Week 2)

## What changed this week

- Implemented backend server with Node.js and Express. [`47abd5c`](https://github.com/ciellamher/revive-pilates-studio/commit/47abd5c)
- Developed mock REST API endpoints for `users`, `classes`, and `bookings` to support frontend integration.
- Implemented a Magic Link authentication flow using JWT and Nodemailer (Ethereal email).
- Updated frontend pages (Dashboard, AdminDashboard, Booking, Login, Register) and components to integrate with the backend API.
- Added a `Verify` page to handle the magic link token verification.
- Configured GitHub Pages deployment settings (Vite base path and React Router basename) and successfully deployed the frontend. [`6b8518b`](https://github.com/ciellamher/revive-pilates-studio/commit/6b8518b), [`c995e32`](https://github.com/ciellamher/revive-pilates-studio/commit/c995e32)
- Handled security requirements and updated project configuration (e.g., renaming the database from haunted to pilates). [`09f401a`](https://github.com/ciellamher/revive-pilates-studio/commit/09f401a), [`c93215b`](https://github.com/ciellamher/revive-pilates-studio/commit/c93215b)
- Added CustomDropdown component to improve UI elements.

## Why

- To transition from static mock data to a functional client-server architecture.
- Magic link authentication provides a secure, passwordless login experience which aligns with modern security best practices.
- Setting up the deployment early ensures that integration issues are caught and the live link is available for the submission.

## What broke or what I got stuck on

- Encountered routing issues when deploying to GitHub Pages, which required fixing the Vite base path and React Router basename to work with a sub-path URL.
- Integrating the Nodemailer mock (Ethereal Email) required some troubleshooting to correctly log the preview URLs.
- The `origin/main` diverged with local branch due to deployment configurations, requiring careful merge or rebase.

## What is left

- Replace mock backend APIs with actual PostgreSQL database queries.
- Complete the database schema definitions for users, classes, and bookings.
- Final UI polish and addressing any edge-case bugs.
- Final presentation video recording (for Week 3).
