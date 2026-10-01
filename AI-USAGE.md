# AI Usage

This document outlines how AI tools were used during the development of this project, as required by the M8A9 AI usage badge.

## How I used AI

I used Claude primarily to speed up the development of repetitive boilerplate and get quick reference guides for external libraries. This allowed me to focus my time on applying the core full-stack Node, Express, and PostgreSQL concepts I learned in class to the actual business logic.

1. **Setting up Tailwind configuration:** I provided Claude with my Figma design tokens and prompted it to generate the initial `tailwind.config.js` boilerplate, which I then manually refined. ([04cd415](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415))
2. **JWT Authentication boilerplate:** While I implemented the route protection logic myself, I used Claude to generate the initial stub for magic link authentication and the basic structure of the JWT verification middleware. ([47abd5c](https://github.com/ciellamher/revive-pilates-studio/commit/47abd5c))
3. **Nodemailer setup for booking receipts:** Instead of reading through the entire Nodemailer documentation, I asked Claude for a step-by-step guide on how to configure it to email clients when my Postgres database receives a new booking. ([c5c7523](https://github.com/ciellamher/revive-pilates-studio/commit/c5c7523))
4. **Postgres connection syntax:** I used Claude to quickly generate the basic `pg.Pool` connection syntax and an initial draft for `schema.sql`, which I then expanded significantly with my own relational table designs based on class lessons. ([2ead604](https://github.com/ciellamher/revive-pilates-studio/commit/2ead604))
5. **Client account pages boilerplate:** I used Claude to scaffold the initial HTML/Tailwind skeleton for the client accounts, saving me time before I applied my own React component structure and atomic design system. ([8c74058](https://github.com/ciellamher/revive-pilates-studio/commit/8c74058))
6. **Package expiry and trio attendee logic:** I brainstormed with Claude to help structure the initial domain logic for package expiry dates, before writing the actual Express routes and Postgres queries myself. ([5867d42](https://github.com/ciellamher/revive-pilates-studio/commit/5867d42))

## Where the AI got it wrong

Catching and fixing bad AI code is a crucial part of the development process. Relying on the concepts we learned about data integrity and state management, here are three instances where I had to step in and fix Claude's mistakes:

1. **Double-booking logic flaw:** Claude's booking logic completely missed edge cases for users booking the same class twice, and failed to prevent concurrent transactions effectively. I had to manually write the validation logic in the checkout flow and Express API, adding a warning dialog to alert users they were already booked. ([e834a4d](https://github.com/ciellamher/revive-pilates-studio/commit/e834a4d))
2. **UI layout issues on mobile:** Claude generated some flex and grid layouts that clipped on mobile devices or pushed elements off-screen. I had to manually audit and adjust the Tailwind classes, utilizing my knowledge of CSS to ensure the layout was responsive across phone screens. ([cad6337](https://github.com/ciellamher/revive-pilates-studio/commit/cad6337))
3. **Misunderstanding schedule dropdowns & class states:** Claude suggested React components that didn't correctly filter out started or cancelled classes in the schedule dropdown menus (the `overflow-hidden` CSS class was clipping the menus). It also allowed users to proceed to checkout without a valid class ID. I had to rewrite the logic in both `BookYourSpotSchedule.jsx` and `Checkout.jsx` to manage the React state properly. ([fa0af40](https://github.com/ciellamher/revive-pilates-studio/commit/fa0af40))

## Who wrote what

A significant portion of this project—well over the required 20% of the Node, Express, and Postgres app—was written entirely by me, applying the lessons from our course.

* **Core Express API & PostgreSQL Integrations:** I personally wrote the manual database schema updates and the associated Express REST endpoints (like `/api/bookings` and `/api/classes`) to securely handle real spot selection, manage checkout states, and tie them securely to user sessions. ([01661d2](https://github.com/ciellamher/revive-pilates-studio/commit/01661d2))
* **Private Sessions and Admin Control Backend:** I wrote the core Node/Express domain logic that allows classes to be bookable as private by default. I also manually wrote the complex Postgres queries (`SELECT`, `JOIN`, `UPDATE`) and routing logic that allows admins to manage private, duo, and trio session types from the backend. ([855eeb9](https://github.com/ciellamher/revive-pilates-studio/commit/855eeb9))
* **UI Design & React Frontend:** I designed the entire application from scratch using Figma before writing any code. The component structure and atomic design implementation were my own work based on those designs, ensuring the frontend connected smoothly to my Express backend. ([04cd415](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415))
* **Admin Drag-and-Drop Schedule:** The complex state management for the Google Calendar-style drag and drop schedule in the admin dashboard was implemented manually by me to ensure the studio had the exact tools we discussed. ([3341683](https://github.com/ciellamher/revive-pilates-studio/commit/3341683))
