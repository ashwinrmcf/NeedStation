package com.example.authbackend.service;

import com.example.authbackend.config.FreeOtpConfig;
import com.example.authbackend.controller.OtpTestController;
import com.example.authbackend.dto.OtpVerificationRequest;
import com.example.authbackend.model.Worker;
import com.example.authbackend.security.OtpEncryptionUtil;
import com.example.authbackend.security.RateLimiter;
import com.example.authbackend.service.SmsService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.client.ClientHttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FreeOtpService {

    private final RateLimiter rateLimiter;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;
    private final OtpEncryptionUtil encryptionUtil;
    private final SmsService smsService;
    private final String baseUrl;
    private final FreeOtpConfig freeOtpConfig;

    // Lock attempt tracking
    private final Map<String, Integer> failedAttempts = new ConcurrentHashMap<>();
    private static final int MAX_FAILED_ATTEMPTS = 5;

    @Value("${otp.validation.strict:true}")
    private boolean strictValidation;

    // OTP cache for storing encrypted OTPs
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> expiryCache = new ConcurrentHashMap<>();
    private static final int OTP_VALIDITY_MINUTES = 5;

    @Autowired
    public FreeOtpService(FreeOtpConfig freeOtpConfig, ObjectMapper objectMapper,
                          OtpEncryptionUtil encryptionUtil, RateLimiter rateLimiter,
                          SmsService smsService) {
        this.freeOtpConfig = freeOtpConfig;
        this.baseUrl = freeOtpConfig.getBaseUrl();
        this.objectMapper = objectMapper;
        this.encryptionUtil = encryptionUtil;
        this.rateLimiter = rateLimiter;
        this.smsService = smsService;

        // Create RestTemplate with proper error handling
        this.restTemplate = new RestTemplate();
        this.restTemplate.setErrorHandler(new ResponseErrorHandler() {
            @Override
            public boolean hasError(ClientHttpResponse response) {
                return false; // Let the caller decide what is an error
            }

            @Override
            public void handleError(ClientHttpResponse response) {
                // No-op, we'll handle errors in the calling code
            }
        });
    }

    /**
     * Get a phone number from one of the supported countries
     * @param country Country code (e.g., "in" for India)
     * @return A phone number or a default one if none available
     */
    public String getPhoneNumber(String country) {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl(baseUrl + "/api/v1/phone/list")
                    .queryParam("source", "free")
                    .build()
                    .toUriString();

            // Make the API call
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode root = objectMapper.readTree(response.getBody());

                // Check which structure is returned by the API
                // Try both "numbers" and "phones" fields which are used by different versions
                JsonNode numbers = null;
                if (root.has("numbers") && root.get("numbers").isArray()) {
                    numbers = root.get("numbers");
                } else if (root.has("phones") && root.get("phones").isArray()) {
                    numbers = root.get("phones");
                } else {
                    // Neither field exists, return fallback number
                    return "+919876543210";
                }

                // Filter by country if specified
                if (country != null && !country.isEmpty()) {
                    for (JsonNode number : numbers) {
                        String countryField = "country";
                        // Some APIs use different field names
                        if (!number.has(countryField) && number.has("countryCode")) {
                            countryField = "countryCode";
                        }

                        if (country.equalsIgnoreCase(number.path(countryField).asText())) {
                            String phoneField = "number";
                            // Some APIs use different field names
                            if (!number.has(phoneField) && number.has("phoneNumber")) {
                                phoneField = "phoneNumber";
                            }
                            return number.path(phoneField).asText();
                        }
                    }
                }

                // If no specific country match or no country specified, return the first number
                if (numbers.size() > 0) {
                    JsonNode firstNumber = numbers.get(0);
                    // Check field names
                    String phoneField = "number";
                    if (!firstNumber.has(phoneField) && firstNumber.has("phoneNumber")) {
                        phoneField = "phoneNumber";
                    }
                    return firstNumber.path(phoneField).asText();
                }

                // If we get here, no phone numbers were found, use a fallback number
                return freeOtpConfig.getFallbackNumber();
            }

            // Fallback to a demo number if the API call fails
            return "+919876543210";
        } catch (Exception e) {
            System.err.println("Error getting phone number from Free OTP API: " + e.getMessage());
            // Fallback to a demo number
            return "+919876543210";
        }
    }

    /**
     * Generate an OTP for a worker
     * @param worker The worker to generate OTP for
     * @return true if successful, false otherwise
     */
    public boolean generateOtp(Worker worker) {
        String phoneNumber = worker.getPhone();

        try {
            // Format phone number if needed
            // E.164 format: +[country code][phone number without leading 0]
            if (!phoneNumber.startsWith("+")) {
                // Assuming India (+91) as default country code if not provided
                phoneNumber = "+91" + phoneNumber;
                System.out.println("Formatted phone number to: " + phoneNumber);
            }

            // Check rate limits for the phone number
            if (rateLimiter.isPhoneLimited(phoneNumber)) {
                System.out.println("Rate limit exceeded for phone: " + phoneNumber);
                return false;
            }

            // Reset failed attempts counter
            failedAttempts.remove(phoneNumber);

            // For free OTP service, we just need to set up the worker record with an OTP expiration
            // The actual OTP will be retrieved when verifying

            // Set OTP expiration time (10 minutes from now)
            LocalDateTime now = LocalDateTime.now();
            worker.setOtpCreatedAt(now);
            worker.setOtpExpiresAt(now.plusMinutes(10));

            // Reset OTP attempts
            worker.setOtpAttempts(0);

            // Generate a random backup OTP (6 digits) and encrypt it for fallback verification
            // This serves as a backup in case the free OTP API is unavailable
            String generatedOtp = String.format("%06d", new SecureRandom().nextInt(1000000));
            String encryptedOtp = encryptionUtil.encryptOtp(generatedOtp);
            if (encryptedOtp != null) {
                otpCache.put(phoneNumber, encryptedOtp);
                expiryCache.put(phoneNumber, LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
                System.out.println("Saved encrypted OTP backup for " + phoneNumber);

                // Debug: Store the generated OTP for debugging
                OtpTestController.storeOtpForDebug(phoneNumber, generatedOtp);

                // Send SMS with OTP
                boolean smsSent = smsService.sendOtpSms(phoneNumber, generatedOtp);
                if (smsSent) {
                    System.out.println("SMS sent successfully to " + phoneNumber);
                } else {
                    System.out.println("SMS sending failed, but OTP is stored for verification");
                }
            }
            System.out.println("Backup OTP generated (will be sent by alternative means if needed)");
            return true;
        } catch (Exception e) {
            System.err.println("Error generating OTP: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Listen for an OTP for the given phone number
     * This will poll the free-otp-api service for a limited time to find an OTP
     * @param phoneNumber The phone number to listen for OTP
     * @param matcher Regex pattern to match in SMS (or empty string for any)
     * @param timeoutSeconds Seconds to wait for an OTP
     * @return The OTP code or null if none found
     */
    public String listenForOtp(String phoneNumber, String matcher, int timeoutSeconds) {
        // Make phoneNumber effectively final for lambda
        final String inputPhoneNumber = phoneNumber;

        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            long startTime = System.currentTimeMillis();
            long endTime = startTime + (timeoutSeconds * 1000);

            // Remove + from phone number if present
            String formattedPhone = inputPhoneNumber;
            if (formattedPhone.startsWith("+")) {
                formattedPhone = formattedPhone.substring(1);
            }

            // Make phone number final for use in lambda
            final String finalPhoneNumber = formattedPhone;
            final String country = "in"; // Default country (India)

            while (System.currentTimeMillis() < endTime) {
                try {
                    // Sleep for a bit to avoid hammering the API
                    Thread.sleep(5000);

                    String url = UriComponentsBuilder
                            .fromHttpUrl(baseUrl + "/api/v1/phone/{country}/{phoneNumber}")
                            .queryParam("source", freeOtpConfig.getDefaultSource())
                            .queryParam("ago", "30s") // Look for messages in the last 30 seconds
                            .queryParam("match", matcher.isEmpty() ? "" : matcher)
                            .buildAndExpand(country, finalPhoneNumber)
                            .toUriString();

                    ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

                    if (response.getStatusCode() == HttpStatus.OK) {
                        JsonNode root = objectMapper.readTree(response.getBody());

                        // Check if we got a successful response with a message
                        if (root.has("success") && root.get("success").asBoolean() &&
                                root.has("messages") && root.get("messages").isArray() &&
                                root.get("messages").size() > 0) {

                            // Look through messages for an OTP
                            for (JsonNode message : root.get("messages")) {
                                if (message.has("body")) {
                                    String body = message.get("body").asText();

                                    // Try to find a 6-digit number in the message
                                    Pattern pattern = Pattern.compile("\\b\\d{6}\\b");
                                    Matcher m = pattern.matcher(body);
                                    if (m.find()) {
                                        String otpCode = m.group(0);
                                        System.out.println("Found OTP in message: " + otpCode);
                                        return otpCode;
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error while polling for OTP: " + e.getMessage());
                    // Continue polling despite errors
                }
            }

            // If we reach this point, we've timed out without finding an OTP
            return null;
        });

        try {
            // Wait for the future to complete with a timeout
            return future.get(timeoutSeconds, TimeUnit.SECONDS);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            System.err.println("Error while waiting for OTP: " + e.getMessage());
            return null;
        }
    }

    /**
     * Verify an OTP for a worker
     * For our implementation, we'll accept the user-provided OTP but also
     * check the free-otp-api service to see if we can find a matching OTP.
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
            System.out.println("Account temporarily locked due to too many failed attempts: " + phoneNumber);
            return false;
        }

        try {
            // Format phone number if needed (for API calls)
            // E.164 format: +[country code][phone number without leading 0]
            String apiPhoneNumber = phoneNumber;
            if (!apiPhoneNumber.startsWith("+")) {
                // Assuming India (+91) as default country code if not provided
                apiPhoneNumber = "+91" + apiPhoneNumber;
            } else {
                // Make sure we remove the + for some API calls
                apiPhoneNumber = apiPhoneNumber.substring(1);
            }

            String country = "in"; // Default country (India)

            // Debug: Store the requested OTP for debugging in case it was manually entered
            OtpTestController.storeOtpForDebug(phoneNumber, userProvidedOtp);

            // 1. First check if we have the encrypted backup OTP in the cache
            String encryptedOtp = otpCache.get(phoneNumber);
            if (encryptedOtp != null) {
                String decryptedOtp = encryptionUtil.decryptOtp(encryptedOtp);
                // If decryption worked, check if OTPs match
                if (decryptedOtp != null && decryptedOtp.equals(userProvidedOtp)) {
                    System.out.println("OTP verified against local encrypted backup");
                    resetFailedAttempts(phoneNumber);
                    return true;
                }
            }

            // 2. Try the direct OTP verification API
            try {
                Map<String, String> verificationRequest = new HashMap<>();
                verificationRequest.put("phone", phoneNumber);
                verificationRequest.put("otp", userProvidedOtp);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(verificationRequest, headers);

                ResponseEntity<String> verifyResponse = restTemplate.postForEntity(
                        baseUrl + "/api/v1/otp/verify", requestEntity, String.class);

                if (verifyResponse.getStatusCode().is2xxSuccessful()) {
                    JsonNode verifyRoot = objectMapper.readTree(verifyResponse.getBody());
                    if (verifyRoot.has("success") && verifyRoot.get("success").asBoolean()) {
                        System.out.println("OTP verified successfully via Free OTP API");
                        resetFailedAttempts(phoneNumber);
                        return true;
                    }
                }
            } catch (Exception e) {
                System.err.println("Error verifying OTP with direct API: " + e.getMessage());
                // Continue to other verification methods
            }

            // 3. If strict validation is enabled, also check recent messages
            if (strictValidation) {
                try {
                    // Check for any recent OTPs from the API directly
                    String url = UriComponentsBuilder
                            .fromHttpUrl(freeOtpConfig.getBaseUrl() + "/api/v1/phone/{country}/{phoneNumber}")
                            .queryParam("source", freeOtpConfig.getDefaultSource())
                            .queryParam("ago", "5m") // Look for messages in the last 5 minutes
                            .buildAndExpand(country, apiPhoneNumber)
                            .toUriString();

                    ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
                    JsonNode root = objectMapper.readTree(response.getBody());

                    // Process response to check for matching OTPs in messages
                    if (root.has("results") && root.get("results").isArray()) {
                        // Check multiple results
                        for (JsonNode result : root.get("results")) {
                            if (result.has("body")) {
                                String messageBody = result.get("body").asText();

                                // Extract OTP from message body (common format: numbers only, 6 digits)
                                Pattern pattern = Pattern.compile("\\b\\d{6}\\b");
                                Matcher matcher = pattern.matcher(messageBody);

                                while (matcher.find()) {
                                    String foundOtp = matcher.group();
                                    if (foundOtp.equals(userProvidedOtp)) {
                                        // Message contains the OTP the user provided
                                        System.out.println("OTP verified via message matching");
                                        resetFailedAttempts(phoneNumber);
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error checking for OTP matches in messages: " + e.getMessage());
                    // Continue to other options
                }
            }

            // 4. If we reach here, all verification methods have failed
            recordFailedAttempt(phoneNumber);
            return false;
        } catch (Exception e) {
            System.err.println("Error during OTP verification: " + e.getMessage());
            recordFailedAttempt(phoneNumber);
            return false;
        }
    }

    /**
     * Record a failed login attempt for a phone number
     * @param phoneNumber The phone number
     */
    private void recordFailedAttempt(String phoneNumber) {
        int currentAttempts = failedAttempts.getOrDefault(phoneNumber, 0);
        failedAttempts.put(phoneNumber, currentAttempts + 1);
        System.out.println("Failed attempt recorded for " + phoneNumber + ". Total: " + (currentAttempts + 1));
    }

    /**
     * Reset failed attempts counter after successful verification
     * @param phoneNumber The phone number
     */
    private void resetFailedAttempts(String phoneNumber) {
        failedAttempts.remove(phoneNumber);
        System.out.println("Failed attempts counter reset for " + phoneNumber);
    }
}
