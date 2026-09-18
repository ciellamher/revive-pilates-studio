# 🎨 M6A3: Final Project Design System - Master Instructions & Checklist (No-Code Version)
**Grade Value:** 25 Points  
**Submission Requirement:** A PDF document, an image swatch file, or a beautifully formatted markdown document with visual swatches inside your `project/` folder. (Layout design is worth 4 points, so do not submit a raw, unformatted plain-text wall!).

---

## 🎯 Core Objective
Define a consistent, accessible, and systemized visual identity before starting your build. This prevents styling drift and ensures your application feels cohesive, polished, and fully accessible to all users.

---

## 📌 Step-by-Step Instructions

### Step A: Choose Your Styling Approach
Identify your styling framework and state exactly where your design tokens will be declared in natural terms:
*   **Plain CSS or CSS Modules Approach:** Declare your variables inside the global stylesheet stylesheet's root declaration block (for example, creating custom color variables such as Primary Brand Color and Page Background Color).
*   **Tailwind CSS Approach (Recommended):** Declare your custom styles inside the theme expansion block of your configuration file.

### Step B: Color Tokens & Verification (Pick 3 to 5 Colors)
Establish a restricted, deliberate color palette. Give each color a semantic role name and its exact hexadecimal code. Do not write actual CSS selectors.

*   **Primary Brand Color Token:** Used for primary buttons, active link items, and brand navigation markers.
*   **Interactive Accent Color Token:** Used sparingly for key call-to-actions, active booking highlights, or alert tags.
*   **Canvas Background Color Token:** The default page background canvas color (light or dark theme).
*   **Card Surface Color Token:** The background color for cards, form grids, panel boundaries, and modals.
*   **Default Text Color Token:** The primary color for headings, subheadings, and body paragraph copy.

⚠️ **Web Accessibility Contrast Rule:** You must verify that your text-on-background combinations pass the Web Content Accessibility Guidelines (WCAG) AAA/AA standard of at least a **4.5:1 contrast ratio**.
*   *Verification Example (Describe in prose):* "The dark grey text color paired on the pure white surface background yields a contrast ratio of nineteen to one, passing the necessary contrast checks."

### Step C: Establish a Clear Type Scale
Select exactly **three font sizes** and define their semantic uses to establish a clear visual hierarchy. Avoid declaring literal CSS font styles, keeping it as an instruction for your builder:

1.  **Heading Scale Token:** Bold font weight. Used for main screen headings, primary titles, and large section headers.
2.  **Body Scale Token:** Regular font weight. Used for default body paragraphs, form inputs, list text, and general labels.
3.  **Caption Scale Token:** Light or regular font weight. Used for image descriptions, helper text, and copyright footers.

### Step D: Systemized Spacing Rules
Pick **one base layout unit** (an 8px increment is the universal industry standard) and declare multiples of it for spacing, padding, margins, section gaps, and grids:
*   **Base Layout Unit:** Declare your universal base increment (for example, eight pixels).
*   **Tight Spacing Increment:** Multiples of the base layout unit (used for separating related input labels or header subheadings).
*   **Standard Spacing Increment:** Larger multiple of the base unit (separating list items or defining the internal padding inside card boxes).
*   **Section Spacing Increment:** Maximum spacing multiple (used to separate large visual blocks or distinct segments of a screen).
*   **Mobile Screen Edge Padding:** The responsive margin boundary that keeps content constrained away from the edge of phone screens.

### Step E: Compile a Reusable Components Registry
List every component from your wireframes that appears on **more than one screen** and define the exact properties (inputs) it accepts. Do not include React code blocks, describe the properties as logical variables:

*   **Button Component (Atom):**
    *   *Appears On:* Everywhere in the app.
    *   *Logical Inputs:* Visual variant style (such as primary, accent, or outline), display label text, active click handler, and disabled state flag.
*   **Status Badge Component (Atom):**
    *   *Appears On:* Checkout Page and Client Dashboard.
    *   *Logical Inputs:* Booking status state (such as pending, confirmed, or cancelled).
