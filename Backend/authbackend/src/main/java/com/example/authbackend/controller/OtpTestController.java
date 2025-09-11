package com.example.authbackend.controller;

import com.example.authbackend.model.Worker;
import com.example.authbackend.security.OtpEncryptionUtil;
import com.example.authbackend.security.RateLimiter;
import com.example.authbackend.service.FreeOtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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

    private final FreeOtpService freeOtpService;
    private final OtpEncryptionUtil encryptionUtil;
    private final RateLimiter rateLimiter;

    @Autowired
    public OtpTestController(FreeOtpService freeOtpService, OtpEncryptionUtil encryptionUtil, RateLimiter rateLimiter) {
        this.freeOtpService = freeOtpService;
        this.encryptionUtil = encryptionUtil;
        this.rateLimiter = rateLimiter;
    }

    /**
     * Test OTP encryption
     */
    @GetMapping("/encrypt/{otp}")
    public ResponseEntity<Map<String, Object>> testEncryption(@PathVariable String otp) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String encrypted = encryptionUtil.encryptOtp(otp);
            String decrypted = encryptionUtil.decryptOtp(encrypted);
            
            response.put("original", otp);
            response.put("encrypted", encrypted);
            response.put("decrypted", decrypted);
            response.put("matches", otp.equals(decrypted));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Test rate limiter
     */
    @GetMapping("/rate-limit-test/{ip}")
    public ResponseEntity<Map<String, Object>> testRateLimit(@PathVariable String ip) {
        Map<String, Object> response = new HashMap<>();
        
        boolean limited = rateLimiter.isIpLimited(ip);
        int attempts = rateLimiter.getIpAttemptCount(ip);
        
        response.put("ip", ip);
        response.put("limited", limited);
        response.put("attempts", attempts);
        
        if (limited) {
            return ResponseEntity.status(429).body(response);
        } else {
            return ResponseEntity.ok(response);
        }
    }
    
    /**
     * Reset rate limiter for testing
     */
    @PostMapping("/reset-rate-limit/{ip}")
    public ResponseEntity<Map<String, Object>> resetRateLimit(@PathVariable String ip) {
        Map<String, Object> response = new HashMap<>();
        
        rateLimiter.resetIpLimit(ip);
        response.put("ip", ip);
        response.put("status", "Rate limit reset");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Debug endpoint to retrieve the last generated OTP for a phone number
     * This should only be used in development environments
     */
    @GetMapping("/debug/last-otp/{phone}")
    public ResponseEntity<Map<String, Object>> getLastOtp(@PathVariable String phone) {
        Map<String, Object> response = new HashMap<>();
        response.put("phone", phone);
        
        String lastOtp = lastGeneratedOtps.get(phone);
        if (lastOtp != null) {
            response.put("lastOtp", lastOtp);
            response.put("found", true);
        } else {
            response.put("found", false);
            response.put("message", "No OTP found for this phone number");
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Test OTP generation and verification
     */
    @GetMapping("/generate-otp")
    public ResponseEntity<Map<String, Object>> generateTestOtp() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Worker worker = new Worker();
            worker.setPhone("+917890123456"); // Test phone number
            worker.setFullName("Test User");
            worker.setEmail("test@example.com");
            
            // Generate OTP
            boolean result = freeOtpService.generateOtp(worker);
            String backupOtp = worker.getPhoneVerificationOtp();
            
            response.put("success", result);
            response.put("workerPhone", worker.getPhone());
            response.put("encryptedBackupOtp", backupOtp);
            response.put("otpCreatedAt", worker.getOtpCreatedAt());
            response.put("otpExpiresAt", worker.getOtpExpiresAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Test OTP verification with a specific OTP
     */
    @GetMapping("/verify-otp/{otp}")
    public ResponseEntity<Map<String, Object>> verifyTestOtp(@PathVariable String otp) {
        Map<String, Object> response = new HashMap<>();
        
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
            boolean result = freeOtpService.verifyOtp(worker, otp);
            
            response.put("success", result);
            response.put("workerPhone", worker.getPhone());
            response.put("otpVerified", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
