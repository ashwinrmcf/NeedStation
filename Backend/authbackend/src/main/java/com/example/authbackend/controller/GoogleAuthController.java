package com.example.authbackend.controller;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IGoogleAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "*"})
public class GoogleAuthController {

    @Autowired
    private IGoogleAuthService iGoogleAuthService;

    @PostMapping("/google")
    public Response authenticateWithGoogle(@RequestBody GoogleAuthRequestDto request) {
        return iGoogleAuthService.authenticateWithGoogle(request);
    }

    @PostMapping("/google/verify")
    public Response verifyGoogleToken(@RequestParam String idToken) {
        return iGoogleAuthService.verifyGoogleTokenForSignup(idToken);
    }

    /**
     * Google Login - Authenticate existing users with Google
     */
    @PostMapping("/google/login")
    public Response googleLogin(@RequestBody GoogleAuthRequestDto request) {
        return iGoogleAuthService.authenticateWithGoogle(request);
    }

    /**
     * Google Signup - Verify Google token and return user data for password setup
     */
    @PostMapping("/google/signup")
    public Response googleSignup(@RequestParam String idToken) {
        return iGoogleAuthService.verifyGoogleTokenForSignup(idToken);
    }

    @GetMapping("/google/status")
    public Response getGoogleAuthStatus() {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Google authentication service is running");
        return response;
    }
}
