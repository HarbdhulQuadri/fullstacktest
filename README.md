# User Management System & Resume Generator

A production-ready full-stack application built to elegantly collect user data via a multi-step form and generate beautifully formatted resumes on the fly. 

## 🧠 Architecture & Engineering Decisions

This project was built with a strict focus on **Data Integrity, User Experience (UX), and Cloud Scalability**. 

### 1. The Backend (NestJS + PostgreSQL)
- **Modular Design:** We used **NestJS** to enforce a strict MVC architecture (Controllers, Services, Entities) preventing the anti-patterns common in standard Express applications.
- **Relational Integrity:** We used **PostgreSQL** paired with **TypeORM**. User data is strictly normalized across 4 tables (`User`, `Contact`, `Address`, `Academic`).
- **Atomic Operations:** The core architectural requirement was ensuring that all 4 entities are saved in a *single HTTP request*. We achieved this using TypeORM's `cascade: true` relations. When a user submits a form, the backend atomically saves all related rows simultaneously via SQL transactions, guaranteeing zero data loss or orphaned records.
- **OpenAPI Documentation:** A fully interactive Swagger documentation endpoint is generated automatically at `/api/docs` to allow seamless collaboration with frontend consumers.

### 2. The Frontend (React + Vite PWA)
- **Form Performance:** For the 5-step wizard, we used **React Hook Form** paired with **Zod** schema validation. React Hook Form uses uncontrolled inputs, meaning the application avoids re-rendering the entire component tree on every keystroke. Zod guarantees that invalid data (like bad phone numbers or end dates preceding start dates) is blocked before it ever hits the server.
- **State Management:** We utilized **Redux Toolkit (RTK)** to manage the Admin Dashboard state. `createAsyncThunk` elegantly handles the asynchronous API calls for fetching, updating, and deleting users.
- **Progressive Web App (PWA):** The application is configured with a Service Worker and manifest, allowing it to be installed directly to mobile home screens for a native-like experience.

### 3. Serverless-Ready Document Exporting
Generating PDFs and Word documents is incredibly CPU-intensive for Node.js servers and often requires expensive compute instances. To make this platform infinitely scalable and reduce cloud hosting overhead, we deliberately offloaded document generation to the client browser using `@react-pdf/renderer` and `docx`.

### 4. UX Fluidity & Responsive Design
- The application features global navigation toggles, creating a frictionless loop for administrators to effortlessly jump between the applicant view and the admin dashboard.
- We replaced standard text inputs with smart dropdowns (e.g., International Phone Country Codes, Degrees, Countries) to minimize user error and typing fatigue.
- The Admin Dashboard features a responsive breakpoint switch. On desktop, it renders a standard data table. On mobile, the table dynamically transforms into a touch-friendly Card Grid.

---

## 🚀 Live Demo Walkthrough

1. **Submit an Application (Public View):** 
   - Start at the root URL `/`. 
   - Fill out the 5-step wizard. 
   - Test the **Live Image Preview** on the Personal Info step (paste a valid image URL like `https://github.com/github.png`).
   - Notice the strict real-time validation (e.g., try entering an invalid email or skipping a required field).
2. **Switch to Admin View:**
   - Click the floating **"Admin Dashboard"** button in the top right corner.
3. **Manage Users (Admin Dashboard):**
   - You will see the responsive User Data Grid.
   - Click on the user you just created to reveal the **Resume Preview** panel.
4. **Test Exports:**
   - Click **Download PDF** to test the client-side `@react-pdf/renderer` engine.
   - Click **Download DOCX** to test the editable Word document generated using our custom invisible-table layout.

---

## 🔎 Codebase Map

If you are exploring the codebase, here are the key areas that demonstrate our architectural patterns:

1. **Atomic Saving & Relations** 
   - `server/src/users/entities/user.entity.ts`: See how the `@OneToOne` and `@OneToMany` relations are structured with `cascade: true`.
   - `server/src/users/users.service.ts`: See the `create` method to see how effortlessly TypeORM handles the single-payload object insertion.
2. **Form Validation & Wizard**
   - `client/src/features/users/schema.ts`: Review the strict Zod validation schemas (including regex for international phone formats and complex date logic).
   - `client/src/components/wizard/WizardForm.tsx`: Notice how `sessionStorage` is used to persist user progress across steps so data isn't lost on refresh.
3. **Redux State Management**
   - `client/src/features/users/usersSlice.ts`: Check out the `createAsyncThunk` implementations for clean asynchronous state management.
4. **Document Generation Engine**
   - `client/src/features/export/pdfRenderer.tsx`: Review the robust layout engine used to generate the PDF.
   - `client/src/features/export/docx.ts`: See how we utilized Table layouts in the `.docx` spec to perfectly replicate a 2-column web layout in Microsoft Word.
