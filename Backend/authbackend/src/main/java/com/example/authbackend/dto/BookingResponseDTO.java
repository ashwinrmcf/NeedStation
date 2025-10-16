package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private Long id;
    private String bookingNumber;
    private String status;
    private String paymentStatus;
    private BigDecimal totalAmount;
    private LocalDate preferredDate;
    private String preferredTime; // Changed from LocalTime to String
    private String preferredTimeSlot;
    private String urgency;
    private LocalDateTime createdAt;
    
    // Service info
    private String serviceName;
    private String serviceCode;
    
    // User info
    private String userName;
    private String phone;
    
    // Worker info
    private String assignedWorkerName;
    
    // Subservices
    private List<String> subServices;
    private Integer subservicesCount;
    
    // Formality data
    private Map<String, String> formalityData;
    
    // Location
    private String fullAddress;
    private String city;
    
    // Feedback
    private Integer customerRating;
    private String customerFeedback;
}
