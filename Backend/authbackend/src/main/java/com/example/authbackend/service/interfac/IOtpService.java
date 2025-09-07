package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.Response;
import com.example.authbackend.model.Worker;

public interface IOtpService {
    
    Response generateOtp(Worker worker);
    Response verifyOtp(Worker worker, String otp);
}
