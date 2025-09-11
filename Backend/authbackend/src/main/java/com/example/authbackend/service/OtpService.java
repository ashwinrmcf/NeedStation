//package com.example.authbackend.service;
//
//import com.example.authbackend.config.OtpConfig;
//import com.example.authbackend.dto.OtpCallbackDTO;
//import com.example.authbackend.dto.OtpRequestDTO;
//import com.example.authbackend.dto.OtpResponseDTO;
//import com.example.authbackend.entity.OtpVerification;
//import com.example.authbackend.repository.OtpVerificationRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.client.RestTemplate;
//
//import java.time.LocalDateTime;
//import java.util.Base64;
//
//@Service
//public class OtpService {
//    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
//
//    @Autowired
//    private RestTemplate restTemplate;
//
//    @Autowired
//    private OtpConfig otpConfig;
//
//    @Autowired
//    private OtpVerificationRepository otpVerificationRepository;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    public OtpResponseDTO sendOtp(OtpRequestDTO request) {
//        try {
//            logger.debug("Preparing to send OTP to phone: {}", request.getPhoneNumber());
//
//            // Prepare HTTP Headers with Basic Auth
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//            // Format the auth header correctly (api_key:api_token)
//            String authString = otpConfig.getApiKey() + ":" + otpConfig.getApiToken();
//            String encodedAuth = Base64.getEncoder().encodeToString(authString.getBytes());
//            headers.set("Authorization", "Basic " + encodedAuth);
//
//            // Log the API endpoint for debugging
//            logger.debug("Using OTP API endpoint: {}", otpConfig.getApiEndpoint());
//
//            // Prepare form data
//            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
//            formData.add("channel", "sms");
//
//            // Format phone number (ensure it has the + prefix)
//            String phoneNumber = request.getPhoneNumber();
//            if (!phoneNumber.startsWith("+")) {
//                phoneNumber = "+" + phoneNumber;
//            }
//            formData.add("phone_sms", phoneNumber);
//
//            // Add required URLs for redirects
//            formData.add("success_redirect_url", otpConfig.getSuccessRedirectUrl());
//            formData.add("fail_redirect_url", otpConfig.getFailRedirectUrl());
//            formData.add("callback_url", otpConfig.getCallbackUrl());
//
//            // Add optional parameters
//            formData.add("captcha", "true");
//            formData.add("hide", "false");
//
//            // Optional metadata
//            if (request.getMetadata() != null) {
//                String metadataJson = objectMapper.writeValueAsString(request.getMetadata());
//                formData.add("metadata", metadataJson);
//            }
//
//            // Log request details for debugging
//            logger.debug("Sending OTP request with parameters: {}", formData);
//
//            // Make the API call
//            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(formData, headers);
//
//            OtpResponseDTO response = restTemplate.postForObject(
//                    otpConfig.getApiEndpoint(),
//                    entity,
//                    OtpResponseDTO.class
//            );
//
//            logger.info("OTP request successful, received OTP ID: {}", response.getOtpId());
//
//            // Save verification record
//            OtpVerification verification = new OtpVerification();
//            verification.setOtpId(response.getOtpId());
//            verification.setOtpSecret(response.getOtpSecret());
//            verification.setPhoneNumber(phoneNumber);
//            verification.setEmail(request.getEmail());
//            verification.setStatus("PENDING");
//            verification.setCreatedAt(LocalDateTime.now());
//            if (request.getUserId() != null) {
//                verification.setUserId(request.getUserId());
//            }
//            otpVerificationRepository.save(verification);
//
//            return response;
//        } catch (Exception e) {
//            logger.error("Error sending OTP: {}", e.getMessage());
//            logger.error("Exception details:", e);
//            throw new RuntimeException("Failed to send OTP", e);
//        }
//    }
//
//    public void processCallback(OtpCallbackDTO callback) {
//        try {
//            logger.info("Processing OTP callback for ID: {}", callback.getOtpId());
//
//            // Find the verification record
//            OtpVerification verification = otpVerificationRepository
//                    .findByOtpId(callback.getOtpId())
//                    .orElseThrow(() -> new RuntimeException("OTP verification record not found"));
//
//            // Verify the otp_secret as an extra security measure
//            if (!verification.getOtpSecret().equals(callback.getOtpSecret())) {
//                logger.warn("OTP secret mismatch for OTP ID: {}", callback.getOtpId());
//                return;
//            }
//
//            // Update verification status
//            verification.setStatus(callback.getAuthStatus());
//            verification.setVerifiedAt(LocalDateTime.now());
//            verification.setIpAddress(callback.getIpAddress());
//            verification.setRiskScore(callback.getRiskScore());
//            otpVerificationRepository.save(verification);
//
//            logger.info("OTP verification updated: {} for phone {}",
//                    callback.getAuthStatus(), callback.getPhoneSms());
//        } catch (Exception e) {
//            logger.error("Error processing OTP callback: ", e);
//        }
//    }
//
//    public boolean isVerified(String otpId) {
//        return otpVerificationRepository
//                .findByOtpId(otpId)
//                .map(verification -> "verified".equals(verification.getStatus()))
//                .orElse(false);
//    }
//}
