# User Management System & Resume Generator

A production-ready full-stack application built to elegantly collect user data via a multi-step form and generate beautifully formatted resumes.

## 🧠 Thought Process & Architecture

This project was built with a strict focus on **Data Integrity, User Experience (UX), and Scalability**. 

### 1. The Backend (NestJS + PostgreSQL)
- **Modular Design:** We used **NestJS** to enforce a strict MVC architecture (Controllers, Services, Entities) preventing the "spaghetti code" common in standard Express apps.
- **Relational Integrity:** We used **PostgreSQL** paired with **TypeORM**. User data is strictly normalized across 4 tables (`User`, `Contact`, `Address`, `Academic`).
- **Atomic Operations:** The core requirement was saving all 4 entities in a *single HTTP request*. We achieved this using TypeORM's `cascade: true` relations. If a user submits the form, the backend atomically saves all related rows simultaneously, preventing orphaned data.

### 2. The Frontend (React + Vite)
- **Form Performance:** For the 5-step wizard, we used **React Hook Form** paired with **Zod** schema validation. React Hook Form uses uncontrolled inputs, meaning the app does not waste resources re-rendering the entire component tree on every keystroke. Zod guarantees that invalid data (like bad phone numbers or end dates preceding start dates) is blocked before it ever hits the server.
- **State Management:** We used **Redux Toolkit (RTK)** to manage the Admin Dashboard state. `createAsyncThunk` elegantly handles the asynchronous API calls for fetching, updating, and deleting users.
- **Client-Side Exporting:** Generating PDFs and Word documents is incredibly CPU-intensive for Node.js servers. To make this application instantly scalable, we offloaded document generation to the client browser using `@react-pdf/renderer` and `docx`.

### 3. UX Fluidity
- We added global navigation toggles (a floating Assessor button on the public side, and a "View Public Form" button on the Admin side). This creates a frictionless loop, allowing assessors to effortlessly jump between the applicant view and the admin view.
- We replaced standard text inputs with smart dropdowns (e.g., International Phone Country Codes, Degrees, Countries) to minimize user error and typing fatigue.

---

## 🚀 How to Test the Demo

1. **Submit an Application (Public View):** 
   - Start at the root URL `/`. 
   - Fill out the 5-step wizard. 
   - Notice the **Live Image Preview** on the Personal Info step (paste a valid image URL like `https://github.com/github.png`).
   - Notice the strict real-time validation (e.g., try entering an invalid email or skipping a required field).
2. **Switch to Admin View:**
   - Click the floating **"Assessor: Admin Dashboard"** button in the top right corner.
3. **Manage Users (Admin Dashboard):**
   - You will see the responsive User Data Table (if you shrink your browser, notice how the table elegantly transforms into mobile-friendly cards).
   - Click on the user you just created to reveal the **Resume Preview** panel.
4. **Test Exports:**
   - Click **Download PDF** to see the pixel-perfect `@react-pdf/renderer` output.
   - Click **Download DOCX** to see the editable Word document generated using our custom invisible-table layout.

---

## 🔎 What to Check in the Code (For Assessors)

If you are reviewing this codebase, we highly recommend checking out these specific files to see our best practices in action:

1. **Atomic Saving & Relations** 
   - `server/src/users/entities/user.entity.ts`: See how the `@OneToOne` and `@OneToMany` relations are structured with `cascade: true`.
   - `server/src/users/users.service.ts`: See the `create` method to see how effortlessly TypeORM handles the single-payload object insertion.
2. **Form Validation & Wizard**
   - `client/src/features/users/schema.ts`: Review the strict Zod validation schemas (including regex for international phone formats and complex date logic).
   - `client/src/components/wizard/WizardForm.tsx`: Notice how `sessionStorage` is used to persist user progress across steps so data isn't lost on refresh.
3. **Redux State Management**
   - `client/src/features/users/usersSlice.ts`: Check out the `createAsyncThunk` implementations for clean asynchronous state management.
4. **Document Generation**
   - `client/src/features/export/pdfRenderer.tsx`: Review the robust layout engine used to generate the PDF.
   - `client/src/features/export/docx.ts`: See how we utilized Table layouts in the `.docx` spec to perfectly replicate a 2-column web layout in Microsoft Word.
