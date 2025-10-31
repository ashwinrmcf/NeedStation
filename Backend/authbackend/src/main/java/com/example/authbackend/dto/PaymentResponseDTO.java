package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    
    private Long id;
    private Long bookingId;
    private String bookingNumber;
    private Long userId;
    private String paymentNumber;
    
    // Amount Details
    private BigDecimal subtotal;
    private BigDecimal platformFee;
    private BigDecimal gstAmount;
    private BigDecimal discountAmount;
    private String promoCode;
    private BigDecimal totalAmount;
    
    // Payment Details
    private String paymentMethod;
    private String paymentGateway;
    private String paymentStatus;
    
    // Transaction Details
    private String transactionId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    
    // Timestamps
    private LocalDateTime paymentInitiatedAt;
    private LocalDateTime paymentCompletedAt;
    private LocalDateTime paymentFailedAt;
    private String failureReason;
    
    // Refund Details
    private BigDecimal refundAmount;
    private String refundStatus;
    private LocalDateTime refundCompletedAt;
    private String refundReason;
    
    // Customer Details
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    
    // Service Details (from booking)
    private String serviceName;
    private String serviceCode;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
