package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.TwoFactorOtpRequestDto;
import com.example.authbackend.dto.Response;

public interface ITwoFactorOtpService {
    
    Response generateOtp(TwoFactorOtpRequestDto request);
    Response verifyOtp(TwoFactorOtpRequestDto request);
}
