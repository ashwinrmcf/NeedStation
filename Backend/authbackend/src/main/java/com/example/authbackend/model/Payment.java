package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Foreign key reference to bookings table
    @Column(name = "booking_id", nullable = false)
    private Long bookingId;
    
    // Optional: JPA relationship (if you want bidirectional mapping)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", insertable = false, updatable = false)
    private BookingNew booking;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "payment_number", unique = true, nullable = false, length = 50)
    private String paymentNumber; // e.g., PAY-20251031-00001
    
    // Payment Amount Details
    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;
    
    @Column(name = "platform_fee", precision = 10, scale = 2)
    private BigDecimal platformFee = BigDecimal.ZERO;
    
    @Column(name = "gst_amount", precision = 10, scale = 2)
    private BigDecimal gstAmount = BigDecimal.ZERO;
    
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "promo_code", length = 50)
    private String promoCode;
    
    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;
    
    // Payment Method & Gateway Details
    @Column(name = "payment_method", length = 50, nullable = false)
    private String paymentMethod; // RAZORPAY, CARD, UPI, NETBANKING, WALLET
    
    @Column(name = "payment_gateway", length = 50)
    private String paymentGateway; // RAZORPAY, STRIPE, PAYTM
    
    @Column(name = "payment_status", length = 50, nullable = false)
    private String paymentStatus = "PENDING"; // PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED, CANCELLED
    
    // Transaction Details
    @Column(name = "transaction_id", length = 100)
    private String transactionId; // Gateway transaction ID
    
    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;
    
    @Column(name = "razorpay_payment_id", length = 100)
    private String razorpayPaymentId;
    
    @Column(name = "razorpay_signature", length = 255)
    private String razorpaySignature;
    
    // Payment Metadata
    @Column(name = "payment_initiated_at")
    private LocalDateTime paymentInitiatedAt;
    
    @Column(name = "payment_completed_at")
    private LocalDateTime paymentCompletedAt;
    
    @Column(name = "payment_failed_at")
    private LocalDateTime paymentFailedAt;
    
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;
    
    // Refund Details
    @Column(name = "refund_amount", precision = 10, scale = 2)
    private BigDecimal refundAmount;
    
    @Column(name = "refund_status", length = 50)
    private String refundStatus; // NOT_REFUNDED, PARTIAL, FULL, PROCESSING
    
    @Column(name = "refund_initiated_at")
    private LocalDateTime refundInitiatedAt;
    
    @Column(name = "refund_completed_at")
    private LocalDateTime refundCompletedAt;
    
    @Column(name = "refund_transaction_id", length = 100)
    private String refundTransactionId;
    
    @Column(name = "refund_reason", columnDefinition = "TEXT")
    private String refundReason;
    
    // Customer Details (denormalized for quick access)
    @Column(name = "customer_name", length = 200)
    private String customerName;
    
    @Column(name = "customer_email", length = 255)
    private String customerEmail;
    
    @Column(name = "customer_phone", length = 15)
    private String customerPhone;
    
    // Additional Info
    @Column(name = "payment_description", columnDefinition = "TEXT")
    private String paymentDescription;
    
    @Column(name = "ip_address", length = 50)
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    // Timestamps
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (paymentInitiatedAt == null) {
            paymentInitiatedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
