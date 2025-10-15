package com.example.authbackend.controller;

import com.example.authbackend.dto.SignupStep1Request;
import com.example.authbackend.dto.SignupStep2Request;
import com.example.authbackend.dto.OtpVerificationRequest;
import com.example.authbackend.model.User;
import com.example.authbackend.service.EmailOtpService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.authbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class SignupController {

    @Autowired
    private EmailOtpService emailOtpService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    private ConcurrentHashMap<String, PhoneOtpData> phoneOtpStorage = new ConcurrentHashMap<>();

    private ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    // Inner class to store phone OTP data
    private static class PhoneOtpData {
        String firstName;
        String lastName;
        String phone;
        String otp;
        long timestamp;
        
        PhoneOtpData(String firstName, String lastName, String phone, String otp) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.phone = phone;
            this.otp = otp;
            this.timestamp = System.currentTimeMillis();
        }
    }

    /**
     * Step 1: Send OTP to email or phone
     */
    @PostMapping("/signup/step1")
    public ResponseEntity<Map<String, Object>> signupStep1(@Valid @RequestBody SignupStep1Request request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String contactType = request.getContactType();
            
            // Add logging for debugging
            System.out.println("SignupStep1 - ContactType: " + contactType);
            System.out.println("SignupStep1 - Phone: " + request.getPhone());
            System.out.println("SignupStep1 - Email: " + request.getEmail());
            
            if ("phone".equals(contactType)) {
                // Validate phone number
                if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                    response.put("success", false);
                    response.put("message", "Phone number is required");
                    return ResponseEntity.badRequest().body(response);
                }
                
                // For phone signup, simulate OTP sending and store data
                String simulatedOtp = "123456"; // In production, generate random 6-digit OTP
                String phoneKey = "phone_" + request.getPhone();
                
                // Store phone OTP data
                PhoneOtpData otpData = new PhoneOtpData(
                    request.getFirstName(), 
                    request.getLastName(), 
                    request.getPhone(), 
                    simulatedOtp
                );
                phoneOtpStorage.put(phoneKey, otpData);
                
                // Schedule cleanup after 10 minutes
                scheduler.schedule(() -> phoneOtpStorage.remove(phoneKey), 10, TimeUnit.MINUTES);
                
                response.put("success", true);
                response.put("message", "OTP sent to your phone");
                return ResponseEntity.ok(response);
            } else {
                // Default email flow - keep existing logic unchanged
                // Validate email for email signup
                if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                    response.put("success", false);
                    response.put("message", "Email is required");
                    return ResponseEntity.badRequest().body(response);
                }
                
                // Check if email already exists
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                    response.put("success", false);
                    response.put("message", "Email already exists");
                    return ResponseEntity.badRequest().body(response);
                }

                // Send OTP with user data
                boolean otpSent = emailOtpService.sendOtp(request.getEmail(), 
                    request.getFirstName(), request.getLastName());
                
                if (otpSent) {
                    response.put("success", true);
                    response.put("message", "OTP sent to your email");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Failed to send OTP. Please try again.");
                    return ResponseEntity.internalServerError().body(response);
                }
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Verify OTP for email or phone
     */
    @PostMapping("/signup/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String contactType = request.getContactType();
            
            if ("phone".equals(contactType)) {
                // For phone verification, check against stored OTP
                String phoneKey = "phone_" + request.getPhone();
                PhoneOtpData storedData = phoneOtpStorage.get(phoneKey);
                
                if (storedData == null) {
                    response.put("success", false);
                    response.put("message", "OTP expired or not found. Please request a new OTP.");
                    return ResponseEntity.badRequest().body(response);
                }
                
                if (request.getOtp() != null && request.getOtp().equals(storedData.otp)) {
                    response.put("success", true);
                    response.put("message", "Phone verified successfully");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Invalid OTP");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                // Default email flow - keep existing logic unchanged
                boolean isValid = emailOtpService.verifyOtp(request.getEmail(), request.getOtp());
                
                if (isValid) {
                    response.put("success", true);
                    response.put("message", "Email verified successfully");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Invalid or expired OTP");
                    return ResponseEntity.badRequest().body(response);
                }
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Step 2: Complete registration with password
     */
    @PostMapping("/signup/step2")
    public ResponseEntity<Map<String, Object>> signupStep2(@Valid @RequestBody SignupStep2Request request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verify passwords match
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                response.put("success", false);
                response.put("message", "Passwords do not match");
                return ResponseEntity.badRequest().body(response);
            }

            String contactType = request.getContactType();
            
            // Check if this is a Google signup (has firstName/lastName in request) or regular signup
            boolean isGoogleSignup = request.getFirstName() != null && request.getLastName() != null;
            
            Map<String, String> userData;
            if (isGoogleSignup) {
                // For Google signups, use the data from the request directly
                userData = Map.of(
                    "firstName", request.getFirstName(),
                    "lastName", request.getLastName()
                );
            } else if ("phone".equals(contactType)) {
                // For phone signups, get stored user data
                String phoneKey = "phone_" + request.getPhone();
                PhoneOtpData storedData = phoneOtpStorage.get(phoneKey);
                if (storedData == null) {
                    response.put("success", false);
                    response.put("message", "Phone verification required. Please complete step 1.");
                    return ResponseEntity.badRequest().body(response);
                }
                userData = Map.of(
                    "firstName", storedData.firstName,
                    "lastName", storedData.lastName
                );
            } else {
                // For email signups, verify OTP was completed
                userData = emailOtpService.getPendingUserData(request.getEmail());
                if (userData == null) {
                    response.put("success", false);
                    response.put("message", "Email verification required. Please complete step 1.");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            // Create user
            User user = new User();
            if ("phone".equals(contactType)) {
                user.setContactNumber(request.getPhone());
                user.setEmail(null); // Explicitly set email to null for phone users
                // For phone signup, generate username from phone
                String baseUsername = "user" + request.getPhone().substring(request.getPhone().length() - 4);
                String username = baseUsername;
                int counter = 1;
                
                // Ensure username is unique
                while (userRepository.findByUsername(username).isPresent()) {
                    username = baseUsername + counter;
                    counter++;
                }
                user.setUsername(username);
            } else {
                user.setEmail(request.getEmail());
                // Generate unique username from email (part before @)
                String baseUsername = request.getEmail().split("@")[0];
                String username = baseUsername;
                int counter = 1;
                
                // Ensure username is unique
                while (userRepository.findByUsername(username).isPresent()) {
                    username = baseUsername + counter;
                    counter++;
                }
                user.setUsername(username);
            }
            
            user.setPassword(request.getPassword()); // Will be encoded by AuthService
            user.setFirstName(userData.get("firstName"));
            user.setLastName(userData.get("lastName"));
            // Set full name as concatenation of first and last name
            user.setFullName(userData.get("firstName") + " " + userData.get("lastName"));
            user.setProvider(isGoogleSignup ? "GOOGLE" : "LOCAL");
            user.setVerified(true); // Contact was verified via OTP
            
            // Set phone/email verified flags based on signup method
            if ("phone".equals(contactType)) {
                user.setPhoneVerified(true); // Phone was verified via OTP
                user.setEmailVerified(false); // No email provided
            } else {
                user.setEmailVerified(true); // Email was verified via OTP
                user.setPhoneVerified(false); // No phone provided yet
            }

            // Check if user already exists
            if ("phone".equals(contactType)) {
                // For phone signup, check if phone already exists (implement this check if needed)
                // Currently no phone-based user lookup in repository
            } else if (user.getEmail() != null && userRepository.findByEmail(user.getEmail()).isPresent()) {
                response.put("success", false);
                response.put("message", "User already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Encode password and save user directly
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            
            // Clear OTP data (for both email and phone signups, not Google)
            if (!isGoogleSignup) {
                if ("email".equals(contactType)) {
                    emailOtpService.clearOtpData(request.getEmail());
                } else if ("phone".equals(contactType)) {
                    phoneOtpStorage.remove("phone_" + request.getPhone());
                }
            }

            response.put("success", true);
            response.put("message", "Account created successfully");
            response.put("user", Map.of(
                "id", savedUser.getId(),
                "username", savedUser.getUsername(),
                "email", savedUser.getEmail() != null ? savedUser.getEmail() : ""
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create account. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Resend OTP
     */
    @PostMapping("/signup/resend-otp")
    public ResponseEntity<Map<String, Object>> resendOtp(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String contactType = request.get("contactType");
            
            if ("phone".equals(contactType)) {
                // For phone resend, check if data exists and simulate resending
                String phoneKey = "phone_" + request.get("phone");
                PhoneOtpData storedData = phoneOtpStorage.get(phoneKey);
                
                if (storedData == null) {
                    response.put("success", false);
                    response.put("message", "Phone data not found. Please start signup again.");
                    return ResponseEntity.badRequest().body(response);
                }
                
                // Update timestamp for the existing data
                storedData.timestamp = System.currentTimeMillis();
                
                // Simulate resending OTP (in real implementation, send SMS)
                response.put("success", true);
                response.put("message", "OTP resent to your phone!");
                return ResponseEntity.ok(response);
            } else {
                // Default email flow - keep existing logic unchanged
                String email = request.get("email");

                // Get user data for resending OTP
                Map<String, String> userData = emailOtpService.getPendingUserData(email);
                if (userData == null) {
                    response.put("success", false);
                    response.put("message", "No pending signup data found for this email");
                    return ResponseEntity.badRequest().body(response);
                }
                
                boolean otpSent = emailOtpService.sendOtp(email, userData.get("firstName"), userData.get("lastName"));
                
                if (otpSent) {
                    response.put("success", true);
                    response.put("message", "OTP resent to your email");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Failed to resend OTP. Please try again.");
                    return ResponseEntity.internalServerError().body(response);
                }
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
