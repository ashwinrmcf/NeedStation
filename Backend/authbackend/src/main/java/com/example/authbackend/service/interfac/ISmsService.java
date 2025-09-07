package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.SmsRequestDto;
import com.example.authbackend.dto.Response;

public interface ISmsService {
    
    Response sendOtpSms(SmsRequestDto request);
    
    /**
     * Simple SMS sending method for backward compatibility
     * @param phoneNumber Phone number to send SMS to
     * @param message Message content
     * @return true if SMS was sent successfully, false otherwise
     */
    boolean sendSms(String phoneNumber, String message);
}
