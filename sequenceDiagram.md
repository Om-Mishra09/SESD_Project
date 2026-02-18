
# Sequence Diagram — MediCore

## Overview
This sequence diagram illustrates the **Appointment Booking Lifecycle**. It demonstrates the backend complexity of handling a request, verifying slot availability in the database, and handling race conditions (locking the slot) to prevent double bookings.

```mermaid
sequenceDiagram
    participant P as Patient
    participant C as AppointmentController
    participant S as ScheduleService
    participant DB as Database

    P->>C: POST /api/book (doctorId, time)
    activate C
    
    C->>S: checkAvailability(doctorId, time)
    activate S
    
    S->>DB: Query Slots (status = FREE)
    activate DB
    DB-->>S: Slot Available
    deactivate DB

    alt Slot is Open
        S->>DB: UPDATE slots SET status='LOCKED'
        activate DB
        DB-->>S: Success
        deactivate DB
        
        S-->>C: Reservation Confirmed
        C-->>P: 201 Created (Booking Details)
    else Slot Taken
        S-->>C: Conflict Error
        C-->>P: 409 Conflict (Slot Unavailable)
    end
    
    deactivate S
    deactivate C
