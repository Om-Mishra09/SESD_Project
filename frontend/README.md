# MediCore Hospital System - Frontend

Welcome to the React client interface for the MediCore hospital management application.

## Tech Stack
- **Framework:** React 19 / Vite
- **Styling:** Tailwind CSS v3
- **Icons:** Lucide React
- **API Client:** Axios (Automatic JWT Injection)
- **E2E Testing:** Playwright

## System Requirements
Because this frontend seamlessly coordinates authentication and database persistence out of the box, you **must ensure the Node.js Express backend is running consecutively** to avoid network errors. 

The backend runs on `http://localhost:3000` and the standard frontend Vite server operates on `http://localhost:5173`.

---

## 🚀 Getting Started

1. Open a new terminal window pointing to the project root (`SESD_Project`).
2. Make sure the backend is active (e.g. `npx nodemon src/index.js`).
3. Traverse into the frontend workspace and launch the developer service:

```bash
cd frontend
npm install
npm run dev
```

Visit the output link (usually `http://localhost:5173`) in your browser to interact with the MediCore client.

---

## 🧪 E2E Behavioral Testing
The UI guarantees transactional integrity against database locks (e.g., stopping two people from booking the same doctor chronologically). You can verify this by launching our deterministic browser tests built using Playwright.

To compile the automated UI test, run:
```bash
cd frontend
npx playwright test
```

This will spin up a headless Chrome browser, execute a full automated registration and authentication flow, book an appointment slot, and intentionally assert a duplicate booking strictly expecting your `409 Conflict` database exception error to visually manifest onto the UI safely!
