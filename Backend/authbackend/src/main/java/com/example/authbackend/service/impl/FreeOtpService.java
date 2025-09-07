package com.example.authbackend.service.impl;

import com.example.authbackend.config.FreeOtpConfig;
import com.example.authbackend.dto.*;
import com.example.authbackend.model.Worker;
import com.example.authbackend.security.OtpEncryptionUtil;
import com.example.authbackend.security.RateLimiter;
import com.example.authbackend.service.impl.SmsService;
import com.example.authbackend.service.interfac.IFreeOtpService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.client.ClientHttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
public class FreeOtpService implements IFreeOtpService {

    private final FreeOtpConfig freeOtpConfig;
    private final ObjectMapper objectMapper;
    private final OtpEncryptionUtil encryptionUtil;
    private final RateLimiter rateLimiter;
    private final SmsService smsService;
    private final RestTemplate restTemplate;
    
    @Value("${free-otp.base-url:http://localhost:3000}")
    private String baseUrl;
    
    // Store OTP verification data
    private final Map<String, OtpVerificationDto> otpStorage = new ConcurrentHashMap<>();
    
    // OTP validity in minutes
    private static final int OTP_VALIDITY_MINUTES = 5;

    @Autowired
    public FreeOtpService(FreeOtpConfig freeOtpConfig, ObjectMapper objectMapper,
                          OtpEncryptionUtil encryptionUtil, RateLimiter rateLimiter,
                          SmsService smsService) {
        this.freeOtpConfig = freeOtpConfig;
        this.objectMapper = objectMapper;
        this.encryptionUtil = encryptionUtil;
        this.rateLimiter = rateLimiter;
        this.smsService = smsService;
        
        // Configure RestTemplate with custom error handler
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
     * Get a phone number from the Free OTP service
     * @param country Country code (e.g., "in" for India)
     * @return A phone number or a default one if none available
     */
    @Override
    public Response getPhoneNumber(String country) {
        Response response = new Response();
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl(baseUrl + "/api/v1/phone/list")
                    .queryParam("country", country)
                    .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String responseBody = restTemplate.postForObject(url, entity, String.class);
            
            if (responseBody != null) {
                JsonNode jsonResponse = objectMapper.readTree(responseBody);
                
                if (jsonResponse.has("data") && jsonResponse.get("data").isArray() && 
                    jsonResponse.get("data").size() > 0) {
                    
                    JsonNode phoneData = jsonResponse.get("data").get(0);
                    if (phoneData.has("phone")) {
                        String phoneNumber = phoneData.get("phone").asText();
                        
                        OtpVerificationDto otpDto = new OtpVerificationDto();
                        otpDto.setFreeOtpPhone(phoneNumber);
                        
                        response.setStatusCode(200);
                        response.setMessage("Phone number retrieved successfully");
                        response.setOtpVerificationDto(otpDto);
                        response.setToken(phoneNumber); // Store phone number in token field
                        return response;
                    }
                }
            }
            
            response.setStatusCode(404);
            response.setMessage("No phone numbers available");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting phone number: " + e.getMessage());
        }
        return response;
    }

    private String generateFallbackPhoneNumber(String country) {
        // Generate a random phone number based on country
        SecureRandom random = new SecureRandom();
        if ("in".equalsIgnoreCase(country)) {
            // Indian mobile numbers start with 6, 7, 8, or 9
            int firstDigit = 6 + random.nextInt(4); // 6, 7, 8, or 9
            long remainingDigits = 100000000L + random.nextLong() % 900000000L; // 9 digits
            return "91" + firstDigit + String.format("%09d", Math.abs(remainingDigits));
        } else {
            // Default fallback
            long phoneNumber = 1000000000L + random.nextLong() % 9000000000L;
            return String.valueOf(phoneNumber);
        }
    }

    /**
     * Generate OTP for worker phone verification
     */
    @Override
    public Response generateOtp(Worker worker) {
        Response response = new Response();
        try {
            if (worker == null || worker.getPhone() == null || worker.getPhone().trim().isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("Invalid worker or phone number");
                return response;
            }

            String phoneNumber = worker.getPhone();
            
            // Check rate limiting
            if (rateLimiter.isPhoneLimited(phoneNumber)) {
                response.setStatusCode(429);
                response.setMessage("Rate limit exceeded for phone number");
                return response;
            }

            // Get a phone number from Free OTP service
            Response phoneResponse = getPhoneNumber("in");
            String freeOtpPhone = phoneResponse.getToken(); // Phone number stored in token field
            
            // Generate OTP
            String otp = generateOtpCode();
            
            // Store OTP data
            OtpVerificationDto otpData = new OtpVerificationDto(
                otp, 
                LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES),
                freeOtpPhone
            );
            otpData.setPhoneNumber(phoneNumber);
            
            String encryptedKey = encryptionUtil.encrypt(phoneNumber);
            otpStorage.put(encryptedKey, otpData);
            
            // Send OTP via SMS using our SMS service as fallback
            boolean smsSent = smsService.sendSms(phoneNumber, "Your NeedStation OTP is: " + otp + ". Valid for " + OTP_VALIDITY_MINUTES + " minutes.");
            
            if (smsSent) {
                response.setStatusCode(200);
                response.setMessage("OTP sent successfully to " + phoneNumber);
                response.setOtpVerificationDto(otpData);
                response.setOtpId(encryptedKey);
            } else {
                response.setStatusCode(500);
                response.setMessage("Failed to send OTP to " + phoneNumber);
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error generating OTP: " + e.getMessage());
        }
        return response;
    }

