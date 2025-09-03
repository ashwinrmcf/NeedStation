package com.example.authbackend.controller;


import com.example.authbackend.dto.WorkerDTO;
import com.example.authbackend.dto.WorkerRegistrationDTO;
import com.example.authbackend.model.Worker;
import com.example.authbackend.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "*") // Allow all origins explicitly here
public class WorkerController {

    // Worker login endpoint - updated to support OTP verification
    @PostMapping("/login")
    public ResponseEntity<?> loginWorker(@RequestBody com.example.authbackend.dto.WorkerLoginDTO loginDTO) {
        try {
            // If verified flag is true, we can skip email check and authenticate by workerId
            if (loginDTO.isVerified() && loginDTO.getWorkerId() != null) {
                Optional<Worker> workerOpt = workerService.getWorkerById(loginDTO.getWorkerId());
                if (workerOpt.isPresent() && workerOpt.get().getPhone().equals(loginDTO.getPhone())) {
                    Worker worker = workerOpt.get();
                    Map<String, Object> response = new HashMap<>();
                    response.put("workerId", worker.getId());
                    response.put("fullName", worker.getFullName());
                    response.put("email", worker.getEmail());
                    response.put("phone", worker.getPhone());
                    response.put("message", "Login successful");
                    return ResponseEntity.ok(response);
                }
            }
            
            // Fall back to regular email/phone authentication if OTP verification not used
            java.util.Optional<Worker> workerOpt = workerService.authenticateWorker(loginDTO.getEmail(), loginDTO.getPhone());
            if (workerOpt.isPresent()) {
                Worker worker = workerOpt.get();
                // You can customize the returned fields as needed
                Map<String, Object> response = new HashMap<>();
                response.put("workerId", worker.getId());
                response.put("fullName", worker.getFullName());
                response.put("email", worker.getEmail());
                response.put("phone", worker.getPhone());
                response.put("message", "Login successful");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // Find worker by phone number (for OTP login verification)
    @GetMapping("/findByPhone/{phone}")
    public ResponseEntity<?> findWorkerByPhone(@PathVariable String phone) {
        try {
            java.util.Optional<Worker> workerOpt = workerService.findWorkerByPhone(phone);
            if (workerOpt.isPresent()) {
                Worker worker = workerOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("workerId", worker.getId());
                response.put("found", true);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("found", false);
                error.put("message", "No worker found with this phone number");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private final WorkerService workerService;

    @Autowired
    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    // Delete worker data endpoint for registration cleanup
    @DeleteMapping("/delete/{workerId}")
    public ResponseEntity<?> deleteWorkerData(@PathVariable Long workerId) {
        try {
            boolean deleted = workerService.deleteWorkerById(workerId);
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Worker data deleted successfully");
                response.put("workerId", workerId);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete worker data");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Step 1: Basic Information
    @PostMapping(value = "/register/step1", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerStep1(
            @RequestParam(value = "workerId", required = false) Long workerId,
            @RequestPart(value = "data", required = true) String data,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            // Parse the JSON string directly
            WorkerRegistrationDTO dto = objectMapper.readValue(data, WorkerRegistrationDTO.class);
            System.out.println("=== STEP 1 CONTROLLER DEBUG ===");
            System.out.println("Received Step 1 registration request - Worker ID: " + workerId);
            System.out.println("DTO Data: fullName=" + dto.getFullName() + ", phone=" + dto.getPhone());
            System.out.println("Profile Picture received: " + (profilePicture != null));
            if (profilePicture != null) {
                System.out.println("Profile Picture details:");
                System.out.println("  - Size: " + profilePicture.getSize() + " bytes");
                System.out.println("  - Original filename: " + profilePicture.getOriginalFilename());
                System.out.println("  - Content type: " + profilePicture.getContentType());
                System.out.println("  - Is empty: " + profilePicture.isEmpty());
            } else {
                System.out.println("Profile Picture is NULL - not received by controller");
            }
            Worker worker = workerService.updateBasicInfo(workerId, dto, profilePicture);
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("message", "Basic information saved successfully");
            System.out.println("Successfully saved worker basic info. Worker ID: " + worker.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in registerStep1: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Step 2: Contact Information
    @PostMapping("/register/step2")
    public ResponseEntity<?> registerStep2(
            @RequestParam("workerId") Long workerId,
            @RequestBody WorkerRegistrationDTO dto) {
        try {
            System.out.println("Received Step 2 registration request - Worker ID: " + workerId);
            System.out.println("Contact info: city=" + dto.getCity() + ", serviceAreas=" + dto.getServiceAreas());
            
            Worker worker = workerService.updateContactInfo(workerId, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("message", "Contact information saved successfully");
            
            System.out.println("Successfully saved worker contact info. Worker ID: " + worker.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in registerStep2: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Step 3: Professional Details
    @PostMapping("/register/step3")
    public ResponseEntity<?> registerStep3(
            @RequestParam("workerId") Long workerId,
            @RequestBody WorkerRegistrationDTO dto) {
        try {
            System.out.println("Received Step 3 registration request - Worker ID: " + workerId);
            System.out.println("Professional details: services=" + dto.getServices() + ", experience=" + dto.getExperience());
            
            Worker worker = workerService.updateProfessionalDetails(workerId, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("message", "Professional details saved successfully");
            
            System.out.println("Successfully saved worker professional details. Worker ID: " + worker.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in registerStep3: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Step 4: Verification
    @PostMapping(value = "/register/step4", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerStep4(
            @RequestParam("workerId") Long workerId,
            @RequestPart("data") WorkerRegistrationDTO dto,
            @RequestPart(value = "idProof", required = false) MultipartFile idProof,
            @RequestPart(value = "selfieWithId", required = false) MultipartFile selfieWithId,
            @RequestPart(value = "certificates", required = false) MultipartFile[] certificates) {
        try {
            System.out.println("Received Step 4 registration request - Worker ID: " + workerId);
            System.out.println("Verification details: aadharNumber=" + dto.getAadharNumber());
            System.out.println("ID Proof provided: " + (idProof != null && !idProof.isEmpty()));
            System.out.println("Selfie provided: " + (selfieWithId != null && !selfieWithId.isEmpty()));
            
            Worker worker = workerService.updateVerificationDetails(workerId, dto, idProof, selfieWithId, certificates);
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("message", "Verification details saved successfully");
            
            System.out.println("Successfully saved worker verification details. Worker ID: " + worker.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in registerStep4: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Step 5: Payment Information
    @PostMapping("/register/step5")
    public ResponseEntity<?> registerStep5(
            @RequestParam("workerId") Long workerId,
            @RequestBody WorkerRegistrationDTO dto) {
        try {
            System.out.println("Received Step 5 registration request - Worker ID: " + workerId);
            System.out.println("Payment info: paymentMode=" + dto.getPaymentMode() + ", upiId=" + dto.getUpiId());
            
            Worker worker = workerService.updatePaymentInfo(workerId, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("message", "Payment information saved successfully");
            response.put("status", worker.getRegistrationStatus());
            
            System.out.println("Successfully saved worker payment info. Worker ID: " + worker.getId() + ", Status: " + worker.getRegistrationStatus());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in registerStep5: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Get all worker information for review page
    @GetMapping("/details/{workerId}")
    public ResponseEntity<?> getWorkerDetails(@PathVariable Long workerId) {
        try {
            System.out.println("Fetching details for worker ID: " + workerId);
            return workerService.getWorkerById(workerId)
                    .map(worker -> {
                        System.out.println("Worker found: " + worker.getFullName() + ", Profile image: " + worker.getProfileImageUrl());
                        return ResponseEntity.ok(worker);
                    })
                    .orElseGet(() -> {
                        System.err.println("Worker not found with ID: " + workerId);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            System.err.println("Error fetching worker details: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Final submission
    @PostMapping("/register/submit")
    public ResponseEntity<?> finalizeRegistration(@RequestParam("workerId") Long workerId) {
        try {
            System.out.println("Finalizing registration for worker ID: " + workerId);
            Worker worker = workerService.finalizeRegistration(workerId);
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("message", "Worker registration completed successfully");
            response.put("status", worker.getRegistrationStatus());
            
            System.out.println("Registration finalized successfully. Worker ID: " + worker.getId() + ", Status: " + worker.getRegistrationStatus());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error finalizing registration: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerWorker(
            @RequestPart("worker") WorkerDTO workerDTO,
            @RequestPart("file") MultipartFile file) {
        try {
            String imageUrl = workerService.uploadImage(file); // Call service method to upload image
            workerService.saveWorker(workerDTO, imageUrl);     // Save worker info in the database
            return ResponseEntity.ok("Worker registered successfully!");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    // Test endpoint for direct Backblaze B2 upload
    @PostMapping("/test-upload")
    public ResponseEntity<?> testUpload(@RequestPart("file") MultipartFile file) {
        try {
            System.out.println("Test upload endpoint called with file: " + file.getOriginalFilename());
            String imageUrl = workerService.uploadImage(file);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imageUrl", imageUrl);
            response.put("message", "File uploaded successfully to Backblaze B2");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Test upload failed: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}



