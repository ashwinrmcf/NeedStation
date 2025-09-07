package com.example.authbackend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class OtpVerificationDto {
    
    @NotBlank(message = "OTP is required")
    private String otp;
    
    private LocalDateTime expiryTime;
    private String freeOtpPhone;
    private String phoneNumber;
    private boolean isExpired;
    private boolean isVerified;
    
    // Constructors
    public OtpVerificationDto() {}
    
    public OtpVerificationDto(String otp, LocalDateTime expiryTime, String freeOtpPhone) {
        this.otp = otp;
        this.expiryTime = expiryTime;
        this.freeOtpPhone = freeOtpPhone;
    }
    
    // Getters and Setters
    public String getOtp() {
        return otp;
    }
    
    public void setOtp(String otp) {
        this.otp = otp;
    }
    
    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }
    
    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }
    
    public String getFreeOtpPhone() {
        return freeOtpPhone;
    }
    
    public void setFreeOtpPhone(String freeOtpPhone) {
        this.freeOtpPhone = freeOtpPhone;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public boolean isExpired() {
        return isExpired;
    }
    
    public void setExpired(boolean expired) {
        isExpired = expired;
    }
    
    public boolean isVerified() {
        return isVerified;
    }
    
    public void setVerified(boolean verified) {
        isVerified = verified;
    }
}
