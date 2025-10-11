package com.example.authbackend.model;

public enum BookingStatus {
    PENDING,           // Just created, waiting for worker assignment
    CONFIRMED,         // Worker assigned and confirmed
    IN_PROGRESS,       // Service is being provided
    COMPLETED,         // Service completed successfully
    CANCELLED,         // Booking cancelled by customer or system
    WORKER_CANCELLED,  // Cancelled by worker
    NO_WORKER_AVAILABLE, // No worker available for the service
    RESCHEDULED       // Booking rescheduled to different time
}
