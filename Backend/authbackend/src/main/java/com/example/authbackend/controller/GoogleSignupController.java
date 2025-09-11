package com.example.authbackend.controller;

import com.example.authbackend.dto.GoogleAuthRequest;
import com.example.authbackend.service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class GoogleSignupController {

    @Autowired
    private GoogleAuthService googleAuthService;

    /**
     * Google Signup - Verify Google token and return user data for password setup
     */
    @PostMapping("/google/signup")
    public ResponseEntity<Map<String, Object>> googleSignup(@RequestBody GoogleAuthRequest request) {
        try {
            // Verify Google token and extract user information
            Map<String, Object> result = googleAuthService.verifyGoogleTokenForSignup(request.getIdToken());
            
            if (result.containsKey("error")) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", result.get("error").toString()
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Google account verified. Please set a password to complete signup.",
                "user", result
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Google signup verification failed: " + e.getMessage()
            ));
        }
    }
}
