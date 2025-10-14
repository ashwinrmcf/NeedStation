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
}
