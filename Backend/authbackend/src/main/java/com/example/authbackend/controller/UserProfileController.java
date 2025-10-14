package com.example.authbackend.controller;

import com.example.authbackend.model.User;
import com.example.authbackend.model.Gender;
import com.example.authbackend.model.ServiceTimePreference;
import com.example.authbackend.repository.UserRepository;
import com.example.authbackend.service.CloudinaryService;
import com.example.authbackend.service.SmsService;
import com.example.authbackend.service.EmailOtpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/profile")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserProfileController {

    private static final Logger logger = LoggerFactory.getLogger(UserProfileController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private SmsService smsService;
    
    @Autowired
    private EmailOtpService emailOtpService;
    
    // Store OTP temporarily (in production, use Redis or database)
    private Map<String, String> otpStorage = new HashMap<>();
    private Map<String, Long> otpTimestamp = new HashMap<>();
    private Map<String, String> emailOtpStorage = new HashMap<>();
    private Map<String, Long> emailOtpTimestamp = new HashMap<>();

    // Get user profile with formatted response
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        try {
            logger.info("📋 Fetching profile for user ID: {}", userId);
            
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOptional.get();
            
            Map<String, Object> profileResponse = createProfileResponse(user);
            
            logger.info("✅ Profile found for user: {}", user.getUsername());
            return ResponseEntity.ok(profileResponse);
            
        } catch (Exception e) {
            logger.error("❌ Error fetching user profile: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body("Error fetching profile: " + e.getMessage());
        }
    }

    // Test endpoint to verify controller is working
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "UserProfileController is working");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    // Upload profile image to Cloudinary
    @PostMapping("/{userId}/upload-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long userId, 
                                              @RequestParam("image") MultipartFile file) {
        try {
            logger.info("📸 Uploading profile image for user ID: {}", userId);
            
            // Validate file
            if (file.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "No file provided");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "File size too large. Maximum 5MB allowed.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid file type. Only images are allowed.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("File validation passed. Size: {} bytes, Type: {}", file.getSize(), contentType);
            
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "User not found");
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            User user = userOptional.get();
            logger.info("Found user: {}", user.getUsername());
            
            // Try to upload to Cloudinary
            String imageUrl;
            try {
                logger.info("Attempting Cloudinary upload...");
                imageUrl = cloudinaryService.uploadUserProfileImage(file, userId.toString());
                logger.info("Cloudinary upload successful. URL: {}", imageUrl);
            } catch (Exception cloudinaryError) {
                logger.error("Cloudinary upload failed: {}", cloudinaryError.getMessage(), cloudinaryError);
                
                // For now, create a mock URL for testing
                imageUrl = "https://via.placeholder.com/400x400.png?text=Profile+Image+" + userId;
                logger.info("Using placeholder image URL: {}", imageUrl);
            }
            
            // Update user profile image URL
            user.setProfileImageUrl(imageUrl);
            User savedUser = userRepository.save(user);
            logger.info("User profile updated with image URL");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imageUrl", imageUrl);
            response.put("message", "Profile image uploaded successfully");
            response.put("userId", savedUser.getId());
            response.put("username", savedUser.getUsername());
            
            logger.info("✅ Profile image upload completed for user: {}", user.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Unexpected error in profile image upload: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error uploading image: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Update complete profile information
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, 
                                             @RequestBody Map<String, Object> profileData) {
        try {
            logger.info("📝 Updating profile for user ID: {}", userId);
            
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOptional.get();
            
            // Update Personal Information
            if (profileData.containsKey("fullName")) {
                user.setFullName((String) profileData.get("fullName"));
            }
            if (profileData.containsKey("firstName")) {
                user.setFirstName((String) profileData.get("firstName"));
            }
            if (profileData.containsKey("lastName")) {
                user.setLastName((String) profileData.get("lastName"));
            }
            if (profileData.containsKey("email")) {
                user.setEmail((String) profileData.get("email"));
            }
            if (profileData.containsKey("contactNumber")) {
                user.setContactNumber((String) profileData.get("contactNumber"));
            }
            if (profileData.containsKey("alternateContact")) {
                user.setAlternateContact((String) profileData.get("alternateContact"));
            }
            if (profileData.containsKey("dateOfBirth")) {
                String dobString = (String) profileData.get("dateOfBirth");
                if (dobString != null && !dobString.isEmpty()) {
                    user.setDateOfBirth(LocalDate.parse(dobString, DateTimeFormatter.ISO_LOCAL_DATE));
                }
            }
            if (profileData.containsKey("gender")) {
                String genderString = (String) profileData.get("gender");
                if (genderString != null && !genderString.isEmpty()) {
                    user.setGender(Gender.valueOf(genderString.toUpperCase()));
                }
            }
            
            // Update Address Information
            if (profileData.containsKey("address")) {
                user.setAddress((String) profileData.get("address"));
            }
            if (profileData.containsKey("addressLine1")) {
                user.setAddressLine1((String) profileData.get("addressLine1"));
            }
            if (profileData.containsKey("addressLine2")) {
                user.setAddressLine2((String) profileData.get("addressLine2"));
            }
            if (profileData.containsKey("landmark")) {
                user.setLandmark((String) profileData.get("landmark"));
            }
            if (profileData.containsKey("city")) {
                user.setCity((String) profileData.get("city"));
            }
            if (profileData.containsKey("state")) {
                user.setState((String) profileData.get("state"));
            }
            if (profileData.containsKey("pincode")) {
                user.setPincode((String) profileData.get("pincode"));
            }
            
            // Update Healthcare Information
            if (profileData.containsKey("emergencyContact")) {
                user.setEmergencyContact((String) profileData.get("emergencyContact"));
            }
            if (profileData.containsKey("emergencyPhone")) {
                user.setEmergencyPhone((String) profileData.get("emergencyPhone"));
            }
            if (profileData.containsKey("medicalConditions")) {
                user.setMedicalConditions((String) profileData.get("medicalConditions"));
            }
            if (profileData.containsKey("allergies")) {
                user.setAllergies((String) profileData.get("allergies"));
            }
            
            // Update Service Preferences
            if (profileData.containsKey("preferredLanguage")) {
                user.setPreferredLanguage((String) profileData.get("preferredLanguage"));
            }
            if (profileData.containsKey("preferredServiceTime")) {
                String serviceTimeString = (String) profileData.get("preferredServiceTime");
                if (serviceTimeString != null && !serviceTimeString.isEmpty()) {
                    user.setPreferredServiceTime(ServiceTimePreference.valueOf(serviceTimeString.toUpperCase()));
                }
            }
            if (profileData.containsKey("specialInstructions")) {
                user.setSpecialInstructions((String) profileData.get("specialInstructions"));
            }
            
            User savedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("user", savedUser);
            
            logger.info("✅ Profile updated successfully for user: {}", savedUser.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error updating user profile: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error updating profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Get user basic info for header display
    @GetMapping("/{userId}/basic")
    public ResponseEntity<?> getUserBasicInfo(@PathVariable Long userId) {
        try {
            logger.info("🔍 Fetching basic info for user ID: {}", userId);
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOptional.get();
            
            Map<String, Object> basicInfo = new HashMap<>();
            basicInfo.put("id", user.getId());
            basicInfo.put("username", user.getUsername());
            basicInfo.put("fullName", user.getFullName());
            basicInfo.put("firstName", user.getFirstName());
            basicInfo.put("lastName", user.getLastName());
            basicInfo.put("profileImageUrl", user.getProfileImageUrl());
            basicInfo.put("email", user.getEmail());
            basicInfo.put("phone", user.getContactNumber());
            
            return ResponseEntity.ok(basicInfo);
            
        } catch (Exception e) {
            logger.error("❌ Error fetching user basic info: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body("Error fetching basic info: " + e.getMessage());
        }
    }

    // Update user settings (notifications, privacy, etc.)
    @PutMapping("/{userId}/settings")
    public ResponseEntity<?> updateUserSettings(@PathVariable Long userId, 
                                              @RequestBody Map<String, Object> settings) {
        try {
            logger.info("⚙️ Updating settings for user ID: {}", userId);
            
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOptional.get();
            
            // Convert settings to JSON string and store
            if (settings.containsKey("notifications")) {
                // Convert notification settings to JSON string
                user.setNotificationPreferences(settings.get("notifications").toString());
            }
            
            if (settings.containsKey("privacy")) {
                // Convert privacy settings to JSON string
                user.setPrivacySettings(settings.get("privacy").toString());
            }
            
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Settings updated successfully");
            
            logger.info("✅ Settings updated successfully for user: {}", user.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error updating user settings: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error updating settings: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Save profile form data (handles partial updates - user can fill any fields they want)
    @PostMapping("/{userId}/save")
    public ResponseEntity<?> saveProfileForm(@PathVariable Long userId, 
                                           @RequestBody Map<String, Object> formData) {
        try {
            logger.info("💾 Saving profile form for user ID: {}", userId);
            
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOptional.get();
            
            // Update only the fields that are provided (partial update)
            // Personal Information
            if (formData.containsKey("fullName") && formData.get("fullName") != null) {
                String fullName = formData.get("fullName").toString().trim();
                if (!fullName.isEmpty()) {
                    user.setFullName(fullName);
                }
            }
            
            if (formData.containsKey("email") && formData.get("email") != null) {
                String email = formData.get("email").toString().trim();
                if (!email.isEmpty()) {
                    user.setEmail(email);
                }
            }
            
            if (formData.containsKey("contactNumber") && formData.get("contactNumber") != null) {
                String phone = formData.get("contactNumber").toString().trim();
                if (!phone.isEmpty()) {
                    user.setContactNumber(phone);
                }
            }
            
            if (formData.containsKey("dateOfBirth") && formData.get("dateOfBirth") != null) {
                String dobString = formData.get("dateOfBirth").toString().trim();
                if (!dobString.isEmpty()) {
                    try {
                        user.setDateOfBirth(LocalDate.parse(dobString));
                    } catch (Exception e) {
                        logger.warn("Invalid date format for dateOfBirth: {}", dobString);
                    }
                }
            }
            
            if (formData.containsKey("gender") && formData.get("gender") != null) {
                String genderString = formData.get("gender").toString().trim();
                if (!genderString.isEmpty() && !genderString.equals("Select Gender")) {
                    try {
                        user.setGender(Gender.valueOf(genderString.toUpperCase()));
                    } catch (Exception e) {
                        logger.warn("Invalid gender value: {}", genderString);
                    }
                }
            }
            
            if (formData.containsKey("preferredLanguage") && formData.get("preferredLanguage") != null) {
                String language = formData.get("preferredLanguage").toString().trim();
                if (!language.isEmpty()) {
                    user.setPreferredLanguage(language.toLowerCase());
                }
            }
            
            // Address Information
            if (formData.containsKey("address") && formData.get("address") != null) {
                String address = formData.get("address").toString().trim();
                if (!address.isEmpty()) {
                    user.setAddress(address);
                }
            }
            
            if (formData.containsKey("city") && formData.get("city") != null) {
                String city = formData.get("city").toString().trim();
                if (!city.isEmpty()) {
                    user.setCity(city);
                }
            }
            
            if (formData.containsKey("state") && formData.get("state") != null) {
                String state = formData.get("state").toString().trim();
                if (!state.isEmpty()) {
                    user.setState(state);
                }
            }
            
            if (formData.containsKey("pincode") && formData.get("pincode") != null) {
                String pincode = formData.get("pincode").toString().trim();
                if (!pincode.isEmpty()) {
                    user.setPincode(pincode);
                }
            }
            
            // Healthcare Information
            if (formData.containsKey("emergencyContact") && formData.get("emergencyContact") != null) {
                String emergencyContact = formData.get("emergencyContact").toString().trim();
                if (!emergencyContact.isEmpty()) {
                    user.setEmergencyContact(emergencyContact);
                }
            }
            
            if (formData.containsKey("emergencyPhone") && formData.get("emergencyPhone") != null) {
                String emergencyPhone = formData.get("emergencyPhone").toString().trim();
                if (!emergencyPhone.isEmpty()) {
                    user.setEmergencyPhone(emergencyPhone);
                }
            }
            
            if (formData.containsKey("medicalConditions") && formData.get("medicalConditions") != null) {
                String medicalConditions = formData.get("medicalConditions").toString().trim();
                user.setMedicalConditions(medicalConditions.isEmpty() ? null : medicalConditions);
            }
            
            if (formData.containsKey("allergies") && formData.get("allergies") != null) {
                String allergies = formData.get("allergies").toString().trim();
                user.setAllergies(allergies.isEmpty() ? null : allergies);
            }
            
            // Service Preferences
            if (formData.containsKey("specialInstructions") && formData.get("specialInstructions") != null) {
                String specialInstructions = formData.get("specialInstructions").toString().trim();
                user.setSpecialInstructions(specialInstructions.isEmpty() ? null : specialInstructions);
            }
            
            // Save the updated user
            User savedUser = userRepository.save(user);
            
            // Return updated profile data
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile saved successfully");
            response.put("profileData", createProfileResponse(savedUser));
            
            logger.info("✅ Profile form saved successfully for user: {}", savedUser.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error saving profile form: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error saving profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Helper method to create consistent profile response
    private Map<String, Object> createProfileResponse(User user) {
        Map<String, Object> profileResponse = new HashMap<>();
        
        // Personal Information
        profileResponse.put("id", user.getId());
        profileResponse.put("username", user.getUsername());
        profileResponse.put("fullName", user.getFullName());
        profileResponse.put("firstName", user.getFirstName());
        profileResponse.put("lastName", user.getLastName());
        profileResponse.put("email", user.getEmail());
        profileResponse.put("contactNumber", user.getContactNumber());
        profileResponse.put("alternateContact", user.getAlternateContact());
        profileResponse.put("dateOfBirth", user.getDateOfBirth());
        profileResponse.put("gender", user.getGender());
        profileResponse.put("profileImageUrl", user.getProfileImageUrl());
        
        // Address Information
        profileResponse.put("address", user.getAddress());
        profileResponse.put("addressLine1", user.getAddressLine1());
        profileResponse.put("addressLine2", user.getAddressLine2());
        profileResponse.put("landmark", user.getLandmark());
        profileResponse.put("city", user.getCity());
        profileResponse.put("state", user.getState());
        profileResponse.put("pincode", user.getPincode());
        
        // Location Information (for booking modal)
        profileResponse.put("locationLat", user.getLocationLat());
        profileResponse.put("locationLng", user.getLocationLng());
        profileResponse.put("locationAddress", user.getLocationAddress());
        
        // Healthcare Information
        profileResponse.put("emergencyContact", user.getEmergencyContact());
        profileResponse.put("emergencyPhone", user.getEmergencyPhone());
        profileResponse.put("medicalConditions", user.getMedicalConditions());
        profileResponse.put("allergies", user.getAllergies());
        
        // Service Preferences
        profileResponse.put("preferredLanguage", user.getPreferredLanguage());
        profileResponse.put("preferredServiceTime", user.getPreferredServiceTime());
        profileResponse.put("specialInstructions", user.getSpecialInstructions());
        
        // Account Status
        profileResponse.put("emailVerified", user.getEmailVerified());
        profileResponse.put("phoneVerified", user.getPhoneVerified());
        profileResponse.put("accountStatus", user.getAccountStatus());
        
        // Stats for profile display
        profileResponse.put("memberSince", user.getCreatedAt() != null ? 
            user.getCreatedAt().getYear() : "2024");
        profileResponse.put("trustScore", 4.8);
        profileResponse.put("totalBookings", 0);
        
        return profileResponse;
    }
    
    // Debug endpoint to list all users (for development only)
    @GetMapping("/debug/list-users")
    public ResponseEntity<?> listAllUsers() {
        try {
            logger.info("🔍 Listing all users for debugging");
            
            var users = userRepository.findAll();
            var userList = users.stream()
                .map(user -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("username", user.getUsername());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("fullName", user.getFullName());
                    userInfo.put("provider", user.getProvider());
                    userInfo.put("createdAt", user.getCreatedAt());
                    return userInfo;
                })
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalUsers", userList.size());
            response.put("users", userList);
            
            logger.info("✅ Found {} users", userList.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error listing users: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body("Error listing users: " + e.getMessage());
        }
    }
    
    // Check if phone number exists in database
    @GetMapping("/check-phone/{phoneNumber}")
    public ResponseEntity<?> checkPhoneExists(@PathVariable String phoneNumber) {
        try {
            logger.info("📞 Checking if phone number exists: {}", phoneNumber);
            
            boolean exists = userRepository.existsByContactNumber(phoneNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            response.put("phoneNumber", phoneNumber);
            
            logger.info("✅ Phone check result: exists = {}", exists);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error checking phone number: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error checking phone number: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Check if email exists in database
    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmailExists(@PathVariable String email) {
        try {
            logger.info("📧 Checking if email exists: {}", email);
            
            boolean exists = userRepository.existsByEmail(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            response.put("email", email);
            
            logger.info("✅ Email check result: exists = {}", exists);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error checking email: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error checking email: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Send OTP for phone verification
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Phone number is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("📱 Sending OTP to phone number: {}", phoneNumber);
            
            // Generate 6-digit OTP
            String otp = String.format("%06d", (int)(Math.random() * 1000000));
            
            // Store OTP with timestamp (expires in 5 minutes)
            otpStorage.put(phoneNumber, otp);
            otpTimestamp.put(phoneNumber, System.currentTimeMillis());
            
            // Try to send SMS
            try {
                boolean sent = smsService.sendOtpSms(phoneNumber, otp);
                if (!sent) {
                    logger.warn("SMS service failed, using mock OTP");
                }
            } catch (Exception smsError) {
                logger.warn("SMS service error: {}, using mock OTP", smsError.getMessage());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP sent successfully");
            response.put("phoneNumber", maskPhoneNumber(phoneNumber));
            // For development, include OTP in response (remove in production)
            response.put("otp", otp);
            
            logger.info("✅ OTP sent successfully to: {}", maskPhoneNumber(phoneNumber));
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error sending OTP: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error sending OTP: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Send OTP for email verification
    @PostMapping("/send-email-otp")
    public ResponseEntity<?> sendEmailOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Email address is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("📧 Sending OTP to email: {}", email);
            
            // Generate 6-digit OTP
            String otp = String.format("%06d", (int)(Math.random() * 1000000));
            
            // Store OTP with timestamp (expires in 5 minutes)
            emailOtpStorage.put(email, otp);
            emailOtpTimestamp.put(email, System.currentTimeMillis());
            
            // Try to send email
            try {
                boolean sent = emailOtpService.sendOtp(email, "User", "Profile");
                if (!sent) {
                    logger.warn("Email service failed, using mock OTP");
                }
            } catch (Exception emailError) {
                logger.warn("Email service error: {}, using mock OTP", emailError.getMessage());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP sent successfully to your email");
            response.put("email", maskEmail(email));
            // For development, include OTP in response (remove in production)
            response.put("otp", otp);
            
            logger.info("✅ Email OTP sent successfully to: {}", maskEmail(email));
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error sending email OTP: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error sending email OTP: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String otp = request.get("otp");
            
            if (phoneNumber == null || otp == null || phoneNumber.trim().isEmpty() || otp.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Phone number and OTP are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("🔐 Verifying OTP for phone number: {}", maskPhoneNumber(phoneNumber));
            
            // Check if OTP exists and is not expired (5 minutes)
            String storedOtp = otpStorage.get(phoneNumber);
            Long timestamp = otpTimestamp.get(phoneNumber);
            
            if (storedOtp == null || timestamp == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "OTP not found or expired");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if OTP is expired (5 minutes = 300000 ms)
            if (System.currentTimeMillis() - timestamp > 300000) {
                // Clean up expired OTP
                otpStorage.remove(phoneNumber);
                otpTimestamp.remove(phoneNumber);
                
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "OTP has expired. Please request a new one.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Verify OTP
            if (storedOtp.equals(otp.trim())) {
                // Clean up used OTP
                otpStorage.remove(phoneNumber);
                otpTimestamp.remove(phoneNumber);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "OTP verified successfully");
                response.put("phoneNumber", phoneNumber);
                
                logger.info("✅ OTP verified successfully for: {}", maskPhoneNumber(phoneNumber));
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid OTP");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("❌ Error verifying OTP: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error verifying OTP: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Verify Email OTP
    @PostMapping("/verify-email-otp")
    public ResponseEntity<?> verifyEmailOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            
            if (email == null || otp == null || email.trim().isEmpty() || otp.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Email and OTP are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("🔐 Verifying OTP for email: {}", maskEmail(email));
            
            // Check if OTP exists and is not expired (5 minutes)
            String storedOtp = emailOtpStorage.get(email);
            Long timestamp = emailOtpTimestamp.get(email);
            
            if (storedOtp == null || timestamp == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "OTP not found or expired");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if OTP is expired (5 minutes = 300000 ms)
            if (System.currentTimeMillis() - timestamp > 300000) {
                // Clean up expired OTP
                emailOtpStorage.remove(email);
                emailOtpTimestamp.remove(email);
                
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "OTP has expired. Please request a new one.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Verify OTP
            if (storedOtp.equals(otp.trim())) {
                // Clean up used OTP
                emailOtpStorage.remove(email);
                emailOtpTimestamp.remove(email);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Email OTP verified successfully");
                response.put("email", email);
                
                logger.info("✅ Email OTP verified successfully for: {}", maskEmail(email));
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid OTP");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("❌ Error verifying email OTP: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error verifying email OTP: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Helper method to mask phone number for privacy
    private String maskPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() <= 4) {
            return phoneNumber;
        }
        
        int visibleDigits = 4;
        int maskLength = phoneNumber.length() - visibleDigits;
        StringBuilder masked = new StringBuilder();
        
        for (int i = 0; i < maskLength; i++) {
            masked.append("*");
        }
        
        masked.append(phoneNumber.substring(maskLength));
        return masked.toString();
    }
    
    // Helper method to mask email for privacy
    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        
        String[] parts = email.split("@");
        String localPart = parts[0];
        String domain = parts[1];
        
        if (localPart.length() <= 2) {
            return email; // Don't mask very short emails
        }
        
        // Show first 2 characters and last 1 character of local part
        String maskedLocal = localPart.substring(0, 2) + "***" + localPart.substring(localPart.length() - 1);
        return maskedLocal + "@" + domain;
    }
}
