package com.example.authbackend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public class EmailOtpResponseDto {
    
    @NotBlank(message = "Email is required")
    private String email;
    
    private String firstName;
    private String lastName;
    private String username;
    private boolean otpSent;
    private boolean otpVerified;
    private Map<String, String> userData;
    
    // Constructors
    public EmailOtpResponseDto() {}
    
    public EmailOtpResponseDto(String email, boolean otpSent) {
        this.email = email;
        this.otpSent = otpSent;
    }
    
    // Getters and Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public boolean isOtpSent() {
        return otpSent;
    }
    
    public void setOtpSent(boolean otpSent) {
        this.otpSent = otpSent;
    }
    
    public boolean isOtpVerified() {
        return otpVerified;
    }
    
    public void setOtpVerified(boolean otpVerified) {
        this.otpVerified = otpVerified;
    }
    
    public Map<String, String> getUserData() {
        return userData;
    }
    
    public void setUserData(Map<String, String> userData) {
        this.userData = userData;
    }
}
