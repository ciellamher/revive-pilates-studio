# AI Usage

This document outlines how AI tools were used during the development of this project, as required by the M8A9 AI usage badge.

## How I used AI

I used Claude primarily to speed up the development of repetitive boilerplate and get quick reference guides for external libraries. This allowed me to focus my time on applying the core full-stack Node, Express, and PostgreSQL concepts I learned in class to the actual business logic.

1. **Setting up Tailwind configuration:** I provided Claude with my Figma design tokens and asked it for the Tailwind setup. This project uses Tailwind v4, so the tokens ended up in the `@theme` block of `client/src/index.css` rather than a `tailwind.config.js`; I then refined the names and values by hand. ([04cd415](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415))
2. **JWT Authentication boilerplate:** While I implemented the route protection logic myself, I used Claude to generate the initial stub for magic link authentication and the basic structure of the JWT verification middleware. ([47abd5c](https://github.com/ciellamher/revive-pilates-studio/commit/47abd5c))
3. **Nodemailer setup for booking receipts:** Instead of reading through the entire Nodemailer documentation, I asked Claude for a step-by-step guide on how to configure it to email clients when my Postgres database receives a new booking. ([c5c7523](https://github.com/ciellamher/revive-pilates-studio/commit/c5c7523))
4. **Postgres connection syntax:** I used Claude to quickly generate the basic `pg.Pool` connection syntax and an initial draft for `schema.sql`, which I then expanded significantly with my own relational table designs based on class lessons. ([2ead604](https://github.com/ciellamher/revive-pilates-studio/commit/2ead604))
5. **Client account pages boilerplate:** I used Claude to scaffold the initial HTML/Tailwind skeleton for the client accounts, saving me time before I applied my own React component structure and atomic design system. ([8c74058](https://github.com/ciellamher/revive-pilates-studio/commit/8c74058))
6. **Package expiry and trio attendee logic:** I brainstormed with Claude to help structure the initial domain logic for package expiry dates, before writing the actual Express routes and Postgres queries myself. ([5867d42](https://github.com/ciellamher/revive-pilates-studio/commit/5867d42))
7. **Finals-week clean-up and demo data (Claude Code):** I asked Claude Code to check the project against the final rubric. It wrote the demo schedule and demo clients (`server/db/october-schedule.sql`, `server/db/demo-clients.sql`) ([2a377c9](https://github.com/ciellamher/revive-pilates-studio/commit/2a377c9)) ([ed5f588](https://github.com/ciellamher/revive-pilates-studio/commit/ed5f588)), removed the class template's leftover "sightings" code and unused components, made `npm run db:reset` build a working database, and returned 400 instead of 500 for malformed JSON ([3062ea3](https://github.com/ciellamher/revive-pilates-studio/commit/3062ea3)). I kept these; I chose what the demo data should look like (realistic times, my real coaches, no real emails) and reviewed every screen it touched.

## Where the AI got it wrong

Catching and fixing bad AI code is a crucial part of the development process. Relying on the concepts we learned about data integrity and state management, here are three instances where I had to step in and fix Claude's mistakes:

1. **Double-booking logic flaw:** Claude's booking logic completely missed edge cases for users booking the same class twice, and failed to prevent concurrent transactions effectively. I had to manually write the validation logic in the checkout flow and Express API, adding a warning dialog to alert users they were already booked. ([e834a4d](https://github.com/ciellamher/revive-pilates-studio/commit/e834a4d))
2. **UI layout issues on mobile:** Claude generated some flex and grid layouts that clipped on mobile devices or pushed elements off-screen. I had to manually audit and adjust the Tailwind classes, utilizing my knowledge of CSS to ensure the layout was responsive across phone screens. ([cad6337](https://github.com/ciellamher/revive-pilates-studio/commit/cad6337))
3. **Misunderstanding schedule dropdowns & class states:** Claude suggested React components that didn't correctly filter out started or cancelled classes in the schedule dropdown menus (the `overflow-hidden` CSS class was clipping the menus). It also allowed users to proceed to checkout without a valid class ID. I had to rewrite the logic in both `BookYourSpotSchedule.jsx` and `Checkout.jsx` to manage the React state properly. ([fa0af40](https://github.com/ciellamher/revive-pilates-studio/commit/fa0af40))

4. **Demo classes outside the schedule grid:** Claude Code's first demo schedule put classes at 7:00 AM. The admin calendar only draws 8 AM to 8 PM, so those classes rendered over the header and overlapped. I spotted it on the live site; the fix moved them to 10 or 11 AM and the script was corrected so a re-run matches. ([84d6d93](https://github.com/ciellamher/revive-pilates-studio/commit/84d6d93))

## Who wrote what

A significant portion of this project—well over the required 20% of the Node, Express, and Postgres app—was written entirely by me, applying the lessons from our course.

* **Core Express API & PostgreSQL Integrations:** I personally wrote the manual database schema updates and the associated Express REST endpoints (like `/api/bookings` and `/api/classes`) to securely handle real spot selection, manage checkout states, and tie them securely to user sessions. Files: `server/server.js`, `server/bookingsRepo.js`, and the roster in `client/src/components/organisms/AdminClassRoster.jsx`. ([01661d2](https://github.com/ciellamher/revive-pilates-studio/commit/01661d2))
* **Private Sessions and Admin Control Backend:** I wrote the core Node/Express domain logic that allows classes to be bookable as private by default. I also manually wrote the complex Postgres queries (`SELECT`, `JOIN`, `UPDATE`) and routing logic that allows admins to manage private, duo, and trio session types from the backend. Files: `server/classesRepo.js` (the `allow_private` column on each class), `server/server.js`, and `client/src/pages/AdminDashboard.jsx`. ([855eeb9](https://github.com/ciellamher/revive-pilates-studio/commit/855eeb9))
* **UI Design & React Frontend:** I designed the entire application from scratch using Figma before writing any code. The component structure and atomic design implementation were my own work based on those designs, ensuring the frontend connected smoothly to my Express backend. Files: `client/src/pages/` (one page per route) and `client/src/components/organisms/`. ([04cd415](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415))
* **Admin Drag-and-Drop Schedule:** The complex state management for the Google Calendar-style drag and drop schedule in the admin dashboard was implemented manually by me to ensure the studio had the exact tools we discussed. File: `client/src/components/organisms/ClassScheduleGrid.jsx` — dragging a class converts the pixel distance into minutes, snaps it to 15-minute steps, and sends the new start time to `PATCH /api/classes/:id`. ([3341683](https://github.com/ciellamher/revive-pilates-studio/commit/3341683))

### The AI-written piece: `server/db/october-schedule.sql`

Claude Code wrote this file ([2a377c9](https://github.com/ciellamher/revive-pilates-studio/commit/2a377c9)) ([84d6d93](https://github.com/ciellamher/revive-pilates-studio/commit/84d6d93)), and I kept it as written. It fills the rest of October with classes in one `INSERT ... SELECT`:

- `generate_series(DATE '2026-10-08', DATE '2026-10-31', interval '1 day')` makes one row per day.
- A `VALUES` list is the studio's weekly template: weekday (`isodow`, 1 = Monday), branch, start time, class type and coach name. Joining it on `EXTRACT(ISODOW FROM day)` gives every class for every day.
- Coaches are joined **by name**, not by id, so the script works on any database seeded with the same coaches.
- Capacity comes from the class type (Reformer 4, Mat and Barre 10, private 1), and only Reformer and private classes allow private booking.
- `WHERE NOT EXISTS (... same date, time and branch ...)` skips any slot that already has a class. That is what makes it safe to run twice, and safe against the live database: it only ever inserts.

