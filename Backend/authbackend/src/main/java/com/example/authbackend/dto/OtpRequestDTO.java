//package com.example.authbackend.dto;
//
//import jakarta.validation.constraints.NotBlank;
//import lombok.Data;
//import lombok.NonNull;
//
//import java.util.Map;
//
//@Data
//public class OtpRequestDTO {
//    @NotBlank(message = "Phone number is required")
//    private String phoneNumber;
//    private String email;
//    private Long userId;
//    private Map<String, Object> metadata;
//
//    // Getters and setters
//    public String getPhoneNumber() {
//        return phoneNumber;
//    }
//
//    public void setPhoneNumber(String phoneNumber) {
//        this.phoneNumber = phoneNumber;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public Long getUserId() {
//        return userId;
//    }
//
//    public void setUserId(Long userId) {
//        this.userId = userId;
//    }
//
//    public Map<String, Object> getMetadata() {
//        return metadata;
//    }
//
//    public void setMetadata(Map<String, Object> metadata) {
//        this.metadata = metadata;
//    }
//}
