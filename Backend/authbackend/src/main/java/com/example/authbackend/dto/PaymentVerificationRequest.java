package com.example.authbackend.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class PaymentVerificationRequest {
    private String razorpay_order_id;
    private String razorpay_payment_id;
    private String razorpay_signature;
    private Long userId;
    private List<Map<String, Object>> cartItems;
    private Integer amount;
    
    // Payment breakdown
    private Integer subtotal;
    private Integer platformFee;
    private Integer gst;
    private Integer discountAmount;
    private String promoCode;
    
    // Accepted quotations (booking IDs)
    private List<Long> acceptedQuotations;
}
