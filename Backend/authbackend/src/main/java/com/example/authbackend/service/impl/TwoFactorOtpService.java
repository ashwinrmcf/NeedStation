package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.security.OtpEncryptionUtil;
import com.example.authbackend.security.RateLimiter;
import com.example.authbackend.service.impl.SmsService;
import com.example.authbackend.service.interfac.ITwoFactorOtpService;
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
public class TwoFactorOtpService implements ITwoFactorOtpService {

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
     * Generate an OTP for a phone number
     * @param request The OTP generation request
     * @return Response with OTP generation result
     */
    @Override
    public Response generateOtp(TwoFactorOtpRequestDto request) {
        Response response = new Response();
        try {
            if (request == null || request.getPhoneNumber() == null) {
                response.setStatusCode(400);
                response.setMessage("Phone number is required");
                return response;
            }
            
            String phoneNumber = request.getPhoneNumber();
            
            // Check rate limiting
            if (rateLimiter.isPhoneLimited(phoneNumber)) {
                TwoFactorOtpResponseDto otpDto = new TwoFactorOtpResponseDto();
                otpDto.setPhoneNumber(phoneNumber);
                otpDto.setRateLimited(true);
                
                response.setTwoFactorOtpResponseDto(otpDto);
                response.setStatusCode(429);
                response.setMessage("Rate limit exceeded for phone number");
                return response;
            }
            
            // Generate 6-digit OTP
            String otp = generateOtpCode();
            
            // Store encrypted OTP
            String encryptedKey = encryptionUtil.encrypt(phoneNumber);
            String encryptedOtp = encryptionUtil.encrypt(otp);
            
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES);
            otpCache.put(encryptedKey, encryptedOtp);
            expiryCache.put(encryptedKey, expiryTime);
            
            // Send OTP via SMS
            SmsRequestDto smsRequest = new SmsRequestDto();
            smsRequest.setPhoneNumber(phoneNumber);
            smsRequest.setOtp(otp);
            
            Response smsResponse = smsService.sendOtpSms(smsRequest);
            
            TwoFactorOtpResponseDto otpDto = new TwoFactorOtpResponseDto();
            otpDto.setPhoneNumber(phoneNumber);
            otpDto.setExpiryTime(expiryTime);
            otpDto.setEncryptedKey(encryptedKey);
            
            if (smsResponse.getStatusCode() == 200) {
                otpDto.setOtpGenerated(true);
                
                response.setTwoFactorOtpResponseDto(otpDto);
                response.setStatusCode(200);
                response.setMessage("OTP sent successfully");
            } else {
                // Clean up if SMS failed
                otpCache.remove(encryptedKey);
                expiryCache.remove(encryptedKey);
                
                otpDto.setOtpGenerated(false);
                
                response.setTwoFactorOtpResponseDto(otpDto);
                response.setStatusCode(500);
                response.setMessage("Failed to send OTP: " + smsResponse.getMessage());
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error generating OTP: " + e.getMessage());
        }
        return response;
    }
    
    /**
     * Verify OTP provided by user
     * @param request The OTP verification request
     * @return Response with verification result
     */
    @Override
    public Response verifyOtp(TwoFactorOtpRequestDto request) {
        Response response = new Response();
        try {
            if (request == null || request.getPhoneNumber() == null || request.getOtp() == null) {
                response.setStatusCode(400);
                response.setMessage("Phone number and OTP are required");
                return response;
            }
            
            String phoneNumber = request.getPhoneNumber();
            String userProvidedOtp = request.getOtp().trim();
            
            if (userProvidedOtp.isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("OTP cannot be empty");
                return response;
            }
            
            String encryptedKey = encryptionUtil.encrypt(phoneNumber);
            
            // Check if we have OTP data
            String encryptedStoredOtp = otpCache.get(encryptedKey);
            LocalDateTime expiryTime = expiryCache.get(encryptedKey);
            
            TwoFactorOtpResponseDto otpDto = new TwoFactorOtpResponseDto();
            otpDto.setPhoneNumber(phoneNumber);
            otpDto.setEncryptedKey(encryptedKey);
            
            if (encryptedStoredOtp == null || expiryTime == null) {
                otpDto.setOtpVerified(false);
                
                response.setTwoFactorOtpResponseDto(otpDto);
                response.setStatusCode(404);
                response.setMessage("No OTP found for this phone number");
                return response;
            }
            
            // Check if OTP has expired
            if (LocalDateTime.now().isAfter(expiryTime)) {
                cleanupOtpData(encryptedKey);
                otpDto.setOtpVerified(false);
                
                response.setTwoFactorOtpResponseDto(otpDto);
                response.setStatusCode(410);
                response.setMessage("OTP has expired");
                return response;
            }
            
            // Check failed attempts
            int attempts = failedAttempts.getOrDefault(phoneNumber, 0);
            int remainingAttempts = MAX_FAILED_ATTEMPTS - attempts;
            otpDto.setRemainingAttempts(remainingAttempts);
            
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                cleanupOtpData(encryptedKey);
                otpDto.setOtpVerified(false);
                
                response.setTwoFactorOtpResponseDto(otpDto);
                response.setStatusCode(429);
                response.setMessage("Maximum failed attempts exceeded");
                return response;
            }
            
            // Decrypt and verify OTP
            String storedOtp = encryptionUtil.decrypt(encryptedStoredOtp);
            boolean isValid = userProvidedOtp.equals(storedOtp);
            
            if (isValid) {
                cleanupOtpData(encryptedKey);
                failedAttempts.remove(phoneNumber);
                
                otpDto.setOtpVerified(true);
                otpDto.setRemainingAttempts(MAX_FAILED_ATTEMPTS);
                
                response.setTwoFactorOtpResponseDto(otpDto);
                response.setStatusCode(200);
                response.setMessage("OTP verification successful");
            } else {
                failedAttempts.put(phoneNumber, attempts + 1);
                remainingAttempts = MAX_FAILED_ATTEMPTS - (attempts + 1);
                
                // Clean up after max attempts
                if (attempts + 1 >= MAX_FAILED_ATTEMPTS) {
                    cleanupOtpData(encryptedKey);
                    remainingAttempts = 0;
                }
                
                otpDto.setOtpVerified(false);
                otpDto.setRemainingAttempts(remainingAttempts);
                
                response.setTwoFactorOtpResponseDto(otpDto);
                response.setStatusCode(400);
                response.setMessage("Invalid OTP. " + remainingAttempts + " attempts remaining");
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error verifying OTP: " + e.getMessage());
        }
        return response;
    }
    
    private String generateOtpCode() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }
    
    private void cleanupOtpData(String encryptedKey) {
        otpCache.remove(encryptedKey);
        expiryCache.remove(encryptedKey);
    }
}
