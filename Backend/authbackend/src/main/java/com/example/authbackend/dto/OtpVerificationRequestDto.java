package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OtpVerificationRequestDto {
    private String email;
    private String phone;
    private String otp;
    private String contactType; // "email" or "phone"
    private Long workerId;
    
    // Explicit getters and setters to ensure compilation
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
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
    
    public String getContactType() {
        return contactType;
    }
    
    public void setContactType(String contactType) {
        this.contactType = contactType;
    }
    
    public Long getWorkerId() {
        return workerId;
    }
    
    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
    }
}
