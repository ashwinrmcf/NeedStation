package com.example.authbackend.service;

import com.example.authbackend.config.TwilioConfig;
import com.example.authbackend.dto.WorkerDTO;
import com.example.authbackend.dto.WorkerRegistrationDTO;
import com.example.authbackend.model.Worker;
import com.example.authbackend.repository.WorkerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class WorkerService {

    /**
     * Authenticate a worker by email and phone.
     * @param email The worker's email
     * @param phone The worker's phone
     * @return Optional<Worker> if credentials match, empty otherwise
     */
    public Optional<Worker> authenticateWorker(String email, String phone) {
        if (email == null || phone == null) return Optional.empty();
        return repo.findByEmailIgnoreCaseAndPhone(email.trim(), phone.trim());
    }
    
    /**
     * Delete a worker by ID for registration cleanup
     * @param workerId The worker's ID
     * @return boolean indicating if deletion was successful
     */
    public boolean deleteWorkerById(Long workerId) {
        try {
            if (repo.existsById(workerId)) {
                repo.deleteById(workerId);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete worker: " + e.getMessage(), e);
        }
    }

    private final WorkerRepository repo;
    private final BackblazeB2Service backblazeB2Service;
    private final ObjectMapper objectMapper;
    private final TwilioConfig twilioConfig;
    private final FreeOtpService freeOtpService;
    private final TwoFactorOtpService twoFactorOtpService;
    
    @Value("${use-free-otp:false}")
    private boolean useFreeOtp;
    
    @Value("${sms.default-provider:2factor}")
    private String smsProvider;

    public WorkerService(WorkerRepository repo, BackblazeB2Service backblazeB2Service, ObjectMapper objectMapper, 
                       TwilioConfig twilioConfig, FreeOtpService freeOtpService, 
                       TwoFactorOtpService twoFactorOtpService) {
        this.repo = repo;
        this.backblazeB2Service = backblazeB2Service;
        this.objectMapper = objectMapper;
        this.twilioConfig = twilioConfig;
        this.freeOtpService = freeOtpService;
        this.twoFactorOtpService = twoFactorOtpService;
    }

    // Method to upload image to Backblaze B2 and return the image URL
    public String uploadImage(MultipartFile file) throws IOException {
        return backblazeB2Service.uploadImage(file);
    }

    // Upload multiple files and return a map of file names to URLs
    public Map<String, String> uploadMultipleFiles(Map<String, MultipartFile> files) throws IOException {
        return backblazeB2Service.uploadMultipleFiles(files);
    }

    // Method to save Worker details in the database (Step 1)
    public Worker saveWorker(WorkerDTO dto, String imageUrl) {
        Worker worker = new Worker();
        worker.setFullName(dto.getFullName());
        worker.setGender(dto.getGender());
        worker.setDob(LocalDate.parse(dto.getDob())); // Parses the DOB string into LocalDate
        worker.setPhone(dto.getPhone());
        worker.setEmail(dto.getEmail());
        worker.setWhatsappNumber(dto.getWhatsappNumber());
        worker.setProfileImageUrl(imageUrl); // Saves the profile image URL
        worker.setRegistrationDate(LocalDate.now());
        worker.setRegistrationStatus("INCOMPLETE");
        
        // Initialize OTP fields
        worker.setOtpAttempts(0);
        worker.setPhoneVerified(false);
        
        return repo.save(worker);  // Return the saved worker
    }
    
    // Set this to false to use actual Twilio services
    private static final boolean TRIAL_MODE = false;
    // Fixed test OTP for trial mode - in production, this would come from Twilio
    private static final String TEST_OTP = "123456";
    
    /**
     * Sends an OTP verification to the worker's phone number using Twilio Verify API
     * @param worker The worker to send the OTP to
     * @return true if OTP was sent successfully, false otherwise
     */
    public boolean generateAndSendOtp(Worker worker) {
        String phoneNumber = worker.getPhone();
        
        try {
            // Format phone number if needed
            // E.164 format: +[country code][phone number without leading 0]
            if (!phoneNumber.startsWith("+")) {
                // Assuming India (+91) as default country code
                phoneNumber = "+91" + phoneNumber;
                System.out.println("Formatted phone number to: " + phoneNumber);
            }
            
            // Check if 2Factor API is the default provider
            if ("2factor".equalsIgnoreCase(smsProvider)) {
                System.out.println("Using 2Factor API for phone: " + phoneNumber);
                boolean result = twoFactorOtpService.generateOtp(worker);
                if (result) {
                    // Save the worker
                    worker.setOtpCreatedAt(LocalDateTime.now());
                    worker.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
                    worker.setOtpAttempts(0);
                    repo.save(worker);
                    System.out.println("2Factor API: OTP sent successfully to " + phoneNumber);
                    return true;
                } else {
                    System.out.println("2Factor API failed, trying fallback methods");
                }
            }
            // Use Free OTP API if enabled
            else if (useFreeOtp) {
                System.out.println("Using Free OTP API for phone: " + phoneNumber);
                boolean result = freeOtpService.generateOtp(worker);
                if (result) {
                    // Save the worker
                    repo.save(worker);
                    return true;
                } else {
                    // Fall back to trial mode if free OTP API fails
                    System.out.println("Free OTP API failed, falling back to trial mode");
                    worker.setPhoneVerificationOtp(TEST_OTP);
                    
                    LocalDateTime now = LocalDateTime.now();
                    worker.setOtpCreatedAt(now);
                    worker.setOtpExpiresAt(now.plusMinutes(10));
                    worker.setOtpAttempts(0);
                    repo.save(worker);
                    
                    System.out.println("Fallback mode: OTP " + TEST_OTP + " set for " + phoneNumber);
                    return true;
                }
            } else if (TRIAL_MODE) {
                // In trial mode, we don't actually send an SMS
                // Instead, we generate a fixed OTP and save it
                worker.setPhoneVerificationOtp(TEST_OTP);
                
                // Set OTP expiration time (10 minutes from now)
                LocalDateTime now = LocalDateTime.now();
                worker.setOtpCreatedAt(now);
                worker.setOtpExpiresAt(now.plusMinutes(10));
                
                // Reset OTP attempts
                worker.setOtpAttempts(0);
                
                // Save the worker with the new OTP
                repo.save(worker);
                
                System.out.println("Trial mode: OTP " + TEST_OTP + " set for " + phoneNumber);
                return true;
            } else {
                // In production mode, use Twilio to send an OTP
                System.out.println("Attempting to send OTP via Twilio to: " + phoneNumber);
                System.out.println("Using Verify Service SID: " + twilioConfig.getVerifyServiceSid());
                
                try {
                    Verification verification = Verification.creator(
                        twilioConfig.getVerifyServiceSid(),  // Verify Service SID
                        phoneNumber,                         // To (phone number)
                        "sms")                               // Channel type
                        .create();
                    
                    // Successfully sent OTP
                    System.out.println("Sent OTP to " + phoneNumber + " with status: " + verification.getStatus());
                    
                    // Set OTP expiration time (10 minutes from now)
                    LocalDateTime now = LocalDateTime.now();
                    worker.setOtpCreatedAt(now);
                    worker.setOtpExpiresAt(now.plusMinutes(10));
                    
                    // Reset OTP attempts
                    worker.setOtpAttempts(0);
                    
                    // Save the worker
                    repo.save(worker);
                    
                    return true;
                } catch (Exception e) {
                    System.err.println("Twilio API Error: " + e.getMessage());
                    e.printStackTrace();
                    
                    // Try using Free OTP API as fallback if enabled
                    if (useFreeOtp) {
                        System.out.println("Falling back to Free OTP API due to Twilio error");
                        boolean result = freeOtpService.generateOtp(worker);
                        if (result) {
                            // Save the worker
                            repo.save(worker);
                            return true;
                        }
                    }
                    
                    // Try using trial mode as last resort fallback
                    System.out.println("Falling back to trial mode due to errors");
                    worker.setPhoneVerificationOtp(TEST_OTP);
                    
                    LocalDateTime now = LocalDateTime.now();
                    worker.setOtpCreatedAt(now);
                    worker.setOtpExpiresAt(now.plusMinutes(10));
                    worker.setOtpAttempts(0);
                    repo.save(worker);
                    
                    System.out.println("Fallback mode: OTP " + TEST_OTP + " set for " + phoneNumber);
                    return true;
                }
            }
        } catch (Exception e) {
            System.err.println("Error sending OTP: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
        
        return false; // Default return if no method succeeds
    }
    
    /**
     * Verifies an OTP for a worker using Twilio Verify API
     * @param workerId The worker ID
     * @param otp The OTP to verify
     * @return true if verification successful, false otherwise
     */
    public boolean verifyOtp(Long workerId, String otp) {
        Optional<Worker> workerOpt = repo.findById(workerId);
        if (workerOpt.isEmpty()) {
            return false;
        }
        
        Worker worker = workerOpt.get();
        
        // Check if worker already verified
        Boolean verified = worker.getPhoneVerified();
        if (verified != null && verified) {
            return true;
        }
        
        // Check if max attempts reached (5 attempts)
        if (worker.getOtpAttempts() >= 5) {
            return false;
        }
        
        try {
            // Check if 2Factor API is the default provider
            if ("2factor".equalsIgnoreCase(smsProvider)) {
                System.out.println("Using 2Factor API for verification");
                // Check if OTP is expired
                if (worker.getOtpExpiresAt() != null && LocalDateTime.now().isAfter(worker.getOtpExpiresAt())) {
                    System.out.println("OTP expired");
                    worker.setOtpAttempts(worker.getOtpAttempts() + 1);
                    repo.save(worker);
                    return false;
                }
                
                boolean verified_otp = twoFactorOtpService.verifyOtp(worker, otp);
                if (verified_otp) {
                    worker.setPhoneVerified(true);
                    worker.setOtpAttempts(0);
                    repo.save(worker);
                    System.out.println("2Factor API: OTP verified successfully");
                    return true;
                } else {
                    // Increment failed attempts
                    worker.setOtpAttempts(worker.getOtpAttempts() + 1);
                    repo.save(worker);
                    System.out.println("2Factor API: Invalid OTP - Please check if you entered the correct code");
                    return false;
                }
            }
            // Use Free OTP API if enabled
            else if (useFreeOtp) {
                System.out.println("Using Free OTP API for verification");
                // Check if OTP is expired
                if (worker.getOtpExpiresAt() != null && LocalDateTime.now().isAfter(worker.getOtpExpiresAt())) {
                    System.out.println("OTP expired");
                    worker.setOtpAttempts(worker.getOtpAttempts() + 1);
                    repo.save(worker);
                    return false;
                }
                
                boolean verified_otp = freeOtpService.verifyOtp(worker, otp);
                if (verified_otp) {
                    worker.setPhoneVerified(true);
                    worker.setOtpAttempts(0);
                    repo.save(worker);
                    System.out.println("Free OTP API: OTP verified successfully");
                    return true;
                } else {
                    // Increment failed attempts
                    worker.setOtpAttempts(worker.getOtpAttempts() + 1);
                    repo.save(worker);
                    System.out.println("Free OTP API: Invalid OTP");
                    return false;
                }
            } else if (TRIAL_MODE) {
                // In trial mode, we check against the stored test OTP
                // Check if OTP is expired in trial mode
                if (worker.getOtpExpiresAt() != null && LocalDateTime.now().isAfter(worker.getOtpExpiresAt())) {
                    System.out.println("OTP expired in trial mode");
                    worker.setOtpAttempts(worker.getOtpAttempts() + 1);
                    repo.save(worker);
                    return false;
                }
                
                // Check if the OTP matches the test OTP
                if (TEST_OTP.equals(otp) || (worker.getPhoneVerificationOtp() != null && worker.getPhoneVerificationOtp().equals(otp))) {
                    // OTP is correct
                    worker.setPhoneVerified(true); // Explicitly set to true
                    worker.setOtpAttempts(0);      // Reset attempts counter
                    repo.save(worker);
                    System.out.println("Trial mode: OTP verified successfully");
                    return true;
                } else {
                    // Increment failed attempts
                    worker.setOtpAttempts(worker.getOtpAttempts() + 1);
                    repo.save(worker);
                    System.out.println("Trial mode: Invalid OTP");
                    return false;
                }
            } else {
                // Production mode - use actual Twilio Verify API
                String phoneNumber = formatPhoneNumber(worker.getPhone());
                
                try {
                    // Verify the code with Twilio Verify API
                    VerificationCheck verificationCheck = VerificationCheck.creator(
                            twilioConfig.getVerifyServiceSid())  // Verify Service SID
                            .setTo(phoneNumber)                  // Phone number
                            .setCode(otp)                        // Code entered by user
                            .create();
                    
                    System.out.println("Verification check SID: " + verificationCheck.getSid());
                    System.out.println("Status: " + verificationCheck.getStatus());
                    
                    if ("approved".equals(verificationCheck.getStatus())) {
                        // OTP is correct
                        worker.setPhoneVerified(true);
                        repo.save(worker);
                        return true;
                    } else {
                        // Increment failed attempts
                        worker.setOtpAttempts(worker.getOtpAttempts() + 1);
                        repo.save(worker);
                        return false;
                    }
                } catch (Exception e) {
                    System.err.println("Twilio verification error: " + e.getMessage());
                    // Increment failed attempts
                    worker.setOtpAttempts(worker.getOtpAttempts() + 1);
                    repo.save(worker);
                    return false;
                }
            }
        } catch (Exception e) {
            System.err.println("Error during OTP verification: " + e.getMessage());
            e.printStackTrace();
            worker.setOtpAttempts(worker.getOtpAttempts() + 1);
            repo.save(worker);
            return false;
        }
    }
    
    /**
     * Formats a phone number to the E.164 international format
     * @param phoneNumber The phone number to format
     * @return The formatted phone number
     */
    private String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null) {
            return null;
        }
        
        // Clean the phone number, removing spaces, dashes, etc.
        String cleaned = phoneNumber.replaceAll("[\\s\\-()]", "");
        
        // If it doesn't start with +, assume it's an Indian number and add +91
        if (!cleaned.startsWith("+")) {
            // If it starts with a 0, remove it (common for local format)
            if (cleaned.startsWith("0")) {
                cleaned = cleaned.substring(1);
            }
            
            // Add country code
            cleaned = "+91" + cleaned;
        }
        
        return cleaned;
    }
    
    // Get worker by ID
    public Optional<Worker> getWorkerById(Long id) {
        return repo.findById(id);
    }

    // Find worker by phone number
    public Optional<Worker> findWorkerByPhone(String phone) {
        try {
            if (phone == null || phone.trim().isEmpty()) {
                System.out.println("Attempt to find worker with null/empty phone number");
                return Optional.empty();
            }
            
            // Format the phone number if needed
            String formattedPhone = phone.trim();
            
            // Try to find the worker
            Optional<Worker> worker = repo.findByPhone(formattedPhone);
            if (worker.isPresent()) {
                return worker;
            }
            
            // If not found, try without formatting
            return repo.findByPhone(phone);
        } catch (Exception e) {
            System.err.println("Error finding worker by phone: " + e.getMessage());
            return Optional.empty();
        }
    }
    
    // Step 1: Update basic information
    public Worker updateBasicInfo(Long workerId, WorkerRegistrationDTO dto, MultipartFile profilePicture) throws IOException {
        Worker worker = getOrCreateWorker(workerId);
        
        // Update fields
        if (dto.getFullName() != null) {
            worker.setFullName(dto.getFullName());
        }
        
        if (dto.getGender() != null) {
            worker.setGender(dto.getGender());
        }
        
        if (dto.getDob() != null) {
            worker.setDob(LocalDate.parse(dto.getDob()));
        }
        
        if (dto.getPhone() != null) {
            worker.setPhone(dto.getPhone());
        }
        
        if (dto.getEmail() != null) {
            worker.setEmail(dto.getEmail());
        }
        
        if (dto.getWhatsappNumber() != null) {
            worker.setWhatsappNumber(dto.getWhatsappNumber());
        }
        
        // Handle profile picture upload
        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                System.out.println("=== PROFILE PICTURE UPLOAD DEBUG ===");
                System.out.println("Worker ID: " + workerId);
                System.out.println("Worker Name: " + worker.getFullName());
                System.out.println("File size: " + profilePicture.getSize());
                System.out.println("File type: " + profilePicture.getContentType());
                System.out.println("Original filename: " + profilePicture.getOriginalFilename());
                
                String imageUrl = backblazeB2Service.uploadImage(profilePicture, worker.getFullName(), worker.getId());
                System.out.println("Backblaze upload result: " + imageUrl);
                
                if (imageUrl != null && !imageUrl.isEmpty()) {
                    worker.setProfileImageUrl(imageUrl);
                    System.out.println("SUCCESS: Profile image URL set in worker entity: " + imageUrl);
                    
                    // Force save immediately to verify database update
                    Worker savedWorker = repo.save(worker);
                    System.out.println("VERIFICATION: Profile URL in saved worker: " + savedWorker.getProfileImageUrl());
                } else {
                    System.err.println("ERROR: Backblaze upload returned null or empty URL");
                    System.err.println("This means the upload to Backblaze B2 failed");
                }
            } catch (Exception e) {
                System.err.println("EXCEPTION during profile picture upload:");
                System.err.println("Error message: " + e.getMessage());
                System.err.println("Error class: " + e.getClass().getSimpleName());
                e.printStackTrace();
                // Continue without updating the profile picture
            }
        } else {
            System.out.println("WARNING: No profile picture provided in request");
            System.out.println("profilePicture is null: " + (profilePicture == null));
            if (profilePicture != null) {
                System.out.println("profilePicture is empty: " + profilePicture.isEmpty());
            }
        }
        
        // Update status
        worker.setRegistrationStatus("STEP_1_COMPLETED");
        
        // Save worker and log the result
        worker = repo.save(worker);
        System.out.println("Worker saved to database. ID: " + worker.getId());
        System.out.println("Profile image URL in saved worker: " + worker.getProfileImageUrl());
        
        // Attempt to send OTP
        if (!worker.getPhoneVerified()) {
            generateAndSendOtp(worker);
        }
        
        return worker;
    }
    
    // Step 2: Update contact information
    public Worker updateContactInfo(Long workerId, WorkerRegistrationDTO dto) {
        Worker worker = getWorkerOrThrow(workerId);
        
        worker.setPermanentAddress(dto.getPermanentAddress());
        worker.setCurrentAddress(dto.getCurrentAddress());
        worker.setCity(dto.getCity());
        // worker.setState(dto.getState()); // State field not implemented
        worker.setPincode(dto.getPincode());
        worker.setServiceAreas(dto.getServiceAreas());
        worker.setOpenToTravel(dto.getOpenToTravel());
        // worker.setLocality(dto.getLocality()); // Locality field not implemented
        worker.setRegistrationStatus("STEP_2_COMPLETED");
        
        return repo.save(worker);
    }
    
    // Step 3: Update professional details
    public Worker updateProfessionalDetails(Long workerId, WorkerRegistrationDTO dto) {
        Worker worker = getWorkerOrThrow(workerId);
        
        worker.setServices(dto.getServices());
        worker.setExperience(dto.getExperience());
        // worker.setEducation(dto.getEducation()); // Education field not implemented
        worker.setWorkType(dto.getWorkType());
        worker.setAvailability(dto.getAvailability());
        worker.setLanguages(dto.getLanguages());
        worker.setRegistrationStatus("STEP_3_COMPLETED");
        
        return repo.save(worker);
    }
    
    // Step 4: Update verification details
    public Worker updateVerificationDetails(Long workerId, WorkerRegistrationDTO dto, 
                                          MultipartFile idProof, MultipartFile selfieWithId,
                                          MultipartFile[] certificates) throws IOException {
        Worker worker = getWorkerOrThrow(workerId);
        
        worker.setAadharNumber(dto.getAadharNumber());
        worker.setPoliceVerificationStatus(dto.getPoliceVerificationStatus());
        
        // Upload ID proof if provided
        if (idProof != null && !idProof.isEmpty()) {
            System.out.println("Uploading ID proof for worker ID: " + workerId);
            String idProofUrl = backblazeB2Service.uploadImage(idProof, worker.getFullName(), worker.getId());
            System.out.println("ID proof uploaded. URL: " + idProofUrl);
            if (idProofUrl != null && !idProofUrl.isEmpty()) {
                worker.setIdProofUrl(idProofUrl);
                System.out.println("ID proof URL set in worker entity: " + idProofUrl);
            } else {
                System.err.println("ID proof upload returned null or empty URL");
            }
        }
        
        // Upload selfie with ID if provided
        if (selfieWithId != null && !selfieWithId.isEmpty()) {
            System.out.println("Uploading selfie with ID for worker ID: " + workerId);
            String selfieUrl = backblazeB2Service.uploadImage(selfieWithId, worker.getFullName(), worker.getId());
            System.out.println("Selfie uploaded. URL: " + selfieUrl);
            if (selfieUrl != null && !selfieUrl.isEmpty()) {
                worker.setSelfieWithIdUrl(selfieUrl);
                System.out.println("Selfie URL set in worker entity: " + selfieUrl);
            } else {
                System.err.println("Selfie upload returned null or empty URL");
            }
        }
        
        // Upload certificates if provided
        if (certificates != null && certificates.length > 0) {
            System.out.println("Uploading " + certificates.length + " certificates for worker ID: " + workerId);
            Map<String, String> certificateUrls = new HashMap<>();
            for (int i = 0; i < certificates.length; i++) {
                if (certificates[i] != null && !certificates[i].isEmpty()) {
                    System.out.println("Uploading certificate " + (i+1));
                    String certUrl = backblazeB2Service.uploadImage(certificates[i], worker.getFullName(), worker.getId());
                    System.out.println("Certificate " + (i+1) + " uploaded. URL: " + certUrl);
                    if (certUrl != null && !certUrl.isEmpty()) {
                        certificateUrls.put("certificate_" + (i+1), certUrl);
                    } else {
                        System.err.println("Certificate " + (i+1) + " upload returned null or empty URL");
                    }
                }
            }
            if (!certificateUrls.isEmpty()) {
                String certificateJson = objectMapper.writeValueAsString(certificateUrls);
                worker.setCertificateUrls(certificateJson);
                System.out.println("Certificate URLs JSON set: " + certificateJson);
            }
        }
        
        // Save worker and log verification details
        Worker savedWorker = repo.save(worker);
        System.out.println("Worker verification details saved. ID: " + savedWorker.getId());
        System.out.println("ID proof URL in saved worker: " + savedWorker.getIdProofUrl());
        System.out.println("Selfie URL in saved worker: " + savedWorker.getSelfieWithIdUrl());
        System.out.println("Certificate URLs in saved worker: " + savedWorker.getCertificateUrls());
        
        return savedWorker;
    }
    
    // Step 5: Update payment information
    public Worker updatePaymentInfo(Long workerId, WorkerRegistrationDTO dto) {
        Worker worker = getWorkerOrThrow(workerId);
        
        worker.setPaymentMode(dto.getPaymentMode());
        worker.setUpiId(dto.getUpiId());
        worker.setBankName(dto.getBankName());
        worker.setAccountNumber(dto.getAccountNumber());
        worker.setIfscCode(dto.getIfscCode());
        worker.setPanCard(dto.getPanCard());
        worker.setEmergencyContactName(dto.getEmergencyContactName());
        worker.setEmergencyContactNumber(dto.getEmergencyContactNumber());
        
        // Update status to pending verification
        worker.setRegistrationStatus("PENDING_VERIFICATION");
        
        return repo.save(worker);
    }
    
    // Finalize worker registration
    public Worker finalizeRegistration(Long workerId) {
        Worker worker = getWorkerOrThrow(workerId);
        worker.setRegistrationStatus("VERIFIED"); // Or any other final status
        return repo.save(worker);
    }
    
    // Helper methods
    private Worker getOrCreateWorker(Long workerId) {
        Worker worker;
        if (workerId != null) {
            worker = repo.findById(workerId).orElse(null);
            if (worker != null) {
                return worker;
            }
        }
        
        // Create a new worker with default values
        worker = new Worker();
        worker.setRegistrationDate(LocalDate.now());
        worker.setRegistrationStatus("INCOMPLETE");
        
        // Explicitly set all not-null fields to prevent database constraint violations
        worker.setOpenToTravel(false);
        worker.setFullName("");
        worker.setGender("");
        worker.setPhone("");
        worker.setDob(LocalDate.now());
        
        // Initialize phone verification to false for new workers
        worker.setPhoneVerified(false);
        worker.setOtpAttempts(0);
        
        // Log that we're creating a new worker
        System.out.println("Creating new worker record");
        
        return worker;
    }
    
    private Worker getWorkerOrThrow(Long workerId) {
        if (workerId == null) {
            throw new IllegalArgumentException("Worker ID cannot be null");
        }
        return repo.findById(workerId)
            .orElseThrow(() -> new RuntimeException("Worker not found with ID: " + workerId));
    }
}
