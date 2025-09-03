package com.example.authbackend.controller;

import com.example.authbackend.dto.SignupStep1Request;
import com.example.authbackend.dto.SignupStep2Request;
import com.example.authbackend.dto.EmailOtpVerificationRequest;
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

    /**
     * Step 1: Send OTP to email
     */
    @PostMapping("/signup/step1")
    public ResponseEntity<Map<String, Object>> signupStep1(@Valid @RequestBody SignupStep1Request request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
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
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Verify OTP
     */
    @PostMapping("/signup/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody EmailOtpVerificationRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean isValid = emailOtpService.verifyOtp(request.getEmail(), request.getOtp());
            
            if (isValid) {
                response.put("success", true);
                response.put("message", "OTP verified successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid or expired OTP");
                return ResponseEntity.badRequest().body(response);
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

            // Check if this is a Google signup (has firstName/lastName in request) or regular signup
            boolean isGoogleSignup = request.getFirstName() != null && request.getLastName() != null;
            
            Map<String, String> userData;
            if (isGoogleSignup) {
                // For Google signups, use the data from the request directly
                userData = Map.of(
                    "firstName", request.getFirstName(),
                    "lastName", request.getLastName()
                );
            } else {
                // For regular signups, verify OTP was completed
                userData = emailOtpService.getPendingUserData(request.getEmail());
                if (userData == null) {
                    response.put("success", false);
                    response.put("message", "Email verification required. Please complete step 1.");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            // Create user
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword()); // Will be encoded by AuthService
            user.setFirstName(userData.get("firstName"));
            user.setLastName(userData.get("lastName"));
            // Set full name as concatenation of first and last name
            user.setFullName(userData.get("firstName") + " " + userData.get("lastName"));
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
            user.setProvider(isGoogleSignup ? "GOOGLE" : "LOCAL");
            user.setVerified(true); // Email was verified via OTP

            // Check if user already exists
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                response.put("success", false);
                response.put("message", "User already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Encode password and save user directly
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            
            // Clear OTP data (only for regular signups, not Google)
            if (!isGoogleSignup) {
                emailOtpService.clearOtpData(request.getEmail());
            }

            response.put("success", true);
            response.put("message", "Account created successfully");
            response.put("user", Map.of(
                "id", savedUser.getId(),
                "username", savedUser.getUsername(),
                "email", savedUser.getEmail()
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
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
