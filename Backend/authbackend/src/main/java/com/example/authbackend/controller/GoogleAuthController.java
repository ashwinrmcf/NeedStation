package com.example.authbackend.controller;

import com.example.authbackend.dto.GoogleAuthRequest;
import com.example.authbackend.dto.GoogleAuthResponse;
import com.example.authbackend.service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class GoogleAuthController {

    private final GoogleAuthService googleAuthService;

    @Autowired
    public GoogleAuthController(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/google")
    public ResponseEntity<GoogleAuthResponse> authenticateWithGoogle(@RequestBody GoogleAuthRequest request) {
        try {
            GoogleAuthResponse response = googleAuthService.authenticateWithGoogle(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            GoogleAuthResponse errorResponse = new GoogleAuthResponse(false, "Authentication failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/google/status")
    public ResponseEntity<String> getGoogleAuthStatus() {
        return ResponseEntity.ok("Google authentication service is running");
    }
}
