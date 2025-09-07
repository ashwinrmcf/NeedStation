package com.example.authbackend.controller;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IFreeOtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/free-otp")
@CrossOrigin(origins = "*")
public class FreeOtpController {

    @Autowired
    private IFreeOtpService iFreeOtpService;

    /**
     * Get available phone numbers for a specific country
     * @param country Country code (e.g., "in" for India)
     * @return A phone number from the specified country
     */
    @GetMapping("/phone/{country}")
    public Response getPhoneNumber(@PathVariable String country) {
        return iFreeOtpService.getPhoneNumber(country);
    }

    /**
     * Listen for OTP messages on a specific phone number
     * @param phoneNumber Phone number (without + prefix)
     * @param matcher Optional regex pattern to match in SMS
     * @param timeoutSeconds Optional timeout in seconds (default 60)
     * @return The OTP message(s) received
     */
    @GetMapping("/listen/{phoneNumber}")
    public Response listenForOtp(
            @PathVariable String phoneNumber,
            @RequestParam(required = false, defaultValue = "") String matcher,
            @RequestParam(required = false, defaultValue = "60") int timeoutSeconds) {
        return iFreeOtpService.listenForOtp(phoneNumber, matcher, timeoutSeconds);
    }

    /**
     * Test endpoint to verify free-otp-api is working
     * @return Status of the free-otp-api service
     */
    @GetMapping("/status")
    public Response checkStatus() {
        return iFreeOtpService.getPhoneNumber("in");
    }
}
