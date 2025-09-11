package com.example.authbackend.controller;

import com.example.authbackend.dto.GoogleAuthRequest;
import com.example.authbackend.dto.GoogleAuthResponse;
import com.example.authbackend.service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class GoogleLoginController {

    @Autowired
    private GoogleAuthService googleAuthService;

    /**
     * Google Login - Authenticate existing users with Google
     */
    @PostMapping("/google/login")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            GoogleAuthResponse response = googleAuthService.authenticateWithGoogle(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", response.getMessage(),
                    "token", response.getToken(),
                    "user", Map.of(
                        "email", response.getUser().getEmail(),
                        "firstName", response.getUser().getFirstName(),
                        "lastName", response.getUser().getLastName(),
                        "displayName", response.getUser().getFirstName() + " " + response.getUser().getLastName()
                    )
                ));
            } else {
                // Return sophisticated error message for user not found
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", response.getMessage(),
                    "errorType", "USER_NOT_FOUND"
                ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Google login failed: " + e.getMessage(),
                "errorType", "AUTHENTICATION_ERROR"
            ));
        }
    }
}
