package com.example.authbackend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TwoFactorOtpResponseDto {
    
    private String phoneNumber;
    private boolean otpGenerated;
    private boolean otpVerified;
    private LocalDateTime expiryTime;
    private int remainingAttempts;
    private boolean rateLimited;
    private String encryptedKey;
    
    // Explicit getters and setters to ensure compilation
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public boolean isOtpGenerated() {
        return otpGenerated;
    }
    
    public void setOtpGenerated(boolean otpGenerated) {
        this.otpGenerated = otpGenerated;
    }
    
    public boolean isOtpVerified() {
        return otpVerified;
    }
    
    public void setOtpVerified(boolean otpVerified) {
        this.otpVerified = otpVerified;
    }
    
    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }
    
    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }
    
    public int getRemainingAttempts() {
        return remainingAttempts;
    }
    
    public void setRemainingAttempts(int remainingAttempts) {
        this.remainingAttempts = remainingAttempts;
    }
    
    public boolean isRateLimited() {
        return rateLimited;
    }
    
    public void setRateLimited(boolean rateLimited) {
        this.rateLimited = rateLimited;
    }
    
    public String getEncryptedKey() {
        return encryptedKey;
    }
    
    public void setEncryptedKey(String encryptedKey) {
        this.encryptedKey = encryptedKey;
    }
}
