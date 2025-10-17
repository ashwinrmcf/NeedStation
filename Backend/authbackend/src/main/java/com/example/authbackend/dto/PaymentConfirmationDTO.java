package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmationDTO {
    private Long bookingId;
    private String bookingNumber;
    private String paymentMethod; // RAZORPAY, PAYTM, CASH, UPI
    private String transactionId;
    private BigDecimal paidAmount;
    private String paymentStatus; // SUCCESS, FAILED, PENDING
}