    /**
     * Listen for incoming OTP messages
     * @param phoneNumber Phone number to listen for
     * @param matcher Regex pattern to match OTP
     * @param timeoutSeconds Seconds to wait for an OTP
     * @return Response with OTP verification data
     */
    @Override
    public Response listenForOtp(String phoneNumber, String matcher, int timeoutSeconds) {
        Response response = new Response();
        try {
            CompletableFuture<String> otpFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    String url = UriComponentsBuilder
                            .fromHttpUrl(baseUrl + "/api/v1/sms/list")
                            .queryParam("phone", phoneNumber)
                            .toUriString();

                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    HttpEntity<String> entity = new HttpEntity<>(headers);

                    // Poll for messages
                    for (int i = 0; i < timeoutSeconds; i++) {
                        String responseBody = restTemplate.postForObject(url, entity, String.class);
                        
                        if (responseBody != null) {
                            JsonNode jsonResponse = objectMapper.readTree(responseBody);
                            
                            if (jsonResponse.has("data") && jsonResponse.get("data").isArray()) {
                                for (JsonNode smsData : jsonResponse.get("data")) {
                                    if (smsData.has("message")) {
                                        String message = smsData.get("message").asText();
                                        Pattern pattern = Pattern.compile(matcher);
                                        Matcher regexMatcher = pattern.matcher(message);
                                        
                                        if (regexMatcher.find()) {
                                            return regexMatcher.group();
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Wait 1 second before next poll
                        Thread.sleep(1000);
                    }
                    
                    return null;
                    
                } catch (Exception e) {
                    return null;
                }
            });

            // Wait for the result with timeout
            String otp = otpFuture.get(timeoutSeconds + 5, TimeUnit.SECONDS);
            
            if (otp != null) {
                OtpVerificationDto otpDto = new OtpVerificationDto();
                otpDto.setOtp(otp);
                otpDto.setPhoneNumber(phoneNumber);
                otpDto.setVerified(true);
                
                response.setStatusCode(200);
                response.setMessage("OTP received successfully");
                response.setOtpVerificationDto(otpDto);
                response.setToken(otp);
            } else {
                response.setStatusCode(404);
                response.setMessage("No OTP found within timeout period");
            }
            
        } catch (TimeoutException e) {
            response.setStatusCode(408);
            response.setMessage("Timeout waiting for OTP");
        } catch (InterruptedException | ExecutionException e) {
            response.setStatusCode(500);
            response.setMessage("Error listening for OTP: " + e.getMessage());
        }
        return response;
    }

    /**
     * Verify OTP for worker phone verification
     * @param worker Worker object containing phone and OTP details
     * @param userProvidedOtp OTP provided by the user
     * @return Response with verification result
     */
    @Override
    public Response verifyOtp(Worker worker, String userProvidedOtp) {
        Response response = new Response();
        try {
            if (worker == null || worker.getPhone() == null || worker.getPhone().trim().isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("Invalid worker or phone number");
                return response;
            }

            if (userProvidedOtp == null || userProvidedOtp.trim().isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("OTP is required");
                return response;
            }

            String phoneNumber = worker.getPhone();
            String encryptedKey = encryptionUtil.encrypt(phoneNumber);
            
            // Get stored OTP data
            OtpVerificationDto storedOtpData = otpStorage.get(encryptedKey);
            
            if (storedOtpData == null) {
                response.setStatusCode(404);
                response.setMessage("No OTP found for this phone number. Please generate a new OTP.");
                return response;
            }

            // Check if OTP is expired
            if (storedOtpData.getExpiryTime().isBefore(LocalDateTime.now())) {
                otpStorage.remove(encryptedKey); // Clean up expired OTP
                response.setStatusCode(400);
                response.setMessage("OTP has expired. Please generate a new OTP.");
                return response;
            }

            // Verify OTP
            if (storedOtpData.getOtp().equals(userProvidedOtp.trim())) {
                // OTP is correct
                storedOtpData.setVerified(true);
                otpStorage.remove(encryptedKey); // Clean up verified OTP
                
                // Update worker verification status
                worker.setPhoneVerified(true);
                worker.setPhoneVerificationOtp(null);
                worker.setOtpVerifiedAt(LocalDateTime.now());
                
                response.setStatusCode(200);
                response.setMessage("OTP verified successfully");
                response.setOtpVerificationDto(storedOtpData);
                response.setToken("verified");
            } else {
                // OTP is incorrect
                response.setStatusCode(400);
                response.setMessage("Invalid OTP. Please check and try again.");
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
}
