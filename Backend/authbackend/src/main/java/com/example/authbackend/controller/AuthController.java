package com.example.authbackend.controller;

import com.example.authbackend.model.User;
import com.example.authbackend.repository.UserRepository;
import com.example.authbackend.service.EmailOtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailOtpService emailOtpService;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ Fix: Add Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> request) {
        String emailOrContact = request.get("emailOrContact");
        String password = request.get("password");
        String contactType = request.get("contactType"); // "email" or "phone"

        Optional<User> userOptional;
        
        if ("phone".equals(contactType)) {
            // Search by phone number
            userOptional = userRepository.findByContactNumber(emailOrContact);
        } else {
            // Default to email search
            userOptional = userRepository.findByEmail(emailOrContact);
        }
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                // Debug logging to check what's stored in database
                System.out.println("User found - Email: " + user.getEmail());
                System.out.println("FirstName: " + user.getFirstName());
                System.out.println("LastName: " + user.getLastName());
                System.out.println("Username: " + user.getUsername());
                System.out.println("Provider: " + user.getProvider());
                
                String displayName = "";
                if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty() && 
                    user.getLastName() != null && !user.getLastName().trim().isEmpty()) {
                    displayName = (user.getFirstName().trim() + " " + user.getLastName().trim());
                } else if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) {
                    displayName = user.getFirstName().trim();
                } else if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) {
                    displayName = user.getLastName().trim();
                } else if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) {
                    displayName = user.getUsername().trim();
                } else {
                    displayName = user.getEmail().split("@")[0]; // Use email prefix as fallback
                }
                
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "username", displayName,
                        "displayName", displayName,
                        "email", user.getEmail() != null ? user.getEmail() : "",
                        "phone", user.getContactNumber() != null ? user.getContactNumber() : "",
                        "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                        "lastName", user.getLastName() != null ? user.getLastName() : ""
                ));
            }
        }
        String errorMessage = "phone".equals(contactType) ? 
            "Invalid phone number or password" : "Invalid email or password";
        return ResponseEntity.status(401).body(Map.of("message", errorMessage));
    }

    // Send OTP for login
    @PostMapping("/send-login-otp")
    public ResponseEntity<Map<String, Object>> sendLoginOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String phone = request.get("phone");
        String contactType = request.get("contactType");

        Optional<User> userOptional;
        
        if ("phone".equals(contactType)) {
            userOptional = userRepository.findByContactNumber(phone);
        } else {
            userOptional = userRepository.findByEmail(email);
        }
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            if ("email".equals(contactType)) {
                // Send OTP via email
                boolean otpSent = emailOtpService.sendOtp(email, user.getFirstName(), user.getLastName());
                if (otpSent) {
                    return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "OTP sent to your email"
                    ));
                } else {
                    return ResponseEntity.status(500).body(Map.of(
                        "success", false,
                        "message", "Failed to send OTP"
                    ));
                }
            } else {
                // For phone, use fixed OTP for now
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP sent to your phone (Use: 123456)"
                ));
            }
        }
        
        String errorMessage = "phone".equals(contactType) ? 
            "Phone number not found" : "Email not found";
        return ResponseEntity.status(404).body(Map.of(
            "success", false,
            "message", errorMessage
        ));
    }

    // OTP-based login endpoint
    @PostMapping("/login-otp")
    public ResponseEntity<Map<String, Object>> loginWithOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String phone = request.get("phone");
        String otp = request.get("otp");
        String contactType = request.get("contactType");

        // Verify OTP based on contact type
        boolean isValidOtp = false;
        if ("email".equals(contactType)) {
            isValidOtp = emailOtpService.verifyOtp(email, otp);
        } else {
            // For phone, use fixed OTP for now
            isValidOtp = "123456".equals(otp);
        }
        
        if (!isValidOtp) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "Invalid OTP"
            ));
        }

        Optional<User> userOptional;
        
        if ("phone".equals(contactType)) {
            userOptional = userRepository.findByContactNumber(phone);
        } else {
            userOptional = userRepository.findByEmail(email);
        }
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            String displayName = "";
            if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty() && 
                user.getLastName() != null && !user.getLastName().trim().isEmpty()) {
                displayName = (user.getFirstName().trim() + " " + user.getLastName().trim());
            } else if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) {
                displayName = user.getFirstName().trim();
            } else if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) {
                displayName = user.getUsername().trim();
            } else {
                displayName = user.getEmail() != null ? user.getEmail().split("@")[0] : "User";
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "token", "dummy-token-" + user.getId(), // In production, generate proper JWT token
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername() != null ? user.getUsername() : displayName,
                    "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                    "lastName", user.getLastName() != null ? user.getLastName() : "",
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "phone", user.getContactNumber() != null ? user.getContactNumber() : ""
                )
            ));
        }
        
        String errorMessage = "phone".equals(contactType) ? 
            "Phone number not found" : "Email not found";
        return ResponseEntity.status(404).body(Map.of(
            "success", false,
            "message", errorMessage
        ));
    }

    @PostMapping("/register")  // ✅ Ensure this matches the frontend request
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");

        if (userRepository.findByUsername(username).isPresent() || userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists"));
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }
}