*   **Schedule Item Card Component (Molecule):**
    *   *Appears On:* Home Page and Scheduling Page.
    *   *Logical Inputs:* Instructor name, branch location, start time, remaining slot count, select action handler, and selectability flag.
*   **Global Navigation Header Component (Organism):**
    *   *Appears On:* Everywhere in the app.
    *   *Logical Inputs:* Active route path, user session context, and logout handler.

### Step F: Responsive Breakpoints Plan
Define the threshold where your layouts shift in pixels and describe the reflow in words:
*   **Mobile Phone View Breakpoint:** Under a specific width threshold. Explain in words how multi-column grid structures stack vertically, and how the navigation header links collapse into a vertical menu drawer.
*   **Desktop View Breakpoint:** Over that same width threshold. Explain in words how grid containers display side-by-side (such as the checkout order summary sitting next to the payment details container) and how the client dashboard renders a split sidebar structure.

### Step G: Web Accessibility Checklist (Verify before building)
Make sure your planning documents check off all of these accessibility requirements:
- [ ] Every text/background pairing scores at least **4.5:1** contrast.
- [ ] Uses semantic HTML layout tags (header, navigation, main content, button) instead of nested generic layout blocks with click handlers.
- [ ] Meaningful images have descriptive alt text; purely decorative elements use empty alt tags.
- [ ] Form input fields are explicitly linked to matching labels using identical target identifiers.
- [ ] All action elements (links, buttons) are reachable via keyboard tab navigation with visible outline focus.

---

## 🚨 M6A3 Submission Checklist (Verify Before Pushing)

- [ ] **Path Verification:** The design system is saved as `project/03-design-system.md` (or `.pdf` / `.png` if visual).
- [ ] **Formatted Design:** The document is highly polished and styled using Markdown tables, blockquotes, or color cards. No raw, unformatted walls of text!
- [ ] **Exact Theme Paths:** You state exactly where your tokens will be written (e.g., inside `:root` CSS or `tailwind.config.js`).
- [ ] **Contrast Verification:** Each color swatch combination is listed with its verified contrast ratio calculation from WebAIM (all must pass AA 4.5:1).
- [ ] **Component Props Mapping:** Your reusable component table lists exact React property inputs (`props`) rather than general summaries.
- [ ] **Responsive Breakpoints:** Explicitly states mobile/desktop breakpoints in pixels and defines what stacking occurs.

---

## 📊 M6A3 Design System Grading Rubric (25 Points)

*   **Styling Approach & Tokens (8 pts):**
    *   *Excellent (7-8 pts):* Styling approach is stated; color, typography, and spacing tokens are clearly named.
    *   *Satisfactory (5-6 pts):* Theme tokens are defined, but are incomplete or missing the framework choice.
    *   *Needs Work (0-4 pts):* Ad hoc styling variables, with no systemized tokens.
*   **Color & Contrast (6 pts):**
    *   *Excellent (6 pts):* Restricted palette of 3 to 5 colors with clear roles; contrast verified to meet the 4.5:1 WCAG ratio.
    *   *Satisfactory (4-5 pts):* Swatches are chosen, but contrast calculations are unverified.
    *   *Needs Work (0-3 pts):* Too many colors, or uses unreadable, low-contrast text combinations.
*   **Reusable Components (7 pts):**
    *   *Excellent (6-7 pts):* Component details are pulled directly from the wireframe, complete with Atomic levels and specific React props.
    *   *Satisfactory (4-5 pts):* Some component items are listed, but details are thin or lack props.
    *   *Needs Work (0-3 pts):* No components listed, or components are invented in the abstract without matching wireframes.
*   **Responsive & Accessibility Plan (4 pts):**
    *   *Excellent (4 pts):* Breakpoints are explicitly noted; all accessibility guidelines are verified.
    *   *Satisfactory (2-3 pts):* Plan is partially addressed; some rules are skipped.
    *   *Needs Work (0-1 pts):* Ignored or missing entirely.
