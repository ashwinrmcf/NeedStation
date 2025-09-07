package com.example.authbackend.controller;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IAuthService;
import com.example.authbackend.service.interfac.IEmailOtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class SignupController {

    @Autowired
    private IAuthService iAuthService;

    @Autowired
    private IEmailOtpService iEmailOtpService;

    /**
     * Step 1: Send OTP to email or phone
     */
    @PostMapping("/signup/step1")
    public Response signupStep1(@Valid @RequestBody SignupStep1RequestDto request) {
        return iEmailOtpService.sendOtp(request.getEmail(), request.getFirstName(), request.getLastName());
    }

    /**
     * Verify OTP for email or phone
     */
    @PostMapping("/signup/verify-otp")
    public Response verifyOtp(@Valid @RequestBody EmailOtpVerificationRequestDto request) {
        return iEmailOtpService.verifyOtp(request.getEmail(), request.getOtp());
    }

    /**
     * Step 2: Complete registration with password
     */
    @PostMapping("/signup/step2")
    public Response signupStep2(@Valid @RequestBody SignupStep2RequestDto request) {
        return iAuthService.registerUser(request);
    }

    /**
     * Resend OTP
     */
    @PostMapping("/signup/resend-otp")
    public Response resendOtp(@RequestParam String email) {
        Response userData = iEmailOtpService.getPendingUserData(email);
        if (userData.getStatusCode() == 200 && userData.getEmailOtpResponseDto() != null) {
            return iEmailOtpService.sendOtp(email, 
                userData.getEmailOtpResponseDto().getFirstName(), 
                userData.getEmailOtpResponseDto().getLastName());
        }
        return userData;
    }
}
