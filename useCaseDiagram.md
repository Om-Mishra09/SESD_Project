# Use Case Diagram — MediCore

## Overview
This diagram outlines the primary interactions for the three main actors: **Patient**, **Doctor**, and **Admin**. It highlights the security boundaries where patients can request services, but only doctors can authorize medical records.

```mermaid
usecaseDiagram
    actor "Patient" as P
    actor "Doctor" as D
    actor "Admin" as A

    package "MediCore System" {
        usecase "Login / Authentication" as UC1
        usecase "Search Doctors" as UC2
        usecase "Book Appointment" as UC3
        usecase "View Medical History" as UC4
        usecase "Manage Availability" as UC5
        usecase "Prescribe Medication" as UC6
        usecase "Manage Users & Depts" as UC7
        usecase "Cancel Appointment" as UC8
    }

    P --> UC1
    P --> UC2
    P --> UC3
    P --> UC4
    P --> UC8

    D --> UC1
    D --> UC4
    D --> UC5
    D --> UC6

    A --> UC1
    A --> UC7
    
    UC3 ..> UC5 : <<checks>>
    UC6 ..> UC4 : <<updates>>
    ID,Use Case,Actor,Description
    
UC1,Login / Auth,All,Secure JWT-based authentication for all user roles.
UC3,Book Appointment,Patient,Request a time slot; triggers availability check.
UC5,Manage Availability,Doctor,"Toggle ""On Duty"" status to accept/reject new bookings."
UC6,Prescribe Meds,Doctor,Create a permanent medical record linked to an appointment.