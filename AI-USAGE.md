# AI Usage

This document outlines how AI tools were used during the development of this project, as required by the M8A9 AI usage badge.

## How I used AI

I used Claude primarily as a pair-programming assistant to help with boilerplate generation and step-by-step guidance for features outside the core scope.

1. **Setting up Tailwind configuration:** I provided Claude with my Figma design tokens and prompted it to generate the initial `tailwind.config.js` boilerplate, which I then refined. ([04cd415](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415))
2. **JWT Authentication boilerplate:** Claude wrote the initial stub for the magic link authentication and the JWT verification middleware in Express to protect admin routes. ([47abd5c](https://github.com/ciellamher/revive-pilates-studio/commit/47abd5c))
3. **Nodemailer setup for booking receipts:** I asked Claude for a step-by-step guide on how to configure Nodemailer to email clients when a booking or purchase is received in PostgreSQL. ([c5c7523](https://github.com/ciellamher/revive-pilates-studio/commit/c5c7523))
4. **Postgres connection code:** Claude generated the basic `pg.Pool` connection boilerplate and the initial draft for `schema.sql` to get the database off the ground quickly. ([2ead604](https://github.com/ciellamher/revive-pilates-studio/commit/2ead604))
5. **Client account pages boilerplate:** I used Claude to scaffold the initial React component structure for client accounts and package purchases before applying my own atomic design system. ([8c74058](https://github.com/ciellamher/revive-pilates-studio/commit/8c74058))
6. **Package expiry and trio attendee logic:** Claude helped structure the initial domain logic for adding package expiry dates and handling multiple attendee roles in the database. ([5867d42](https://github.com/ciellamher/revive-pilates-studio/commit/5867d42))

## Where the AI got it wrong

Catching and fixing bad AI code is a crucial part of the development process. Here are three instances where Claude got it wrong and I had to step in:

1. **Double-booking logic flaw:** Claude's booking logic completely missed edge cases for users booking the same class twice, and failed to prevent concurrent transactions effectively. I had to manually implement proper checking in the checkout flow and API, adding a warning dialog to alert users they were already booked. ([e834a4d](https://github.com/ciellamher/revive-pilates-studio/commit/e834a4d))
2. **UI layout issues on mobile:** Claude generated some flex and grid layouts that clipped on mobile devices or pushed elements off-screen. I had to manually audit and adjust the Tailwind classes, utilizing my knowledge of CSS grid to ensure the layout was responsive across phone screens. ([cad6337](https://github.com/ciellamher/revive-pilates-studio/commit/cad6337))
3. **Misunderstanding schedule dropdowns & class states:** Claude suggested React components that didn't correctly filter out started or cancelled classes in the schedule dropdown menus (the `overflow-hidden` CSS class was clipping the menus). It also allowed users to proceed to checkout without a valid class ID. I had to rewrite the logic in both `BookYourSpotSchedule.jsx` and `Checkout.jsx` to handle these states properly. ([fa0af40](https://github.com/ciellamher/revive-pilates-studio/commit/fa0af40))

## Who wrote what

A significant portion of this project—well over the required 20% of the Node, Express, and Postgres app—was written entirely by me.

* **UI Design & React Frontend:** I designed the entire application from scratch using Figma before writing any code. The component structure and atomic design implementation were my own work based on those designs. ([04cd415](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415))
* **Admin Drag-and-Drop Schedule:** The complex logic for the Google Calendar-style drag and drop schedule in the admin dashboard was implemented manually by me to ensure the studio had the exact tools we discussed. ([3341683](https://github.com/ciellamher/revive-pilates-studio/commit/3341683))
* **Private Sessions and Admin Control Backend:** I wrote the core Node/Express domain logic that allows classes to be bookable as private by default. I also manually wrote the Postgres queries and routing logic that allows admins to manage private, duo, and trio session types from the backend. ([855eeb9](https://github.com/ciellamher/revive-pilates-studio/commit/855eeb9))
* **Booking State Management and PostgreSQL Integrations:** I wrote the manual database schema updates and the associated Express endpoints (like `/api/bookings`) to securely handle real spot selection, manage checkout states, and tie them securely to user sessions. ([01661d2](https://github.com/ciellamher/revive-pilates-studio/commit/01661d2))
