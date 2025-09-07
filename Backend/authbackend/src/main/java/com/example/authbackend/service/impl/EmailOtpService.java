package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IEmailOtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class EmailOtpService implements IEmailOtpService {

    @Autowired
    private JavaMailSender mailSender;

    // Store OTPs temporarily with email as key
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, String> pendingUsers = new ConcurrentHashMap<>();
    private final Map<String, Map<String, String>> pendingUserData = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    /**
     * Generate and send OTP to email with user data
     */
    @Override
    public Response sendOtp(String email, String firstName, String lastName) {
        Response response = new Response();
        try {
            // Generate 6-digit OTP
            String otp = String.format("%06d", new Random().nextInt(999999));
            
            // Store user data temporarily
            Map<String, String> userData = new HashMap<>();
            userData.put("firstName", firstName);
            userData.put("lastName", lastName);
            userData.put("username", firstName.toLowerCase() + "." + lastName.toLowerCase());
            
            // Store OTP and user data
            otpStorage.put(email, otp);
            pendingUsers.put(email, userData.get("username"));
            pendingUserData.put(email, userData);
            
            // Schedule OTP expiry (5 minutes)
            scheduler.schedule(() -> {
                otpStorage.remove(email);
                pendingUsers.remove(email);
                pendingUserData.remove(email);
            }, 5, TimeUnit.MINUTES);
            
            // Send email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("NeedStation - Email Verification");
            message.setText("Your OTP for NeedStation registration is: " + otp + 
                          "\n\nThis OTP will expire in 5 minutes." +
                          "\n\nIf you didn't request this, please ignore this email.");
            
            mailSender.send(message);
            
            EmailOtpResponseDto otpResponseDto = new EmailOtpResponseDto(email, true);
            otpResponseDto.setFirstName(firstName);
            otpResponseDto.setLastName(lastName);
            otpResponseDto.setUsername(userData.get("username"));
            
            response.setStatusCode(200);
            response.setMessage("OTP sent successfully to " + email);
            response.setEmailOtpResponseDto(otpResponseDto);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to send OTP: " + e.getMessage());
        }
        return response;
    }

    /**
     * Verify OTP for email
     */
    @Override
    public Response verifyOtp(String email, String otp) {
        Response response = new Response();
        try {
            String storedOtp = otpStorage.get(email);
            if (storedOtp != null && storedOtp.equals(otp)) {
                EmailOtpResponseDto otpResponseDto = new EmailOtpResponseDto(email, false);
                otpResponseDto.setOtpVerified(true);
                
                // Get user data if available
                Map<String, String> userData = pendingUserData.get(email);
                if (userData != null) {
                    otpResponseDto.setFirstName(userData.get("firstName"));
                    otpResponseDto.setLastName(userData.get("lastName"));
                    otpResponseDto.setUsername(userData.get("username"));
                    otpResponseDto.setUserData(userData);
                }
                
                response.setStatusCode(200);
                response.setMessage("OTP verified successfully");
                response.setEmailOtpResponseDto(otpResponseDto);
            } else {
                response.setStatusCode(400);
                response.setMessage("Invalid or expired OTP");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("OTP verification failed: " + e.getMessage());
        }
        return response;
    }

    /**
     * Get pending username for email
     */
    public String getPendingUsername(String email) {
        return pendingUsers.get(email);
    }

    /**
     * Get pending user data
     */
    @Override
    public Response getPendingUserData(String email) {
        Response response = new Response();
        try {
            Map<String, String> userData = pendingUserData.get(email);
            if (userData != null) {
                EmailOtpResponseDto otpResponseDto = new EmailOtpResponseDto(email, false);
                otpResponseDto.setFirstName(userData.get("firstName"));
                otpResponseDto.setLastName(userData.get("lastName"));
                otpResponseDto.setUsername(userData.get("username"));
                otpResponseDto.setUserData(userData);
                
                response.setStatusCode(200);
                response.setMessage("Pending user data found");
                response.setEmailOtpResponseDto(otpResponseDto);
            } else {
                response.setStatusCode(404);
                response.setMessage("No pending user data found for email: " + email);
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to retrieve pending user data: " + e.getMessage());
        }
        return response;
    }

    /**
     * Clear OTP and pending user data after successful verification
     */
    @Override
    public Response clearOtpData(String email) {
        Response response = new Response();
        try {
            otpStorage.remove(email);
            pendingUsers.remove(email);
            pendingUserData.remove(email);
            
            response.setStatusCode(200);
            response.setMessage("OTP data cleared successfully for email: " + email);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to clear OTP data: " + e.getMessage());
        }
        return response;
    }

    /**
     * Check if email has pending OTP
     */
    @Override
    public Response hasPendingOtp(String email) {
        Response response = new Response();
        try {
            boolean hasPending = otpStorage.containsKey(email);
            EmailOtpResponseDto otpResponseDto = new EmailOtpResponseDto(email, hasPending);
            
            response.setStatusCode(200);
            response.setMessage(hasPending ? "OTP pending for email" : "No pending OTP for email");
            response.setEmailOtpResponseDto(otpResponseDto);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to check pending OTP: " + e.getMessage());
        }
        return response;
    }

    /**
     * Generate 6-digit OTP
     */
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
