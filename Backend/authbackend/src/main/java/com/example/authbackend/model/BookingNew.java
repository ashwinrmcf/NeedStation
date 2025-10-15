package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingNew {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "booking_number", unique = true, nullable = false, length = 50)
    private String bookingNumber;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "service_id", nullable = false)
    private Long serviceId;
    
    // Denormalized fields for performance
    @Column(name = "service_name", length = 100)
    private String serviceName;
    
    @Column(name = "service_code", length = 50)
    private String serviceCode;
    
    @Column(name = "user_name", length = 200)
    private String userName;
    
    @Column(name = "user_email", length = 255)
    private String userEmail;
    
    // Contact & Location
    @Column(name = "phone", nullable = false, length = 15)
    private String phone;
    
    @Column(name = "alternate_phone", length = 15)
    private String alternatePhone;
    
    @Column(name = "full_address", columnDefinition = "TEXT", nullable = false)
    private String fullAddress;
    
    @Column(name = "landmark", length = 255)
    private String landmark;
    
    @Column(name = "city", length = 100)
    private String city;
    
    @Column(name = "state", length = 100)
    private String state;
    
    @Column(name = "pincode", length = 10)
    private String pincode;
    
    @Column(name = "location_lat", precision = 10, scale = 8)
    private BigDecimal locationLat;
    
    @Column(name = "location_lng", precision = 11, scale = 8)
    private BigDecimal locationLng;
    
    @Column(name = "location_address", columnDefinition = "TEXT")
    private String locationAddress;
    
    // Scheduling
    @Column(name = "preferred_date", nullable = false)
    private LocalDate preferredDate;
    
    @Column(name = "preferred_time")
    private LocalTime preferredTime;
    
    @Column(name = "preferred_time_slot", length = 50)
    private String preferredTimeSlot; // Morning, Afternoon, Evening
    
    @Column(name = "urgency", length = 20)
    private String urgency = "NORMAL"; // NORMAL, URGENT, EMERGENCY
    
    // Status & Tracking
    @Column(name = "status", length = 50)
    private String status = "PENDING"; // PENDING, CONFIRMED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
    
    @Column(name = "assigned_worker_id")
    private Long assignedWorkerId;
    
    @Column(name = "assigned_worker_name", length = 200)
    private String assignedWorkerName;
    
    // Pricing
    @Column(name = "base_amount", precision = 10, scale = 2)
    private BigDecimal baseAmount;
    
    @Column(name = "additional_charges", precision = 10, scale = 2)
    private BigDecimal additionalCharges = BigDecimal.ZERO;
    
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;
    
    // Payment
    @Column(name = "payment_status", length = 50)
    private String paymentStatus = "PENDING"; // PENDING, PAID, REFUNDED
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    // Denormalized summary fields
    @Column(name = "subservices_summary", columnDefinition = "TEXT")
    private String subservicesSummary; // JSON array
    
    @Column(name = "subservices_count")
    private Integer subservicesCount = 0;
    
    @Column(name = "formality_summary", columnDefinition = "TEXT")
    private String formalitySummary; // JSON object
    
    // Notes & Feedback
    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;
    
    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;
    
    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;
    
    @Column(name = "customer_rating")
    private Integer customerRating; // 1-5 stars
    
    @Column(name = "customer_feedback", columnDefinition = "TEXT")
    private String customerFeedback;
    
    // Audit fields
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "cancelled_by")
    private Long cancelledBy;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    // Relationships
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookingSubService> bookingSubServices;
    
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookingFormalityData> bookingFormalityData;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
