package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.model.User;
import com.example.authbackend.repository.UserRepository;
import com.example.authbackend.service.interfac.IGoogleAuthService;
import com.example.authbackend.utils.Utils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class GoogleAuthService implements IGoogleAuthService {

    private static final Logger logger = Logger.getLogger(GoogleAuthService.class.getName());

    @Value("${google.oauth.client-id}")
    private String googleClientId;

    private final UserRepository userRepository;

    @Autowired
    public GoogleAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Response authenticateWithGoogle(GoogleAuthRequestDto request) {
        Response response = new Response();
        try {
            // Verify Google ID Token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            logger.info("Verifying Google ID token with client ID: " + googleClientId);
            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            logger.info("Token verification result: " + (idToken != null ? "SUCCESS" : "FAILED"));
            
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String picture = (String) payload.get("picture");
                
                logger.info("Google authentication successful for email: " + email);
                
                // Check if user exists, if not create new user
                User user = findOrCreateUser(email, name, picture);
                
                // Generate JWT token (you can implement JWT service)
                String jwtToken = generateJwtToken(user);
                
                UserDto userDto = Utils.mapUserEntityToUserDto(user);
                response.setUserDto(userDto);
                response.setToken(jwtToken);
                response.setStatusCode(200);
                response.setMessage("Google authentication successful");
                response.setRole(user.getRole());
                
            } else {
                logger.warning("Invalid Google ID token");
                response.setStatusCode(401);
                response.setMessage("Invalid Google ID token");
            }
            
        } catch (Exception e) {
            logger.severe("Google authentication failed: " + e.getMessage());
            
            // Handle specific case where Google user is not registered
            if (e instanceof RuntimeException && "GOOGLE_USER_NOT_REGISTERED".equals(e.getMessage())) {
                response.setStatusCode(404);
                response.setMessage("Account not found. Please sign up first with Google.");
            } else {
                response.setStatusCode(500);
                response.setMessage("Google authentication failed: " + e.getMessage());
            }
        }
        return response;
    }

    private User findOrCreateUser(String email, String name, String picture) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            // Update user info if needed
            User user = existingUser.get();
            // Split name into first and last name for Google users
            if (name != null && !name.isEmpty()) {
                String[] nameParts = name.split(" ", 2);
                user.setFirstName(nameParts[0]);
                user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
            }
            return userRepository.save(user);
        } else {
            // For Google login, don't auto-create users - they should signup first
            throw new RuntimeException("GOOGLE_USER_NOT_REGISTERED");
        }
    }

    @Override
    public Response verifyGoogleTokenForSignup(String idToken) {
        Response response = new Response();
        try {
            // Verify Google ID Token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken token = verifier.verify(idToken);
            
            if (token != null) {
                GoogleIdToken.Payload payload = token.getPayload();
                
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                
                // Check if user already exists
                if (userRepository.findByEmail(email).isPresent()) {
                    response.setStatusCode(400);
                    response.setMessage("An account with this email already exists. Please use login instead.");
                    return response;
                }
                
                // Split name into first and last name
                String[] nameParts = name.split(" ", 2);
                String firstName = nameParts[0];
                String lastName = nameParts.length > 1 ? nameParts[1] : "";
                
                // Create a GoogleAuthRequestDto with the Google info
                GoogleAuthRequestDto googleAuthDto = new GoogleAuthRequestDto();
                googleAuthDto.setEmail(email);
                googleAuthDto.setFirstName(firstName);
                googleAuthDto.setLastName(lastName);
                googleAuthDto.setIdToken(idToken);
                
                response.setGoogleAuthRequestDto(googleAuthDto);
                response.setStatusCode(200);
                response.setMessage("Google token verified successfully");
                
            } else {
                response.setStatusCode(401);
                response.setMessage("Invalid Google ID token");
            }
            
        } catch (Exception e) {
            logger.severe("Google token verification failed: " + e.getMessage());
            response.setStatusCode(500);
            response.setMessage("Google token verification failed: " + e.getMessage());
        }
        return response;
    }

    private String generateJwtToken(User user) {
        // Simple token generation - you can implement proper JWT here
        // For now, return a basic token
        return "jwt_token_for_" + user.getEmail().replace("@", "_at_");
    }
}
