
# 🏥 MediCore — Hospital Management System

![Status](https://img.shields.io/badge/Status-Prototype-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Focus](https://img.shields.io/badge/Focus-Backend_Logic-blue?style=flat-square)

> **MediCore** is a backend-heavy system designed to manage hospital operations with strict data integrity, preventing resource scheduling conflicts (double-booking) and ensuring role-based security.

---

## 📂 System Design Documentation
Detailed architectural diagrams and logic flows can be found here:

- 💡 **[Project Scope & Idea](./idea.md)** – Overview of features and scoring criteria.
- 🏗️ **[Class Diagram](./classDiagram.md)** – OOP structure and Design Patterns (Factory, Repository).
- 🔄 **[Sequence Diagram](./sequenceDiagram.md)** – Logic flow for complex appointment booking (Concurrency Control).
- 👤 **[Use Case Diagram](./useCaseDiagram.md)** – Actors (Admin, Doctor, Patient) and interactions.
- 🗄️ **[Database Schema](./ErDiagram.md)** – Normalized PostgreSQL Entity-Relationship diagram.

---

## 🚀 Key Features

* **Atomic Scheduling:** Uses database locks to prevent two patients from booking the same slot simultaneously.
* **RBAC Architecture:** Middleware-level isolation for Admin, Doctor, and Patient routes.
* **Audit Logging:** Tracks critical changes to medical records for liability and security.
* **Doctor Availability:** Real-time toggling of "Online/Offline" status.

---

## 🛠️ Tech Stack

| Component | Technology | Why? |
| :--- | :--- | :--- |
| **Backend** | Node.js + Express | Non-blocking I/O for high concurrency. |
| **Database** | PostgreSQL | ACID transactions (Critical for healthcare data). |
| **ORM** | Prisma | Type-safe database queries. |
| **Auth** | JWT | Stateless, scalable authentication. |

---

## 🔧 Getting Started (Local Setup)

Prerequisites: Node.js (v18+), PostgreSQL.

```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/SESD-Project.git](https://github.com/YOUR_USERNAME/SESD-Project.git)

# 2. Install dependencies
cd SESD-Project
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Run the server
npm run dev

