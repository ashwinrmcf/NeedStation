package com.example.authbackend.controller;

import com.example.authbackend.dto.*;
import com.example.authbackend.model.Worker;
import com.example.authbackend.security.OtpEncryptionUtil;
import com.example.authbackend.security.RateLimiter;
import com.example.authbackend.service.interfac.IFreeOtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * Test controller for OTP functionality - for development use only
 */
@RestController
@RequestMapping("/api/otp-test")
@CrossOrigin(origins = "*")
public class OtpTestController {
    
    // Store the last few OTPs for testing purposes (phone number -> OTP)
    private static final Map<String, String> lastGeneratedOtps = new ConcurrentHashMap<>();
    
    // Helper method to store an OTP for debugging
    public static void storeOtpForDebug(String phone, String otp) {
        lastGeneratedOtps.put(phone, otp);
    }

    @Autowired
    private IFreeOtpService iFreeOtpService;
    
    @Autowired
    private OtpEncryptionUtil encryptionUtil;
    
    @Autowired
    private RateLimiter rateLimiter;

    /**
     * Test OTP encryption
     */
    @GetMapping("/encrypt/{otp}")
    public Response testEncryption(@PathVariable String otp) {
        Response response = new Response();
        try {
            String encrypted = encryptionUtil.encryptOtp(otp);
            String decrypted = encryptionUtil.decryptOtp(encrypted);
            
            response.setStatusCode(200);
            response.setMessage("Encryption test completed - Original: " + otp + ", Matches: " + otp.equals(decrypted));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Encryption test failed: " + e.getMessage());
        }
        return response;
    }
    
    /**
     * Test rate limiter
     */
    @GetMapping("/rate-limit-test/{ip}")
    public Response testRateLimit(@PathVariable String ip) {
        Response response = new Response();
        
        boolean limited = rateLimiter.isIpLimited(ip);
        int attempts = rateLimiter.getIpAttemptCount(ip);
        
        if (limited) {
            response.setStatusCode(429);
            response.setMessage("IP " + ip + " is rate limited. Attempts: " + attempts);
        } else {
            response.setStatusCode(200);
            response.setMessage("IP " + ip + " is not limited. Attempts: " + attempts);
        }
        return response;
    }
    
    /**
     * Reset rate limiter for testing
     */
    @PostMapping("/reset-rate-limit/{ip}")
    public Response resetRateLimit(@PathVariable String ip) {
        Response response = new Response();
        
        rateLimiter.resetIpLimit(ip);
        response.setStatusCode(200);
        response.setMessage("Rate limit reset for IP: " + ip);
        
        return response;
    }
    
    /**
     * Debug endpoint to retrieve the last generated OTP for a phone number
     * This should only be used in development environments
     */
    @GetMapping("/debug/last-otp/{phone}")
    public Response getLastOtp(@PathVariable String phone) {
        Response response = new Response();
        
        String lastOtp = lastGeneratedOtps.get(phone);
        if (lastOtp != null) {
            response.setStatusCode(200);
            response.setMessage("Last OTP for " + phone + ": " + lastOtp);
        } else {
            response.setStatusCode(404);
            response.setMessage("No OTP found for phone number: " + phone);
        }
        
        return response;
    }
    
    /**
     * Test OTP generation and verification
     */
    @GetMapping("/generate-otp")
    public Response generateTestOtp() {
        Response response = new Response();
        
        try {
            Worker worker = new Worker();
            worker.setPhone("+917890123456"); // Test phone number
            worker.setFullName("Test User");
            worker.setEmail("test@example.com");
            
            // Generate OTP
            Response otpResponse = iFreeOtpService.generateOtp(worker);
            return otpResponse;
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("OTP generation test failed: " + e.getMessage());
        }
        return response;
    }
    
    /**
     * Test OTP verification with a specific OTP
     */
    @GetMapping("/verify-otp/{otp}")
    public Response verifyTestOtp(@PathVariable String otp) {
        Response response = new Response();
        
        try {
            Worker worker = new Worker();
            worker.setPhone("+917890123456"); // Test phone number
            worker.setFullName("Test User");
            worker.setEmail("test@example.com");
            
            // Set OTP expiration time (still valid)
            LocalDateTime now = LocalDateTime.now();
            worker.setOtpCreatedAt(now.minusMinutes(5));
            worker.setOtpExpiresAt(now.plusMinutes(5));
            
            // Encrypt provided OTP for testing
            String encryptedOtp = encryptionUtil.encryptOtp(otp);
            worker.setPhoneVerificationOtp(encryptedOtp);
            
            // Verify OTP
            Response otpResponse = iFreeOtpService.verifyOtp(worker, otp);
            return otpResponse;
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("OTP verification test failed: " + e.getMessage());
        }
        return response;
    }
}
