package com.example.authbackend.service;

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
public class EmailOtpService {

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
    public boolean sendOtp(String email, String firstName, String lastName) {
        try {
            // Check if mailSender is available
            if (mailSender == null) {
                System.err.println("JavaMailSender is not configured");
                return false;
            }

            // Generate 6-digit OTP
            String otp = generateOtp();
            
            // Store OTP and user data temporarily
            otpStorage.put(email, otp);
            
            // Store additional user data
            Map<String, String> userData = new HashMap<>();
            userData.put("firstName", firstName);
            userData.put("lastName", lastName);
            pendingUserData.put(email, userData);

            // Create email content
            String subject = "Your OTP for NeedStation Registration";
            String body = "Hello " + firstName + ",\n\n" +
                         "Your OTP for NeedStation registration is: " + otp + "\n\n" +
                         "This OTP will expire in 10 minutes.\n\n" +
                         "If you didn't request this, please ignore this email.\n\n" +
                         "Best regards,\nNeedStation Team";

            // Send email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("noreply@needstation.com");

            mailSender.send(message);
            
            // Schedule OTP expiration (10 minutes)
            scheduler.schedule(() -> {
                otpStorage.remove(email);
                pendingUserData.remove(email);
                System.out.println("OTP expired for email: " + email);
            }, 10, TimeUnit.MINUTES);

            System.out.println("OTP sent successfully to: " + email);
            return true;
            
        } catch (Exception e) {
            System.err.println("Failed to send OTP email to " + email + ": " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Verify OTP for email
     */
    public boolean verifyOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        return storedOtp != null && storedOtp.equals(otp);
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
    public Map<String, String> getPendingUserData(String email) {
        return pendingUserData.get(email);
    }

    /**
     * Clear OTP and pending user data after successful verification
     */
    public void clearOtpData(String email) {
        otpStorage.remove(email);
        pendingUsers.remove(email);
        pendingUserData.remove(email);
    }

    /**
     * Generate 6-digit OTP
     */
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Check if email has pending OTP
     */
    public boolean hasPendingOtp(String email) {
        return otpStorage.containsKey(email);
    }
}
