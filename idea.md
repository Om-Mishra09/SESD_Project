# Project Idea — MediCore

## Overview
**MediCore** is a comprehensive Hospital Management System designed to streamline healthcare operations. It focuses on the complex backend logic required for scheduling, patient data security, and resource allocation. The system implements a robust **Role-Based Access Control (RBAC)** mechanism to ensure data privacy between Doctors, Patients, and Admins.

## Core Features

| Feature | Description |
| :--- | :--- |
| **Smart Scheduling** | Backend algorithm that handles doctor availability slots and prevents double-booking using database locks. |
| **RBAC Security** | Strict permission layers ensuring Patients view only their records, while Doctors view assigned patients. |
| **Medical History** | Versioned, immutable storage of patient diagnosis and prescription logs. |
| **Doctor Availability** | Dynamic status toggling (Online/Offline) for doctors to manage their queue. |

## Technology Stack
* **Backend:** Node.js, Express.js (REST API)
* **Database:** PostgreSQL (Relational Data)
* **Architecture:** Clean Architecture (Controller-Service-Repository)