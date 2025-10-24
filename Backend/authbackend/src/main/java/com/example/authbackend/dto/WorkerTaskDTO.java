package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerTaskDTO {
    private Long id;
    private String bookingNumber;
    private String customerName;
    private String serviceName;
    private String serviceCode;
    private String description;
    private LocalDate preferredDate;
    private String preferredTime;
    private String preferredTimeSlot;
    private String status;
    private String urgency;
    private BigDecimal totalAmount;
    private String phone;
    private String alternatePhone;
    private String fullAddress;
    private String city;
    private String state;
    private String pincode;
    private String landmark;
    private String specialInstructions;
    private Integer customerRating;
    private String customerFeedback;
    private LocalDateTime scheduledAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
}
