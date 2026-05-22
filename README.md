# Hintro Call Insights Dashboard

A high-fidelity, premium glassmorphism mock dashboard built for Hintro, matching the Figma design specifications and consuming the Hintro mock APIs.

---

## 🚀 Tech Stack

- **Core Framework**: React (Vite)
- **Styling**: Vanilla CSS (Custom properties, grid systems, glassmorphism layouts, backdrop filters, responsive styles)
- **Icons**: [Lucide React](https://github.com/lucide/lucide) (Premium outline indicators)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) (Submission celebrations)

---

## 🎨 Core Design Decisions & Conventions

1. **Vibrant Glassmorphic Styling**: Adheres to a dark-mode theme (`#07070a`) using radial indigo-violet background gradients. Cards use backdrop blurs with transparent borders (`rgba(255, 255, 255, 0.08)`) to look extremely premium.
2. **Typography**: Styled with premium Google Fonts (**Outfit** for numerical stats/headings and **Plus Jakarta Sans** for body contents).
3. **Responsive Grid**: Fluid layout support for mobile, tablet, and widescreen monitors. Includes a sliding mobile navigation menu for small viewports.
4. **Header User Toggle**: A prominent toggle widget is placed on the top-right of the header to easily swap header authentication between User `u1` (empty state mockup) and User `u2` (populated dynamic state mockup) for assessment.

---

## ✨ Features Implemented

### 1. Dashboard View
- **Metrics Computation**: Maps user call session counts, AI used totals, relative last session timings (e.g. *2 days ago*, *Yesterday*, etc.), and formats call durations into readable time layouts (e.g., *14m 22s*).
- **Call Session Table**: Grouped chronologically by date headings (e.g., *April 29th*). Shows client names, call descriptions, call length, statuses, and participant names.
- **Empty States (u1)**: Renders dedicated placeholder illustration, connect headers, and instructions for calendar integrations if the user has no call log.
- **"How it works" Guides**: Features a 3-step actionable timeline explaining document uploads, live call sessions, and post-call analytics.

### 2. Multi-step Feedback Flow
- **Sidebar Integration**: The sidebar "Feedback" button launches an interactive form popup overlay.
- **Dynamic Follow-up**:
  - Step 1: User provides a summary Title, interactive Star Rating (1 to 5 stars), and detailed Description.
  - Step 2: The dialog asks "**What did you like the most?**" for high ratings (4-5 stars) or "**What frustrated you or felt confusing?**" for lower ratings (1-3 stars) to gather specific inputs.
  - Step 3: Success checkmark screen with a burst of confetti!
- **Persistence**: Automatically stores all submitted items inside the browser's `localStorage`.

### 3. Feedback History Tab
- Retrieves local storage logs and formats them inside a table containing the summary title, rating stars, descriptions, and dynamic follow-up notes.
- Includes a dedicated empty state prompting users to give feedback if none is stored.

### 4. Robust Offline Fallbacks
- Uses a defensive architecture. If the backend mock API server goes offline, the app automatically maps native fallback mock schemas so that the interface never fails.

---

## 🛠️ Setup and Run Instructions

### Prerequisites
- Node.js (v18+)
- npm

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Start Local Server
Run the Vite development server locally:
```bash
npm run dev
```
By default, the application will run at [http://localhost:5173/](http://localhost:5173/).

### 3. Build & Production Check
Generate optimal bundle assets for production deployment:
```bash
npm run build
```
Preview the built site:
```bash
npm run preview
```
