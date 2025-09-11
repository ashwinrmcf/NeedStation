package com.example.authbackend.dto;

/**
 * DTO for OTP verification requests
 */
public class OtpVerificationRequest {
    private String email;
    private String phone;
    private String otp;
    private String contactType; // "email" or "phone"
    
    public OtpVerificationRequest() {
    }
    
    public OtpVerificationRequest(String phone, String otp) {
        this.phone = phone;
        this.otp = otp;
    }
    
    public OtpVerificationRequest(String email, String phone, String otp, String contactType) {
        this.email = email;
        this.phone = phone;
        this.otp = otp;
        this.contactType = contactType;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getOtp() {
        return otp;
    }
    
    public void setOtp(String otp) {
        this.otp = otp;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getContactType() {
        return contactType;
    }
    
    public void setContactType(String contactType) {
        this.contactType = contactType;
    }
}
