package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingDTO {
    private Long userId;
    private Long serviceId;
    private ContactInfo contactInfo;
    private Scheduling scheduling;
    private List<Long> selectedSubServices;
    private Map<String, String> formalityData; // field_name -> value
    private String specialInstructions;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactInfo {
        private String phone;
        private String alternatePhone;
        private String fullAddress;
        private String landmark;
        private String city;
        private String state;
        private String pincode;
        private BigDecimal locationLat;
        private BigDecimal locationLng;
        private String locationAddress;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Scheduling {
        private LocalDate preferredDate;
        private String preferredTime; // Changed from LocalTime to String to accept "afternoon", "10:00", etc.
        private String preferredTimeSlot;
        private String urgency;
    }
}
