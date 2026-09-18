# 🎨 M6A2: Final Project Wireframes - Master Instructions & Checklist (No-Code Version)
**Grade Value:** 25 Points  
**Submission Requirement:** A direct GitHub link to your completed `project/01-wireframes.md` (which should embed images of your layouts and navigation flow map).

---

## 🎯 Core Objective
Sketch the structural blueprints of your 5 screens at both Desktop and Mobile phone layouts, establish clear responsive stacking rules, and compile a React Component Tree separating repeating UI elements into Atoms, Molecules, and Organisms.

---

## 📌 Step-by-Step Instructions

### Step A: Draw the Screen Map / User Flow
*   **Purpose:** Map out how users enter and navigate through your application to prevent broken links or navigation "dead ends."
*   **What to do:** Draw 5 boxes representing your 5 screens: Home Page, Registration Page, Scheduling Page, Checkout Page, and Client Dashboard.
*   **Connect them with arrows** indicating the user actions. For example:
    *   Home Page ➔ Click "Get Started" ➔ Registration Page
    *   Registration Page ➔ Form Submission ➔ Scheduling Page
    *   Scheduling Page ➔ Select Reformer Class ➔ Checkout Page
    *   Checkout Page ➔ Submit Receipt ➔ Client Dashboard
*   Ensure that every single page contains a navigation path back to the Home Page or Client Dashboard (typically via a shared Navigation Header) to score maximum points.

### Step B: Sketch Layouts at Two Widths (The Wireframes)
You must draw layout diagrams showing where structural boxes and text go.
*   **Low-Fidelity Rule:** Grayscale only! Do not use colors, custom branding, or styling. Use boxes, rectangles with "X" symbols for images, and horizontal lines for text blocks.
*   **Quantity:** You must draw **10 layouts in total** (your 5 screens, with each drawn at **Desktop** width and **Phone** width).
*   **Responsive Rule:** Your phone wireframes must be modeled at a narrow **375px width** with explicit instructions showing how multi-column desktop grids stack into a clean vertical row so that there is **absolutely no horizontal scrolling on phone screens**.

| Screen Name | Desktop Layout Structure | Mobile Phone Layout (375px width) | Stacking & Reflow Rule (No-Code Explanation) |
| :--- | :--- | :--- | :--- |
| **Home Page** | 3-column branch details, horizontal navigation bar, wide hero grid. | Single column, links collapse into a vertical hamburger menu. | Navigation bar collapses. Column grids stack vertically. |
| **Registration Page** | Multi-step onboarding card with a wide horizontal stepper layout. | Card spans full width, stepper turns into a simple horizontal progress bar. | Form card fits full bleed, maximizing text input areas. |
| **Scheduling Page** | Double-column split screen: Branch filters on the left, 30-day class schedule cards on the right. | Filters stack above the classes in a single vertical list. | Left sidebar collapses into a top sticky filter dropdown. Classes stack sequentially. |
| **Checkout Page** | Left column: Order summary list. Right column: GCash QR code & receipt file upload. | Single column: Order summary sits directly above GCash panel. | Side-by-side containers stack vertically into a single column. |
| **Client Dashboard** | Left-hand sidebar navigation list; right-hand active panel showing Schedule, Billing, or Settings. | Bottom tab navigation bar; active panel spans full phone screen width. | Sidebar navigation turns into an accessible horizontal scroll bar. Inner content takes up full width. |

### Step C: Compile the React Component Tree
Review your sketched frames and categorize your repeating UI blocks into Atomic levels. This maps out your future component folder structure using natural terms instead of file endings:

*   **Atoms (Smallest raw elements):** 
    *   Action Button Component
    *   Text Input Field Component
    *   Select Dropdown Component
    *   Studio Logo Component
    *   Status Badge Component
    *   Progress Step Circle Component
    *   Image Placeholder Box Component
