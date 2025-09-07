package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.GoogleAuthRequestDto;
import com.example.authbackend.dto.Response;

public interface IGoogleAuthService {
    
    Response authenticateWithGoogle(GoogleAuthRequestDto request);
    Response verifyGoogleTokenForSignup(String idToken);
}
