# 📝 M6A1: Final Project Proposal - Master Instructions & Checklist (No-Code Version)
**Grade Value:** 25 Points  
**Submission Requirement:** A direct GitHub link to your updated `project/PROPOSAL.md` file.

---

## 🎯 Core Objective
Create a highly specific, realistic, and internally consistent plan detailing your web app's purpose, target audience, technical specifications (routes and data state), content assets, and primary technical risks. 

*Remember: This is a planning document to help you organize your build. It is a plan, not an unchangeable contract—keep updating it as your application grows!*

---

## 📌 Step-by-Step Instructions

### 1. App Name
*   Provide a descriptive working title for your app (e.g., *Revive Pilates Booking*). You can always modify this title later.

### 2. What the App Is For (Purpose)
*   Define **exactly** what the app helps a user do, find, or decide. 
*   **Do not** use broad or generic categories.
    *   *❌ Bad:* "A fitness app to track workouts."
    *   *✅ Good:* "A real-time class booking platform for Revive Pilates that displays dynamic slot availability, manages automated slot tracking, and lets clients secure reformer classes by uploading payment receipts."

### 3. Who It Is For (Audience)
*   Describe a **concrete, named target group** who will use the app and outline what they are trying to achieve the moment they load the page.
    *   *❌ Bad:* "For everyone who likes fitness" or "for anyone looking to book workouts."
    *   *✅ Good:* "Regular student attendees of the Revive Pilates studio in Angeles & San Fernando branches who need transparent, real-time slot booking without manually DMing the studio, and the studio admin who must manually verify GCash receipts and update slot capacities."

### 4. Sections or Routes (3–5 Routes)
*   List every top-level screen or React Router path needed.
*   **Strict Limit:** Do not exceed 5 routes. If you have more, cut the non-essential pages.
*   Each route must serve a clear, distinct purpose. Provide a detailed markdown table:

| Route Path | Screen Name | Screen Purpose & Key Content |
| :--- | :--- | :--- |
| Slash Path | Home / Landing Page | Introduces the studio branches, displays pricing packages, and features a read-only scheduled class overview. |
| Register Path | Onboarding Wizard | A multi-step onboarding flow that registers new clients, collects their goals/injuries, and signs them up. |
| Book Path | Dynamic Class Booking | Allows logged-in students to view a rolling 30-day class schedule, filter by group vs private, and select a slot. |
| Checkout Path | Payment & Receipt Upload | The secure checkout screen displaying order summaries, GCash QR codes, and a receipt image upload form. |
| Dashboard Path | Client Portal | A unified dashboard for students to manage profile settings, view active schedules, track booked courses, and monitor packages. |

### 5. State & Data: What the App Holds
Define the main React states or database objects your components will manage. Note that state must live in the lowest parent component that requires it and be passed down as props. Describe all fields in plain English, avoiding array syntax or variable notations:

| Data Object | Data Description & Fields (Plain English) | Owner Component | State Trigger Events (When does it change?) |
| :--- | :--- | :--- | :--- |
| User Profile | Includes a unique identifier, email address, role (such as student or administrator), onboarded physical goals, and injury history details. | Root App Component (Global Context) | Changes when a user logs in, completes registration, or logs out of the session. |
| Scheduled Classes | A list of classes containing a unique class identifier, instructor name, branch location, style style, class type (such as group or private), date and time of class, maximum capacity limit, and active booking count. | Schedule Viewer / Root App Component | Changes when a class is added or cancelled by an admin, or when a student's booking is confirmed. |
| Booking Requests | A list of transactions showing a booking identifier, student user identifier, scheduled class identifier, receipt image storage link, and transaction status (such as pending, confirmed, or cancelled). | Client Portal / Checkout Component | Changes when a student completes checkout and uploads a payment receipt, or when an administrator updates the booking status. |

### 6. What Each Screen Contains (Key Screen Specification)
Select your application's most critical screen and break down its core UI structural blocks:
*   **Most Critical Screen:** Checkout Page (Payment Confirmation)
    *   **Block 1 (Header):** Top navigation menu showing logo, quick links, and active user profile card.
    *   **Block 2 (Order Summary Panel):** Displays active class selection details (date, time, reformer machine spot number, instructor, and subtotal).
    *   **Block 3 (Payment Instructions Panel):** Contains BPI Bank details and a scannable GCash QR Code image.
    *   **Block 4 (Receipt Form Block):** Includes text input for GCash Reference Number, drag-and-drop file upload area for receipt image, and a confirm booking action button.

### 7. Content You Need to Gather
*   Make an exhaustive inventory of the real-world text and media assets you need before you start coding:
    *   Actual weekly schedule times, instructor names, and class style titles for Revive Pilates.
    *   High-contrast studio logo asset and branch location images.
    *   Realistic payment receipts (mock GCash / Bank Transfer images) for seeding your local storage/database.

### 8. One Honest Risk
*   Identify the single technical element or layout challenge you are least sure how to build.
*   *Example:* "I am least sure how to build a state preservation system that safely buffers selected booking slots between the schedule page and checkout page so a user does not lose their reformer reservation if they hit refresh, and how to structure file uploads for payment receipts cleanly between the React UI and backend database."

---

## 🚨 M6A1 Submission Checklist (Verify Before Pushing)

- [ ] **Path Verification:** The file is saved precisely as `project/PROPOSAL.md` inside your repository. (Capitalization matters!).
- [ ] **Direct GitHub Link:** You are submitting the URL directly to this specific `.md` file on Canvas, NOT the repository homepage.
    *   *Correct format:* `https://github.com/HAU-6APSI/student-6APSI-2209-ciellamher/blob/main/project/PROPOSAL.md`
- [ ] **Clean Sentences:** All descriptions under sections 1-3 are written in clear, full, and professional sentences.
- [ ] **Route Boundaries:** Your application has between 3 and 5 routes total (exactly 5 is the maximum limit).
- [ ] **State Structure:** Your state and data management table lists the rough shape of each data object, names a specific React component owner, and explains the trigger event.
- [ ] **True Technical Risk:** You have named a genuine technical worry (e.g., state persistence, image uploading, dynamic calculations) instead of leaving it blank or listing something generic like "CSS styling".

---

## 📊 M6A1 Proposal Grading Rubric (25 Points)

*   **Purpose & Audience (8 pts):** 
    *   *Excellent (7-8 pts):* Highly specific purpose sentence; named, concrete target group.
    *   *Satisfactory (5-6 pts):* Real but overly broad purpose or audience.
    *   *Needs Work (0-4 pts):* Vague ("an app about exercise") or written "for everyone."
*   **Sections or Routes (7 pts):**
    *   *Excellent (6-7 pts):* 3 to 5 routes listed, each with a clear, distinct reason to exist.
    *   *Satisfactory (4-5 pts):* Routes are listed, but some overlap or feel like layout padding.
    *   *Needs Work (0-3 pts):* Missing entirely or lists an unmanageable wall of screens.
*   **State & Content Plan (7 pts):**
    *   *Excellent (6-7 pts):* Explicitly names data shapes, React component state owners, and real-world assets to collect.
    *   *Satisfactory (4-5 pts):* Partial plan; some state/content elements are missing detail.
    *   *Needs Work (0-3 pts):* No React state, database schemas, or asset planning listed.
*   **One Risk (3 pts):**
    *   *Excellent (3 pts):* A genuine, specific technical challenge or architectural uncertainty is named clearly.
    *   *Satisfactory (2 pts):* Suggests a loose, vague project risk ("running out of time").
    *   *Needs Work (0-1 pts):* Left blank, or lists no technical risk.
