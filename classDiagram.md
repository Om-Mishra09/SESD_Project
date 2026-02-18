
# Class Diagram — MediCore

## Overview
This diagram represents the major domain models and their relationships. The design follows **Object-Oriented Programming (OOP)** principles, utilizing Inheritance for the User model and Composition for Medical Records.
```mermaid
classDiagram
    %% Core User Class
    class User {
        +int id
        +string email
        +string passwordHash
        +login()
        +logout()
    }

    class Patient {
        +string insuranceId
        +List history
        +bookAppointment()
    }

    class Doctor {
        +string specialization
        +string licenseNumber
        +setAvailability()
    }

    class Appointment {
        +int id
        +datetime time
        +string status
        +cancel()
    }

    class MedicalRecord {
        +int id
        +string diagnosis
        +string prescription
        +save()
    }

    %% Relationships
    User <|-- Patient : Inheritance
    User <|-- Doctor : Inheritance
    
    Patient "1" --> "*" Appointment : requests
    Doctor "1" --> "*" Appointment : manages
    Appointment "1" *-- "1" MedicalRecord : contains
