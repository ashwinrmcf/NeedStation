package com.example.authbackend.service;

import com.example.authbackend.model.Worker;
import com.example.authbackend.security.OtpEncryptionUtil;
import com.example.authbackend.security.RateLimiter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for OTP generation and verification using 2Factor API
 */
@Service
public class TwoFactorOtpService {

    private final OtpEncryptionUtil encryptionUtil;
    private final SmsService smsService;
    private final RateLimiter rateLimiter;
    
    // Lock attempt tracking
    private final Map<String, Integer> failedAttempts = new ConcurrentHashMap<>();
    private static final int MAX_FAILED_ATTEMPTS = 5;
    
    // OTP cache for storing encrypted OTPs
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> expiryCache = new ConcurrentHashMap<>();
    private static final int OTP_VALIDITY_MINUTES = 10;
    
    @Value("${otp.validation.strict:true}")
    private boolean strictValidation;

    @Autowired
    public TwoFactorOtpService(OtpEncryptionUtil encryptionUtil, SmsService smsService, RateLimiter rateLimiter) {
        this.encryptionUtil = encryptionUtil;
        this.smsService = smsService;
        this.rateLimiter = rateLimiter;
    }
    
    /**
     * Generate an OTP for a worker
     * @param worker The worker to generate OTP for
     * @return true if successful, false otherwise
     */
    public boolean generateOtp(Worker worker) {
        if (worker == null) {
            return false;
        }
        
        String phoneNumber = worker.getPhone();
        
        // Check for rate limiting
        if (rateLimiter.isPhoneLimited(phoneNumber)) {
            System.out.println("[RATE LIMIT] Too many OTP requests for " + phoneNumber);
            return false;
        }
        
        // Generate a 6-digit OTP
        String otp = generateRandomOtp(6);
        System.out.println("[DEBUG] Generated OTP for " + phoneNumber + ": " + otp);
        
        // Store encrypted OTP in cache
        String encryptedOtp = encryptionUtil.encryptOtp(otp);
        otpCache.put(phoneNumber, encryptedOtp);
        expiryCache.put(phoneNumber, LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
        
        // Send OTP via SMS
        boolean smsSent = smsService.sendOtpSms(phoneNumber, otp);
        
        if (smsSent) {
            System.out.println("[DEBUG] OTP sent successfully via 2Factor to " + phoneNumber);
            return true;
        } else {
            System.out.println("[ERROR] Failed to send OTP via 2Factor to " + phoneNumber);
            return false;
        }
    }
    
    /**
     * Verify an OTP for a worker
     * @param worker The worker
     * @param userProvidedOtp OTP provided by the user
     * @return true if verification successful, false otherwise
     */
    public boolean verifyOtp(Worker worker, String userProvidedOtp) {
        if (worker == null || userProvidedOtp == null || userProvidedOtp.trim().isEmpty()) {
            return false;
        }
        
        String phoneNumber = worker.getPhone();
        
        // Check for account lockout due to too many failed attempts
        int attempts = failedAttempts.getOrDefault(phoneNumber, 0);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            System.out.println("[SECURITY] Account temporarily locked due to too many failed attempts: " + phoneNumber);
            return false;
        }
        
        try {
            // Get encrypted OTP from cache
            String encryptedOtp = otpCache.get(phoneNumber);
            if (encryptedOtp == null) {
                System.out.println("[ERROR] No OTP found for " + phoneNumber);
                recordFailedAttempt(phoneNumber);
                return false;
            }
            
            // Check OTP expiry
            LocalDateTime expiry = expiryCache.get(phoneNumber);
            if (expiry == null || LocalDateTime.now().isAfter(expiry)) {
                System.out.println("[ERROR] OTP has expired for " + phoneNumber);
                recordFailedAttempt(phoneNumber);
                return false;
            }
            
            // Decrypt OTP and verify
            String decryptedOtp = encryptionUtil.decryptOtp(encryptedOtp);
            if (decryptedOtp == null) {
                System.out.println("[ERROR] Failed to decrypt OTP for " + phoneNumber);
                recordFailedAttempt(phoneNumber);
                return false;
            }
            
            // Compare OTPs
            if (decryptedOtp.equals(userProvidedOtp)) {
                System.out.println("[SUCCESS] OTP verified successfully for " + phoneNumber);
                resetFailedAttempts(phoneNumber);
                return true;
            } else {
                System.out.println("[ERROR] Invalid OTP provided for " + phoneNumber +
                        ". Expected: " + decryptedOtp + ", Provided: " + userProvidedOtp);
                recordFailedAttempt(phoneNumber);
                return false;
            }
        } catch (Exception e) {
            System.err.println("[ERROR] Exception during OTP verification: " + e.getMessage());
            e.printStackTrace();
            recordFailedAttempt(phoneNumber);
            return false;
        }
    }
    
    /**
     * Generate a random numeric OTP of specified length
     * @param length Length of OTP to generate
     * @return Random OTP
     */
    private String generateRandomOtp(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < length; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
    
    /**
     * Record a failed login attempt for a phone number
     * @param phoneNumber The phone number
     */
    private void recordFailedAttempt(String phoneNumber) {
        int currentAttempts = failedAttempts.getOrDefault(phoneNumber, 0);
        failedAttempts.put(phoneNumber, currentAttempts + 1);
        System.out.println("[SECURITY] Failed attempt recorded for " + phoneNumber + ". Total: " + (currentAttempts + 1));
    }
    
    /**
     * Reset failed attempts counter after successful verification
     * @param phoneNumber The phone number
     */
    private void resetFailedAttempts(String phoneNumber) {
        failedAttempts.remove(phoneNumber);
        System.out.println("[SECURITY] Failed attempts counter reset for " + phoneNumber);
    }
}
