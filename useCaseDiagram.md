# Use Case Diagram
## Overview
This diagram outlines the primary interactions for the three main actors: **Patient**, **Doctor**, and **Admin**.

```mermaid
graph LR
    %% Actors represented as Boxes
    P[Patient]
    D[Doctor]
    A[Admin]

    %% Use Cases represented as Ovals
    UC1([Login / Authentication])
    UC2([Search Doctors])
    UC3([Book Appointment])
    UC4([View Medical History])
    UC5([Manage Availability])
    UC6([Prescribe Medication])
    UC7([Manage Users & Depts])
    UC8([Cancel Appointment])

    %% Relationships
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
    
    %% Connections between use cases
    UC3 -.-> UC5
    UC6 -.-> UC4

```

## Use Case Descriptions

| ID | Use Case | Actor | Description |
| --- | --- | --- | --- |
| **UC1** | Login / Auth | All | Secure JWT-based authentication for all user roles. |
| **UC3** | Book Appointment | Patient | Request a time slot; triggers availability check. |
| **UC5** | Manage Availability | Doctor | Toggle "On Duty" status to accept/reject new bookings. |
| **UC6** | Prescribe Meds | Doctor | Create a permanent medical record linked to an appointment. |



