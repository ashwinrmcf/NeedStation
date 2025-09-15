package com.example.authbackend.controller;

import com.example.authbackend.dto.LoginRequest;
import com.example.authbackend.dto.RegisterRequest;
import com.example.authbackend.security.DistributedRateLimiter;
import com.example.authbackend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private DistributedRateLimiter rateLimiter;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {
        
        String clientIp = getClientIpAddress(httpRequest);
        
        // Check rate limiting
        rateLimiter.checkAndThrowIfLimited(clientIp, null);
        
        // Increment attempt counter
        rateLimiter.incrementIpAttempts(clientIp);
        
        String result = authService.registerUser(
            request.getUsername(), 
            request.getEmail(), 
            request.getPassword()
        );
        
        Map<String, Object> response = new HashMap<>();
        
        if (result.equals("User registered successfully")) {
            response.put("success", true);
            response.put("message", result);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", result);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        
        String clientIp = getClientIpAddress(httpRequest);
        
        // Check login rate limiting
        rateLimiter.checkLoginRateLimit(request.getIdentifier());
        
        Map<String, Object> result = authService.loginUser(
            request.getIdentifier(), 
            request.getPassword()
        );
        
        if ((Boolean) result.get("success")) {
            // Reset login attempts on successful login
            rateLimiter.resetLoginAttempts(request.getIdentifier());
            return ResponseEntity.ok(result);
        } else {
            // Increment failed login attempts
            rateLimiter.incrementLoginAttempts(request.getIdentifier());
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        if (refreshToken == null || refreshToken.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Refresh token is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        Map<String, Object> result = authService.refreshToken(refreshToken);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/send-login-otp")
    public ResponseEntity<Map<String, Object>> sendLoginOtp(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String phone = request.get("phone");
            String contactType = request.get("contactType");
            
            // Support both old phoneNumber field and new email/phone fields
            String phoneNumber = request.get("phoneNumber");
            if (phoneNumber != null) {
                phone = phoneNumber;
                contactType = "phone";
            }
            
            String contactValue = null;
            if ("email".equals(contactType) && email != null && !email.isEmpty()) {
                contactValue = email;
            } else if ("phone".equals(contactType) && phone != null && !phone.isEmpty()) {
                contactValue = phone;
            }
            
            if (contactValue == null || contactValue.isEmpty()) {
                response.put("success", false);
                response.put("message", "Email or phone number is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String clientIp = getClientIpAddress(httpRequest);
            
            // Check rate limiting
            rateLimiter.checkAndThrowIfLimited(clientIp, contactValue);
            
            // Increment attempt counter
            rateLimiter.incrementIpAttempts(clientIp);
            
            // Send OTP for login
            Map<String, Object> result = authService.sendLoginOtp(contactValue, contactType);
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send OTP: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<Map<String, Object>> verifyLoginOtp(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String phone = request.get("phone");
            String contactType = request.get("contactType");
            String otp = request.get("otp");
            
            // Support both old phoneNumber field and new email/phone fields
            String phoneNumber = request.get("phoneNumber");
            if (phoneNumber != null) {
                phone = phoneNumber;
                contactType = "phone";
            }
            
            String contactValue = null;
            if ("email".equals(contactType) && email != null && !email.isEmpty()) {
                contactValue = email;
            } else if ("phone".equals(contactType) && phone != null && !phone.isEmpty()) {
                contactValue = phone;
            }
            
            if (contactValue == null || contactValue.isEmpty() || otp == null || otp.isEmpty()) {
                response.put("success", false);
                response.put("message", "Contact information and OTP are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            String clientIp = getClientIpAddress(httpRequest);
            
            // Check rate limiting
            rateLimiter.checkAndThrowIfLimited(clientIp, contactValue);
            
            // Verify OTP and authenticate user
            Map<String, Object> result = authService.verifyLoginOtp(contactValue, contactType, otp);
            
            if ((Boolean) result.get("success")) {
                // Reset login attempts on successful verification
                rateLimiter.resetLoginAttempts(contactValue);
                return ResponseEntity.ok(result);
            } else {
                // Increment failed attempts
                rateLimiter.incrementLoginAttempts(contactValue);
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to verify OTP: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {
        // In a stateless JWT system, logout is typically handled client-side
        // by removing the token. However, you can implement token blacklisting here
        // if needed for additional security
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String username = (String) request.getAttribute("username");
        String role = (String) request.getAttribute("role");
        
        if (userId == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "User not authenticated");
            return ResponseEntity.badRequest().body(response);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", Map.of(
            "id", userId,
            "username", username,
            "role", role
        ));
        
        return ResponseEntity.ok(response);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
