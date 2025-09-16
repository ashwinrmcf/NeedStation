package com.example.authbackend.service.interfaces;

/**
 * Interface for SMS notification services
 * Abstracts different SMS providers (Termii, Fast2SMS, 2Factor, etc.)
 */
public interface SmsNotificationService {
    
    /**
     * Send OTP SMS to the specified phone number
     * @param phoneNumber Phone number with country code
     * @param otp OTP code to send
     * @return true if SMS sent successfully
     */
    boolean sendOtpSms(String phoneNumber, String otp);
    
    /**
     * Send generic SMS message
     * @param phoneNumber Phone number with country code
     * @param message Message content
     * @return true if SMS sent successfully
     */
    default boolean sendSms(String phoneNumber, String message) {
        throw new UnsupportedOperationException("Generic SMS sending not implemented");
    }
    
    /**
     * Check if SMS service is enabled and configured
     * @return true if service is ready to send SMS
     */
    boolean isEnabled();
    
    /**
     * Get the provider name for this SMS service
     * @return Provider name (e.g., "Termii", "Fast2SMS", "2Factor")
     */
    String getProviderName();
    
    /**
     * Format phone number according to provider requirements
     * @param phoneNumber Raw phone number
     * @return Formatted phone number
     */
    default String formatPhoneNumber(String phoneNumber) {
        // Default implementation - remove spaces, dashes, parentheses
        String cleaned = phoneNumber.replaceAll("[\\s\\-()]", "");
        
        // Add +91 for Indian numbers if not present
        if (!cleaned.startsWith("+")) {
            if (cleaned.startsWith("0")) {
                cleaned = cleaned.substring(1);
            }
            if (!cleaned.startsWith("91")) {
                cleaned = "91" + cleaned;
            }
            cleaned = "+" + cleaned;
        }
        
        return cleaned;
    }
}
