
# 🏥 MediCore — Hospital Management System

![Status](https://img.shields.io/badge/Status-Prototype-orange?style=flat-square)
![Type](https://img.shields.io/badge/Type-Backend%20System-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📖 Overview
**MediCore** is a robust backend system designed to streamline hospital operations. It solves the critical challenge of **resource contention** (double-booking doctors) and enforces strict **medical data privacy** through Role-Based Access Control (RBAC).

> *"Bridging the gap between patient care and administrative efficiency through secure, atomic transactions."*

---

## ⚡ Core Features

| Feature | Type | Description |
| :--- | :--- | :--- |
| **Smart Scheduling** | `Algorithm` | Prevents double-booking using **database locking** and conflict detection. |
| **RBAC Security** | `Security` | Middleware that isolates Patient, Doctor, and Admin data access. |
| **Medical History** | `Storage` | Immutable logs for diagnosis and prescriptions. |
| **Doctor Status** | `Real-time` | Dynamic "Online/Offline" toggles for queue management. |

---

## 🛠️ Technology Stack

| Layer | Tech | Justification |
| :--- | :--- | :--- |
| **Runtime** | **Node.js** | Non-blocking I/O for handling concurrent booking requests. |
| **Framework** | **Express.js** | Modular routing for clean API architecture. |
| **Database** | **PostgreSQL** | ACID compliance is critical for medical records. |
| **Auth** | **JWT** | Stateless authentication for scalable security. |

---

## 🏗️ Architecture Design
The project follows the **Controller-Service-Repository** pattern to ensure Separation of Concerns.

```bash
src
├── 📂 controllers   # Handles incoming HTTP requests
├── 📂 services      # Contains business logic & validations
├── 📂 repositories  # Direct database interactions
├── 📂 models        # Database schema definitions
└── 📂 utils         # Helper functions (Error handling, Logger)



