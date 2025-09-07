package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.Response;
import com.example.authbackend.model.Worker;

public interface IFreeOtpService {
    
    Response getPhoneNumber(String country);
    Response generateOtp(Worker worker);
    Response listenForOtp(String phoneNumber, String matcher, int timeoutSeconds);
    Response verifyOtp(Worker worker, String userProvidedOtp);
}
