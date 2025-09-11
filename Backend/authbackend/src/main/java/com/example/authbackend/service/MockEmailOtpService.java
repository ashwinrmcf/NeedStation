package com.example.authbackend.service;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@Profile("mock-email")
public class MockEmailOtpService {

    // Store OTPs temporarily with email as key
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, String> pendingUsers = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    /**
     * Mock send OTP - prints to console instead of sending email
     */
    public boolean sendOtp(String email, String username) {
        try {
            // Generate 6-digit OTP
            String otp = generateOtp();
            
            // Store OTP and username temporarily (expires in 10 minutes)
            otpStorage.put(email, otp);
            pendingUsers.put(email, username);
            
            // Schedule OTP cleanup after 10 minutes
            scheduler.schedule(() -> {
                otpStorage.remove(email);
                pendingUsers.remove(email);
            }, 10, TimeUnit.MINUTES);

            // Mock email sending - print to console
            System.out.println("=== MOCK EMAIL SENT ===");
            System.out.println("To: " + email);
            System.out.println("Subject: NeedStation - Email Verification");
            System.out.println("Body:");
            System.out.println("Hello " + username + ",");
            System.out.println("Your verification code for NeedStation signup is: " + otp);
            System.out.println("This code will expire in 10 minutes.");
            System.out.println("========================");
            
            return true;
            
        } catch (Exception e) {
            System.err.println("Failed to generate OTP: " + e.getMessage());
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
     * Clear OTP and pending user data after successful verification
     */
    public void clearOtpData(String email) {
        otpStorage.remove(email);
        pendingUsers.remove(email);
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
