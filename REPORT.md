# Weekly Increment Report

Copy this into your project repository as `REPORT.md` (and keep it in your
workspace `project/`). Fill it in each week and submit the link. Keep it honest
and specific: this is graded on what it shows about your week of work.

## Week of: September 20, 2026 (Week 1)

## What changed this week

- Finalized the core project concept and received official approval from the professor.
- Completed the low-fidelity wireframes to map out user flows and established the foundational design system.
- Initialized the final project repository (`revive-pilates-studio`) and migrated frontend draft work.
- Designed and built the complete frontend structure using React, Vite, and Tailwind CSS.
- Implemented key pages including: Home, Pilates classes, Pricing, Booking, Checkout, Login, Register, Client Dashboard, and Admin Dashboard.
- Created a robust component architecture using atomic design principles (atoms, molecules, organisms).
- Integrated studio assets, photos, and styling to create a responsive and polished UI.

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

- Implemented backend server with Node.js and Express.
- Developed mock REST API endpoints for `users`, `classes`, and `bookings` to support frontend integration.
- Implemented a Magic Link authentication flow using JWT and Nodemailer (Ethereal email).
- Updated frontend pages (Dashboard, AdminDashboard, Booking, Login, Register) and components to integrate with the backend API.
- Added a `Verify` page to handle the magic link token verification.
- Configured GitHub Pages deployment settings (Vite base path and React Router basename) and successfully deployed the frontend.
- Handled security requirements and updated project configuration (e.g., renaming the database from haunted to pilates).
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
