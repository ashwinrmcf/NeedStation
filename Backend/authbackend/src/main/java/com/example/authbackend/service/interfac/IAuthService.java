package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.*;

public interface IAuthService {
    
    Response registerUser(SignupStep2RequestDto signupRequest);
    Response loginUser(LoginRequestDto loginRequest);
    Response verifyOtp(OtpVerificationRequestDto otpRequest);
    Response verifyEmailOtp(EmailOtpVerificationRequestDto emailOtpRequest);
    Response getUserById(Long userId);
    Response getAllUsers();
    Response deleteUser(Long userId);
}
