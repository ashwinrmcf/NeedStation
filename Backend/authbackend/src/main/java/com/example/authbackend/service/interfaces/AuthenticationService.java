package com.example.authbackend.service.interfaces;

import com.example.authbackend.model.User;
import java.util.Optional;

/**
 * Interface for authentication services
 * Abstracts different authentication methods and providers
 */
public interface AuthenticationService {
    
    /**
     * Register a new user
     * @param username User's username
     * @param email User's email address
     * @param password User's password (will be encoded)
     * @return Success or error message
     */
    String registerUser(String username, String email, String password);
    
    /**
     * Authenticate user with credentials
     * @param identifier Username or email
     * @param password User's password
     * @return Optional User if authentication successful
     */
    Optional<User> authenticateUser(String identifier, String password);
    
    /**
     * Check if user exists by username
     * @param username Username to check
     * @return true if user exists
     */
    boolean userExistsByUsername(String username);
    
    /**
     * Check if user exists by email
     * @param email Email to check
     * @return true if user exists
     */
    boolean userExistsByEmail(String email);
    
    /**
     * Update user password
     * @param userId User ID
     * @param newPassword New password (will be encoded)
     * @return true if password updated successfully
     */
    boolean updatePassword(Long userId, String newPassword);
}
