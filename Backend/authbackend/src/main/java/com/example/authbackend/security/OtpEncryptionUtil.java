package com.example.authbackend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

/**
 * Utility for encrypting and decrypting OTP values
 * Adds an additional layer of security for OTP storage
 */
@Component
public class OtpEncryptionUtil {

    // Secret key for encryption, should be set in application properties
    @Value("${otp.encryption.key:NeedStationDefaultSecretKey12345}")
    private String secretKey;
    
    // GCM authentication tag size
    private static final int GCM_TAG_LENGTH = 128;
    
    // Number of bytes in the IV (Initialization Vector)
    private static final int IV_LENGTH = 12;
    
    // Key length in bits
    private static final int KEY_LENGTH_BITS = 256;
    
    // Secret key cache to avoid recreating it for each operation
    private SecretKey cachedSecretKey = null;
    
    /**
     * Encrypt an OTP value
     * @param otp The OTP to encrypt
     * @return Base64-encoded encrypted OTP
     */
    public String encryptOtp(String otp) {
        try {
            if (otp == null || otp.trim().isEmpty()) {
                return null;
            }
            
            // Generate a random IV
            byte[] iv = new byte[IV_LENGTH];
            new SecureRandom().nextBytes(iv);
            
            // Get or create SecretKey
            SecretKey key = getSecretKey();
            
            // Initialize the cipher for encryption
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, key, parameterSpec);
            
            // Encrypt the OTP
            byte[] encryptedOtp = cipher.doFinal(otp.getBytes(StandardCharsets.UTF_8));
            
            // Combine IV and encrypted data
            byte[] combined = new byte[iv.length + encryptedOtp.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encryptedOtp, 0, combined, iv.length, encryptedOtp.length);
            
            // Return Base64-encoded result
            return Base64.getEncoder().encodeToString(combined);
            
        } catch (Exception e) {
            // Log the error, but don't expose details
            System.err.println("Error encrypting OTP: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Decrypt an encrypted OTP value
     * @param encryptedOtp Base64-encoded encrypted OTP
     * @return Decrypted OTP
     */
    public String decryptOtp(String encryptedOtp) {
        try {
            if (encryptedOtp == null || encryptedOtp.trim().isEmpty()) {
                return null;
            }
            
            // Decode the Base64 string
            byte[] combined = Base64.getDecoder().decode(encryptedOtp);
            
            // Check that the combined array is at least as long as the IV
            if (combined.length <= IV_LENGTH) {
                System.err.println("Invalid encrypted data: too short");
                return null;
            }
            
            // Extract IV and encrypted data
            byte[] iv = new byte[IV_LENGTH];
            byte[] encryptedData = new byte[combined.length - IV_LENGTH];
            System.arraycopy(combined, 0, iv, 0, IV_LENGTH);
            System.arraycopy(combined, IV_LENGTH, encryptedData, 0, encryptedData.length);
            
            // Get or create SecretKey
            SecretKey key = getSecretKey();
            
            // Initialize the cipher for decryption
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, key, parameterSpec);
            
            // Decrypt the OTP
            byte[] decryptedOtp = cipher.doFinal(encryptedData);
            
            // Return the decrypted OTP as a string
            return new String(decryptedOtp, StandardCharsets.UTF_8);
            
        } catch (Exception e) {
            // Log the error, but don't expose details
            System.err.println("Error decrypting OTP: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Get the secret key for encryption/decryption
     * We derive a 256-bit key from the configured secret key string
     * @return SecretKey for AES encryption
     */
    private SecretKey getSecretKey() throws NoSuchAlgorithmException {
        // Check if we already have a cached key
        if (cachedSecretKey != null) {
            return cachedSecretKey;
        }
        
        try {
            // Use SHA-256 to hash the secret key into 32 bytes (256 bits)
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = digest.digest(secretKey.getBytes(StandardCharsets.UTF_8));
            
            // Create and cache the SecretKey
            cachedSecretKey = new SecretKeySpec(keyBytes, "AES");
            return cachedSecretKey;
        } catch (NoSuchAlgorithmException e) {
            // Fallback if SHA-256 is not available (unlikely but possible)
            System.err.println("SHA-256 algorithm not available, using direct key bytes");
            
            // Use first 32 bytes of the key or pad if too short
            byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
            byte[] finalKey = new byte[32]; // 256 bits
            Arrays.fill(finalKey, (byte) 0); // Initialize with zeros
            
            // Copy bytes from the original key, up to 32 bytes
            System.arraycopy(
                keyBytes, 0, 
                finalKey, 0, 
                Math.min(keyBytes.length, 32)
            );
            
            // Create and cache the SecretKey
            cachedSecretKey = new SecretKeySpec(finalKey, "AES");
            return cachedSecretKey;
        }
    }
}
