# AI Usage

This document outlines how AI tools were used during the development of this project, as required by the M8A9 AI usage badge.

## How I used AI

I used Claude primarily as a pair-programming assistant to help with boilerplate generation and step-by-step guidance for features outside the core scope. 

1. **Setting up Tailwind configuration:** Claude helped generate the initial `tailwind.config.js` boilerplate based on my Figma design tokens. ([04cd415](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415))
2. **JWT Authentication boilerplate:** Claude wrote the initial stub for the magic link authentication and JWT verification middleware. ([47abd5c](https://github.com/ciellamher/revive-pilates-studio/commit/47abd5c))
3. **Nodemailer setup for booking receipts:** I asked Claude for a step-by-step guide on how to configure Nodemailer to email clients when a booking or purchase is received. ([c5c7523](https://github.com/ciellamher/revive-pilates-studio/commit/c5c7523))
4. **Postgres connection code:** Claude generated the basic `pg.Pool` connection code and initial draft for `schema.sql`. ([2ead604](https://github.com/ciellamher/revive-pilates-studio/commit/2ead604))
5. **Client account pages boilerplate:** Used Claude to quickly scaffold the basic layout structure for client accounts and package purchases. ([8c74058](https://github.com/ciellamher/revive-pilates-studio/commit/8c74058))
6. **Package expiry and trio attendee logic:** Claude helped structure the initial logic for adding package expiry dates and multiple attendee roles. ([5867d42](https://github.com/ciellamher/revive-pilates-studio/commit/5867d42))

## Where the AI got it wrong

Catching and fixing bad AI code is a crucial part of the development process. Here are three instances where Claude got it wrong:

1. **Double-booking logic flaw:** Claude initially missed edge cases with double-booking spots and spot picking. I had to fix this logic myself and add proper warnings and dialogs. ([e834a4d](https://github.com/ciellamher/revive-pilates-studio/commit/e834a4d))
2. **UI layout issues on mobile:** Claude generated some layouts that looked broken on mobile devices. I had to manually adjust the Tailwind classes and tidy up the layouts for phone screens. ([cad6337](https://github.com/ciellamher/revive-pilates-studio/commit/cad6337))
3. **Misunderstanding schedule dropdowns & class states:** Claude suggested React components that didn't correctly filter out started or cancelled classes in the schedule dropdowns. I fixed the logic so it filters properly and doesn't let users checkout without a valid class. ([fa0af40](https://github.com/ciellamher/revive-pilates-studio/commit/fa0af40))

## Who wrote what

A significant portion of this project (well over the required 20% of the Node, Express, and Postgres app) was written entirely by me, including the complete UI design. 

* **UI Design & React Frontend:** I designed the entire application from scratch using Figma before writing any code. The component structure and atomic design implementation were my own work based on those designs. ([04cd415](https://github.com/ciellamher/revive-pilates-studio/commit/04cd415))
* **Admin Drag-and-Drop Schedule:** The complex logic for the Google Calendar-style drag and drop schedule in the admin dashboard was implemented manually by me to ensure the studio had the exact tools we discussed. ([3341683](https://github.com/ciellamher/revive-pilates-studio/commit/3341683))
* **Private Sessions and Admin Control:** I wrote the domain logic that allows classes to be bookable as private by default, and handling the logic where admins can untick them or manage private/duo/trio session types. ([855eeb9](https://github.com/ciellamher/revive-pilates-studio/commit/855eeb9))
