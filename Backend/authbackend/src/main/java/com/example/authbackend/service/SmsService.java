package com.example.authbackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Service for sending SMS messages using various providers
 * Supports multiple SMS gateways with automatic fallback
 */
@Service
public class SmsService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    // Termii SMS API - Get your API key by signing up at https://termii.com/
    @Value("${sms.termii.api-key:}")
    private String termiiApiKey;
    
    @Value("${sms.termii.sender-id:NeedStation}")
    private String termiiSenderId;
    
    // Fast2SMS API - Get your API key by signing up at https://www.fast2sms.com/
    @Value("${sms.fast2sms.api-key:}")
    private String fast2smsApiKey;
    
    // 2Factor API - Get your API key by signing up at https://2factor.in/
    @Value("${sms.2factor.api-key:}")
    private String twoFactorApiKey;
    
    @Value("${sms.enabled:false}")
    private boolean smsEnabled;
    
    @Value("${sms.default-provider:termii}")
    private String defaultProvider;
    
    @Autowired
    public SmsService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }
    
    /**
     * Send SMS with OTP to the specified phone number
     * 
     * @param phoneNumber Phone number to send SMS to (with country code)
     * @param otp OTP to send
     * @return true if the SMS was sent successfully, false otherwise
     */
    public boolean sendOtpSms(String phoneNumber, String otp) {
        if (!smsEnabled) {
            System.out.println("SMS sending is disabled. Enable it in application.properties");
            return false;
        }
        
        // Format phone number (ensure it has country code)
        String formattedPhone = formatPhoneNumber(phoneNumber);
        
        // Choose provider based on configuration
        switch (defaultProvider.toLowerCase()) {
            case "termii":
                return sendTermiiSms(formattedPhone, otp);
            case "fast2sms":
                return sendFast2SmsSms(formattedPhone, otp);
            case "2factor":
                return send2FactorSms(formattedPhone, otp);
            default:
                // Try all providers in sequence until one succeeds
                // Start with 2Factor as the preferred provider
                return send2FactorSms(formattedPhone, otp) || 
                       sendFast2SmsSms(formattedPhone, otp) || 
                       sendTermiiSms(formattedPhone, otp);
        }
    }
    
    /**
     * Format phone number to ensure it has country code
     */
    private String formatPhoneNumber(String phoneNumber) {
        // Remove any spaces, dashes, or parentheses
        String cleaned = phoneNumber.replaceAll("[\\s\\-()]", "");
        
        // If the number doesn't start with +, assume it's an Indian number and add +91
        if (!cleaned.startsWith("+")) {
            // If it starts with 0, remove the 0
            if (cleaned.startsWith("0")) {
                cleaned = cleaned.substring(1);
            }
            
            // For Indian numbers, assume +91 as default country code
            if (!cleaned.startsWith("91")) {
                cleaned = "91" + cleaned;
            }
            
            cleaned = "+" + cleaned;
        }
        
        return cleaned;
    }
    
    /**
     * Send SMS using Termii API
     * Free tier available: https://termii.com/pricing
     */
    private boolean sendTermiiSms(String phoneNumber, String otp) {
        if (termiiApiKey == null || termiiApiKey.isEmpty()) {
            System.out.println("Termii API key not configured. Skipping...");
            return false;
        }
        
        try {
            String url = "https://api.termii.com/api/sms/send";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("api_key", termiiApiKey);
            requestBody.put("to", phoneNumber.replace("+", ""));
            requestBody.put("from", termiiSenderId);
            requestBody.put("sms", "Your NeedStation verification code is: " + otp + ". Valid for 10 minutes.");
            requestBody.put("type", "plain");
            requestBody.put("channel", "generic");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("SMS sent successfully via Termii");
                return true;
            } else {
                System.out.println("Failed to send SMS via Termii: " + response.getBody());
                return false;
            }
        } catch (Exception e) {
            System.out.println("Error sending SMS via Termii: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Send SMS using Fast2SMS API (India)
     * Free tier available: https://www.fast2sms.com/
     */
    private boolean sendFast2SmsSms(String phoneNumber, String otp) {
        if (fast2smsApiKey == null || fast2smsApiKey.isEmpty()) {
            System.out.println("Fast2SMS API key not configured. Skipping...");
            return false;
        }
        
        try {
            String url = "https://www.fast2sms.com/dev/bulkV2";
            
            // Remove the + and country code for Indian numbers
            String localPhone = phoneNumber.replace("+91", "");
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", fast2smsApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("route", "otp");
            requestBody.put("variables_values", otp);
            requestBody.put("numbers", localPhone);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("SMS sent successfully via Fast2SMS");
                return true;
            } else {
                System.out.println("Failed to send SMS via Fast2SMS: " + response.getBody());
                return false;
            }
        } catch (Exception e) {
            System.out.println("Error sending SMS via Fast2SMS: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Send SMS using 2Factor API (India)
     * Free tier available: https://2factor.in/
     */
    private boolean send2FactorSms(String phoneNumber, String otp) {
        System.out.println("[DEBUG] Attempting to send SMS via 2Factor to number: " + phoneNumber);
        
        if (twoFactorApiKey == null || twoFactorApiKey.isEmpty() || twoFactorApiKey.equals("YOUR_2FACTOR_API_KEY")) {
            System.out.println("[ERROR] 2Factor API key not configured. Please update the sms.2factor.api-key in application-sms.properties");
            return false;
        }
        
        System.out.println("[DEBUG] Using 2Factor API key: " + twoFactorApiKey.substring(0, 8) + "...");
        
        try {
            // Format the phone number correctly for 2Factor
            String localPhone;
            if (phoneNumber.startsWith("+91")) {
                localPhone = phoneNumber.substring(3); // Remove the +91
                System.out.println("[DEBUG] Removed +91 prefix, phone: " + localPhone);
            } else if (phoneNumber.startsWith("91") && phoneNumber.length() > 10) {
                localPhone = phoneNumber.substring(2); // Remove the 91
                System.out.println("[DEBUG] Removed 91 prefix, phone: " + localPhone);
            } else {
                localPhone = phoneNumber; // Use as is if not in expected format
                System.out.println("[DEBUG] Using phone number as is: " + localPhone);
            }
            
            // Make sure it's just the number without any formatting
            String originalPhone = localPhone;
            localPhone = localPhone.replaceAll("[^0-9]", "");
            if (!originalPhone.equals(localPhone)) {
                System.out.println("[DEBUG] Removed non-numeric characters, phone: " + localPhone);
            }
            
            // Check the length of the phone number for India (should be 10 digits)
            if (localPhone.length() != 10) {
                System.out.println("[WARNING] Phone number length is not 10 digits: " + localPhone.length() + " digits");
            }
            
            // Modified to explicitly use the SMS API endpoint instead of the voice call API
            // Format: https://2factor.in/API/V1/{API_KEY}/SMS/{PHONE_NUMBER}/{OTP_CODE}
            String url = "https://2factor.in/API/V1/" + twoFactorApiKey + "/SMS/" + localPhone + "/" + otp;
            
            // Add template only if needed - in this case we'll avoid it to ensure SMS delivery
            // String url = "https://2factor.in/API/V1/" + twoFactorApiKey + "/SMS/" + localPhone + "/" + otp + "/NSOTPS";
            
            System.out.println("[DEBUG] 2Factor API URL: " + url);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            System.out.println("[DEBUG] Sending request to 2Factor API...");
            ResponseEntity<String> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, String.class);
            System.out.println("[DEBUG] Received response from 2Factor API");
            
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("[SUCCESS] SMS sent successfully via 2Factor!");
                System.out.println("[DEBUG] 2Factor Response: " + response.getBody());
                return true;
            } else {
                System.out.println("[ERROR] Failed to send SMS via 2Factor. Status code: " + response.getStatusCode());
                System.out.println("[ERROR] Response body: " + response.getBody());
                return false;
            }
        } catch (Exception e) {
            System.out.println("[ERROR] Exception sending SMS via 2Factor: " + e.getMessage());
            e.printStackTrace(); // More detailed error information
            return false;
        }
    }
}
