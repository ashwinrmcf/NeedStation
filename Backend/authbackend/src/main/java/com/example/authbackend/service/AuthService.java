package com.example.authbackend.service;

import com.example.authbackend.model.User;
import com.example.authbackend.repository.UserRepository;
import com.example.authbackend.security.JwtUtil;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private SmsService smsService;
    
    @Autowired
    private JavaMailSender mailSender;

    public String registerUser(String username, String email, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            return "Username already exists";
        }
        
        if (userRepository.findByEmail(email).isPresent()) {
            return "Email already exists";
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setProvider("LOCAL");
        user.setVerified(false);

        userRepository.save(user);
        return "User registered successfully";
    }

    public String authenticateUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(username);
        }
        
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return "User authenticated successfully";
        }
        
        return "Invalid credentials";
    }

    public boolean userExistsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public boolean userExistsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public String updatePassword(Long userId, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return "Password updated successfully";
        }
        return "User not found";
    }

    /**
     * Login user and generate JWT tokens
     */
    public Map<String, Object> loginUser(String identifier, String password) {
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }
        
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return response;
        }
        
        if (userOpt.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return response;
        }
        
        User user = userOpt.get();
        String role = determineUserRole(user);
        
        String accessToken = jwtUtil.generateToken(user.getUsername(), role, user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("user", createUserResponse(user, role));
        
        return response;
    }

    /**
     * Refresh JWT token
     */
    public Map<String, Object> refreshToken(String refreshToken) {
        try {
            if (!jwtUtil.isRefreshToken(refreshToken)) {
                return createErrorResponse("Invalid refresh token");
            }
            
            String username = jwtUtil.extractUsername(refreshToken);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                return createErrorResponse("User not found");
            }
            
            if (!jwtUtil.validateToken(refreshToken, username)) {
                return createErrorResponse("Refresh token expired");
            }
            
            User user = userOpt.get();
            String role = determineUserRole(user);
            String newAccessToken = jwtUtil.generateToken(username, role, user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("accessToken", newAccessToken);
            response.put("user", createUserResponse(user, role));
            
            return response;
            
        } catch (Exception e) {
            return createErrorResponse("Invalid refresh token");
        }
    }

    /**
     * Register user with Google OAuth
     */
    public Map<String, Object> registerGoogleUser(String email, String firstName, String lastName, String googleId) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            // User exists, login
            User user = existingUser.get();
            return loginExistingUser(user);
        }
        
        // Create new user
        User user = new User();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setFullName(firstName + " " + lastName);
        user.setUsername(email); // Use email as username for Google users
        user.setProvider("GOOGLE");
        user.setVerified(true); // Google users are pre-verified
        
        userRepository.save(user);
        
        return loginExistingUser(user);
    }

    private Map<String, Object> loginExistingUser(User user) {
        String role = determineUserRole(user);
        String accessToken = jwtUtil.generateToken(user.getUsername(), role, user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("user", createUserResponse(user, role));
        
        return response;
    }

    private String determineUserRole(User user) {
        // Add logic to determine user role based on your business rules
        // For now, default to USER role
        return "USER";
    }

    private Map<String, Object> createUserResponse(User user, String role) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("fullName", user.getFullName());
        userResponse.put("provider", user.getProvider());
        userResponse.put("verified", user.getVerified());
        userResponse.put("role", role);
        return userResponse;
    }

    public Map<String, Object> sendLoginOtp(String contactValue, String contactType) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = Optional.empty();
            
            // Find user by email or phone based on contact type
            if ("email".equals(contactType)) {
                userOpt = userRepository.findByEmail(contactValue);
                if (userOpt.isEmpty()) {
                    response.put("success", false);
                    response.put("message", "No account found with this email address");
                    return response;
                }
            } else if ("phone".equals(contactType)) {
                userOpt = userRepository.findByContactNumber(contactValue);
                if (userOpt.isEmpty()) {
                    response.put("success", false);
                    response.put("message", "No account found with this phone number");
                    return response;
                }
            } else {
                response.put("success", false);
                response.put("message", "Invalid contact type");
                return response;
            }
            
            User user = userOpt.get();
            
            // Generate 6-digit OTP
            String otp = String.format("%06d", new Random().nextInt(1000000));
            
            boolean otpSent = false;
            String deliveryTarget = "";
            
            if ("email".equals(contactType)) {
                // For email login, always send OTP to email address
                otpSent = sendEmailOtp(contactValue, otp);
                deliveryTarget = contactValue;
            } else {
                // For phone login, send SMS OTP
                otpSent = smsService.sendOtpSms(contactValue, otp);
                deliveryTarget = contactValue;
            }
            
            if (otpSent) {
                response.put("success", true);
                response.put("message", "OTP sent successfully to " + deliveryTarget);
                response.put("userId", user.getId());
                // TODO: Store OTP in database for verification
            } else {
                response.put("success", false);
                response.put("message", "Failed to send OTP. Please try again.");
            }
            
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send OTP: " + e.getMessage());
            return response;
        }
    }

    public Map<String, Object> verifyLoginOtp(String contactValue, String contactType, String otp) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = Optional.empty();
            
            // Find user by email or phone based on contact type
            if ("email".equals(contactType)) {
                userOpt = userRepository.findByEmail(contactValue);
                if (userOpt.isEmpty()) {
                    response.put("success", false);
                    response.put("message", "No account found with this email address");
                    return response;
                }
            } else if ("phone".equals(contactType)) {
                userOpt = userRepository.findByContactNumber(contactValue);
                if (userOpt.isEmpty()) {
                    response.put("success", false);
                    response.put("message", "No account found with this phone number");
                    return response;
                }
            } else {
                response.put("success", false);
                response.put("message", "Invalid contact type");
                return response;
            }
            
            User user = userOpt.get();
            
            // TODO: Implement proper OTP verification from database
            // For now, we'll accept any 6-digit OTP for testing
            if (otp.length() != 6 || !otp.matches("\\d{6}")) {
                response.put("success", false);
                response.put("message", "Invalid OTP format");
                return response;
            }
            
            // Generate JWT tokens for successful login
            String role = "USER"; // Default role for regular users
            String accessToken = jwtUtil.generateToken(user.getUsername(), role, user.getId());
            String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
            
            // Create user response
            Map<String, Object> userResponse = createUserResponse(user, role);
            
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            response.put("user", userResponse);
            
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to verify OTP: " + e.getMessage());
            return response;
        }
    }

    /**
     * Send OTP via email using Spring Boot Mail
     */
    private boolean sendEmailOtp(String email, String otp) {
        try {
            // Send actual email using JavaMailSender
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setFrom("needstation3@gmail.com");
            message.setSubject("Your NeedStation Login OTP");
            message.setText("Your OTP for login is: " + otp + ". This OTP is valid for 5 minutes. Please do not share this code with anyone.");
            
            mailSender.send(message);
            
            // Also log for debugging
            System.out.println("=== EMAIL OTP SENT ===");
            System.out.println("To: " + email);
            System.out.println("OTP: " + otp);
            System.out.println("======================");
            
            return true;
        } catch (Exception e) {
            System.err.println("Failed to send email OTP: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}
