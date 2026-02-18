```markdown
# ER Diagram — MediCore

## Overview
The Entity-Relationship diagram below shows the normalized database schema. It highlights the relationships between Users, Profiles, and Clinical Data.

```mermaid
erDiagram
    USERS ||--o{ APPOINTMENTS : "has"
    DOCTOR_PROFILES ||--|| USERS : "extends"
    PATIENT_PROFILES ||--|| USERS : "extends"
    APPOINTMENTS ||--|| MEDICAL_RECORDS : "generates"

    USERS {
        int id PK
        string email
        enum role
    }

    DOCTOR_PROFILES {
        int user_id FK
        string specialization
        boolean is_available
    }

    APPOINTMENTS {
        int id PK
        int doctor_id FK
        int patient_id FK
        datetime start_time
        enum status
    }

    MEDICAL_RECORDS {
        int id PK
        int appointment_id FK
        text diagnosis
        text prescription_notes
    }