*   **Molecules (Combined groups of atoms):** 
    *   Form Field Wrapper (combines Label, Input Field, and Error message)
    *   Navigation Links Bar (groups navigation menu items)
    *   Progress Step Header (groups Step Circles with horizontal connection lines)
    *   Schedule Item Card (combines time, class style, remaining slots count, and booking button)
    *   Summary Row Line (displays key-value pairs for checkout subtotals)
    *   Dashboard Tab Button (combines icon and label representing a sidebar category)
*   **Organisms (Complete self-contained zones):** 
    *   Global Navigation Header (wraps Logo and Navigation Links)
    *   Global Navigation Footer (wraps copyright and quick links)
    *   Calendar Filter Container (houses Branch and Class Type dropdown selectors)
    *   Schedule Date Ribbon (scrollable date selection ribbon for mobile users)
    *   Weekly Schedule Grid (renders and coordinates lists of Schedule Item Cards)
    *   Onboarding Step Wizard (coordinates multi-step form fields for registration)
    *   Checkout Form Container (wraps order summary, QR instructions, and upload areas)
    *   Dashboard Sidebar (holds vertical categories list)
    *   Booking Transaction History List (maps past and upcoming bookings)
*   **Pages & Layouts (Entire routes):** 
    *   Home Page Layout
    *   Registration Page Layout
    *   Scheduling Page Layout
    *   Checkout Page Layout
    *   Client Dashboard Page Layout

#### ⚠️ Two Sanity Rules for Component Design:
1.  **Write Once, Map Often:** If an element repeats (like class cards), design it once as a component and let the code engine dynamically render lists of data through it.
2.  **Imports Flow Downwards:** An Atom should never import a Molecule or an Organism. Keep your small components completely independent!

---

## 🚨 M6A2 Submission Checklist (Verify Before Pushing)

- [ ] **Path Verification:** The planning file is named exactly `project/01-wireframes.md` inside your repository.
- [ ] **Image Linking:** All 10 sketches (5 screens × 2 widths) and your Screen Map are saved inside your repository (e.g., in a `project/images/` folder) and linked cleanly using markdown image syntax.
- [ ] **No styling/colors:** The sketches are strictly gray, black, and white—relying solely on boxes, outlines, and text placeholders.
- [ ] **Zero Mobile Side-Scroll:** Every mobile drawing is designed to fit cleanly inside a vertical **375px container** with no elements overflowing.
- [ ] **Atomic Categorization:** Your component inventory is divided into Atoms, Molecules, and Organisms.
- [ ] **Labels on Every Sketch:** Every element box has a clear written label (e.g., *"GCash Receipt Dropzone"* or *\"Class Time Label\"*) so another developer or code-generator can easily read and construct it.

---

## 📊 M6A2 Wireframes Grading Rubric (25 Points)

*   **Screen Map / Flow (7 pts):**
    *   *Excellent (6-7 pts):* Every route is mapped; clear navigation entry point; zero navigation dead ends.
    *   *Satisfactory (4-5 pts):* Flow diagram is present, but has minor navigational gaps or missing routes.
    *   *Needs Work (0-3 pts):* No map provided, or has broken, confusing navigation flows.
*   **Box Sketches (2 Widths) (7 pts):**
    *   *Excellent (6-7 pts):* Each screen is sketched at both phone and desktop widths, with explicit stacking/reflow instructions marked.
    *   *Satisfactory (4-5 pts):* Screens are sketched at only one width (usually just desktop).
    *   *Needs Work (0-3 pts):* Sketches are thin, messy, uninformative, or missing.
*   **Component Breakdown (8 pts):**
    *   *Excellent (7-8 pts):* Component boxes are sorted into a logical, hierarchical tree (Atoms/Molecules/Organisms) with repeating elements named once.
    *   *Satisfactory (5-6 pts):* Some components are named, but the component tree structure is partial or incomplete.
    *   *Needs Work (0-4 pts):* UI layouts are not broken down into reusable components.
*   **Labeling & Legibility (3 pts):**
    *   *Excellent (3 pts):* Every single block is clearly labeled so another developer can easily build the interface.
    *   *Satisfactory (2 pts):* Mostly labeled, with minor text ambiguities.
    *   *Needs Work (0-1 pts):* Unlabeled, messy, or highly difficult to read.
