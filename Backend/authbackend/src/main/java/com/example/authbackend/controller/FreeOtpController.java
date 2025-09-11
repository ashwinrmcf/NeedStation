package com.example.authbackend.controller;

import com.example.authbackend.service.FreeOtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/free-otp")
@CrossOrigin(origins = "*")
public class FreeOtpController {

    private final FreeOtpService freeOtpService;

    @Autowired
    public FreeOtpController(FreeOtpService freeOtpService) {
        this.freeOtpService = freeOtpService;
    }

    /**
     * Get available phone numbers for a specific country
     * @param country Country code (e.g., "in" for India)
     * @return A phone number from the specified country
     */
    @GetMapping("/phone/{country}")
    public ResponseEntity<Map<String, Object>> getPhoneNumber(@PathVariable String country) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String phoneNumber = freeOtpService.getPhoneNumber(country);
            
            if (phoneNumber != null) {
                response.put("success", true);
                response.put("phoneNumber", phoneNumber);
                response.put("country", country);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "No phone number available for country: " + country);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving phone number: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Listen for OTP messages on a specific phone number
     * @param country Country code
     * @param phoneNumber Phone number (without + prefix)
     * @param matcher Optional regex pattern to match in SMS
     * @param timeoutSeconds Optional timeout in seconds (default 60)
     * @return The OTP message(s) received
     */
    @GetMapping("/listen/{country}/{phoneNumber}")
    public ResponseEntity<Map<String, Object>> listenForOtp(
            @PathVariable String country,
            @PathVariable String phoneNumber,
            @RequestParam(required = false, defaultValue = "") String matcher,
            @RequestParam(required = false, defaultValue = "60") int timeoutSeconds) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String otp = freeOtpService.listenForOtp(phoneNumber, matcher, timeoutSeconds);
            
            if (otp != null) {
                response.put("success", true);
                response.put("otp", otp);
                response.put("phoneNumber", phoneNumber);
                response.put("country", country);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "No OTP found within timeout period");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error listening for OTP: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Test endpoint to verify free-otp-api is working
     * @return Status of the free-otp-api service
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> checkStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Try to get any phone number to test the service
            String phoneNumber = freeOtpService.getPhoneNumber("in");
            
            if (phoneNumber != null) {
                response.put("status", "ok");
                response.put("message", "Free OTP API is working");
                response.put("samplePhone", phoneNumber);
            } else {
                response.put("status", "degraded");
                response.put("message", "Free OTP API responded but no phone numbers available");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Free OTP API is not working: " + e.getMessage());
            return ResponseEntity.status(503).body(response);
        }
    }
}
