package com.example.authbackend.controller;

import com.example.authbackend.dto.LocationDTO;
import com.example.authbackend.dto.UserFormDataDTO;
import com.example.authbackend.model.User;
import com.example.authbackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/update-location")
    public ResponseEntity<String> updateLocation(@RequestBody LocationDTO locationDTO) {
        try {
            System.out.println("🔍 Backend: Received location update request");
            System.out.println("🔍 Backend: LocationDTO: " + locationDTO);
            System.out.println("🔍 Backend: UserIdentifier: " + locationDTO.getUserIdentifier());
            System.out.println("🔍 Backend: Lat: " + locationDTO.getLat());
            System.out.println("🔍 Backend: Lng: " + locationDTO.getLng());
            System.out.println("🔍 Backend: Address: " + locationDTO.getAddress());
            
            User user = null;
            
            // First try to find by direct user ID (preferred method)
            if (locationDTO.getUserId() != null) {
                System.out.println("🔍 Backend: Searching for user by ID: " + locationDTO.getUserId());
                Optional<User> userOpt = userRepository.findById(locationDTO.getUserId());
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                    System.out.println("✅ Backend: User found by ID: " + user.getUsername());
                }
            }
            
            // Fallback: try to find by email, then by username (legacy method)
            if (user == null && locationDTO.getUserIdentifier() != null) {
                System.out.println("🔍 Backend: Searching for user by email: " + locationDTO.getUserIdentifier());
                Optional<User> userOpt = userRepository.findByEmail(locationDTO.getUserIdentifier());
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                    System.out.println("✅ Backend: User found by email: " + user.getUsername());
                } else {
                    System.out.println("❌ Backend: User not found by email, trying username...");
                    userOpt = userRepository.findByUsername(locationDTO.getUserIdentifier());
                    if (userOpt.isPresent()) {
                        user = userOpt.get();
                        System.out.println("✅ Backend: User found by username: " + user.getUsername());
                    } else {
                        System.out.println("❌ Backend: User not found by username either");
                    }
                }
            }
            
            if (user == null) {
                System.out.println("❌ Backend: No user found with identifier: " + locationDTO.getUserIdentifier());
                return ResponseEntity.badRequest().body("User not found with identifier: " + locationDTO.getUserIdentifier());
            }

            user.setLocationLat(locationDTO.getLat());
            user.setLocationLng(locationDTO.getLng());
            user.setLocationAddress(locationDTO.getAddress());
            
            userRepository.save(user);
            
            return ResponseEntity.ok("Location updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating location: " + e.getMessage());
        }
    }

    // Debug endpoint to test connectivity
    @GetMapping("/debug")
    public ResponseEntity<String> debugEndpoint() {
        return ResponseEntity.ok("UserController is working! Time: " + System.currentTimeMillis());
    }

    @PostMapping("/update-form-data")
    public ResponseEntity<String> updateFormData(@RequestBody UserFormDataDTO formDataDTO) {
        try {
            // Debug logging
            System.out.println("Received form data:");
            System.out.println("User Identifier: " + formDataDTO.getUserIdentifier());
            System.out.println("Address: " + formDataDTO.getAddress());
            System.out.println("Landmark: " + formDataDTO.getLandmark());
            System.out.println("Pincode: " + formDataDTO.getPincode());
            System.out.println("Contact Number: " + formDataDTO.getContactNumber());
            System.out.println("Alternate Contact: " + formDataDTO.getAlternateContact());
            System.out.println("Preferred Date: " + formDataDTO.getPreferredDate());
            System.out.println("Preferred Time: " + formDataDTO.getPreferredTime());
            System.out.println("Work Details: " + formDataDTO.getWorkDetails());
            
            User user = null;
            if (formDataDTO.getUserIdentifier() != null) {
                Optional<User> userOpt = userRepository.findByEmail(formDataDTO.getUserIdentifier());
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                } else {
                    userOpt = userRepository.findByUsername(formDataDTO.getUserIdentifier());
                    if (userOpt.isPresent()) {
                        user = userOpt.get();
                    }
                }
            }
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Update all form data fields
            System.out.println("Setting address: " + formDataDTO.getAddress());
            user.setAddress(formDataDTO.getAddress());
            user.setLandmark(formDataDTO.getLandmark());
            user.setPincode(formDataDTO.getPincode());
            user.setContactNumber(formDataDTO.getContactNumber());
            user.setAlternateContact(formDataDTO.getAlternateContact());
            user.setPreferredDate(formDataDTO.getPreferredDate());
            user.setPreferredTime(formDataDTO.getPreferredTime());
            user.setWorkDetails(formDataDTO.getWorkDetails());
                
            // Update location data if provided
            if (formDataDTO.getLocationLat() != null && formDataDTO.getLocationLng() != null) {
                user.setLocationLat(formDataDTO.getLocationLat());
                user.setLocationLng(formDataDTO.getLocationLng());
                user.setLocationAddress(formDataDTO.getLocationAddress());
            }
            
            System.out.println("Before save - Address: " + user.getAddress());
            System.out.println("Before save - Landmark: " + user.getLandmark());
            System.out.println("Before save - Pincode: " + user.getPincode());
            System.out.println("Before save - Contact Number: " + user.getContactNumber());
            System.out.println("Before save - Alternate Contact: " + user.getAlternateContact());
            
            User savedUser = userRepository.save(user);
            
            System.out.println("After save - User ID: " + savedUser.getId());
            System.out.println("After save - Address: " + savedUser.getAddress());
            System.out.println("After save - Landmark: " + savedUser.getLandmark());
            System.out.println("After save - Pincode: " + savedUser.getPincode());
            System.out.println("After save - Contact Number: " + savedUser.getContactNumber());
            
            return ResponseEntity.ok("Form data updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating form data: " + e.getMessage());
        }
    }
}
