package com.example.authbackend.dto;

import lombok.Data;

@Data
public class PaymentOrderRequest {
    private Integer amount; // Amount in rupees
    private String currency;
    private String receipt;
    private Long userId;
}
