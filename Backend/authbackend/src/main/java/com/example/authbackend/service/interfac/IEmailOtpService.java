package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.Response;

public interface IEmailOtpService {
    
    Response sendOtp(String email, String firstName, String lastName);
    
    Response verifyOtp(String email, String otp);
    
    Response getPendingUserData(String email);
    
    Response clearOtpData(String email);
    
    Response hasPendingOtp(String email);
}
