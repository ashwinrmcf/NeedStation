package com.example.authbackend.service.interfaces;

import java.util.Map;

/**
 * Interface for OTP (One-Time Password) services
 * Abstracts different OTP delivery methods (Email, SMS, etc.)
 */
public interface OtpService {
    
    /**
     * Send OTP to the specified recipient
     * @param recipient Email address or phone number
     * @param firstName User's first name (optional)
     * @param lastName User's last name (optional)
     * @return true if OTP sent successfully
     */
    boolean sendOtp(String recipient, String firstName, String lastName);
    
    /**
     * Verify OTP for the recipient
     * @param recipient Email address or phone number
     * @param otp OTP code to verify
     * @return true if OTP is valid and verified
     */
    boolean verifyOtp(String recipient, String otp);
    
    /**
     * Check if recipient has pending OTP
     * @param recipient Email address or phone number
     * @return true if there's a pending OTP
     */
    boolean hasPendingOtp(String recipient);
    
    /**
     * Get pending user data associated with OTP
     * @param recipient Email address or phone number
     * @return Map containing user data or null if not found
     */
    Map<String, String> getPendingUserData(String recipient);
    
    /**
     * Clear OTP data after successful verification
     * @param recipient Email address or phone number
     */
    void clearOtpData(String recipient);
    
    /**
     * Get the delivery method for this OTP service
     * @return Delivery method (EMAIL, SMS, etc.)
     */
    default String getDeliveryMethod() {
        return "UNKNOWN";
    }
}
