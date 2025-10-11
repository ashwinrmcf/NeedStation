package com.example.authbackend.controller;


import com.example.authbackend.dto.WorkerDTO;
import com.example.authbackend.dto.WorkerRegistrationDTO;
import com.example.authbackend.model.Worker;
import com.example.authbackend.service.WorkerService;
import com.fasterxml.jackson.databind.ObjectMapper;
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
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*") // Allow all origins explicitly here
public class WorkerController {


    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private final WorkerService workerService;

    @Autowired
    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
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
            
            // Generate and send OTP after successful registration
            boolean otpSent = workerService.generateAndSendOtp(worker);
            
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("message", "Basic information saved successfully. OTP sent to phone.");
            response.put("requiresOtp", true);
            response.put("otpSent", otpSent);
            System.out.println("Successfully saved worker basic info. Worker ID: " + worker.getId() + ", OTP sent: " + otpSent);
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

    // Step 1: Basic Information (JSON only - for frontend compatibility)
    @PostMapping(value = "/register/step1-json", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerStep1Json(@RequestBody WorkerRegistrationDTO dto) {
        try {
            System.out.println("=== JSON REGISTRATION DEBUG ===");
            System.out.println("Registration data: " + dto.toString());
            
            Worker worker = workerService.updateBasicInfo(null, dto, null);
            boolean otpSent = workerService.generateAndSendOtp(worker);
            
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("message", "Basic information saved successfully. OTP sent to phone.");
            response.put("requiresOtp", true);
            response.put("otpSent", otpSent);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("JSON Registration error: " + e.getMessage());
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
            @RequestParam(value = "workerId", required = false) String workerIdParam,
            @RequestBody WorkerRegistrationDTO dto) {
        try {
            // Handle null or "null" string workerId
            Long workerId = null;
            if (workerIdParam != null && !workerIdParam.equals("null") && !workerIdParam.trim().isEmpty()) {
                try {
                    workerId = Long.parseLong(workerIdParam);
                } catch (NumberFormatException e) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Invalid worker ID format: " + workerIdParam);
                    errorResponse.put("errorType", "InvalidWorkerIdException");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }
            
            if (workerId == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Worker ID is required for this step. Please restart registration from Step 1.");
                errorResponse.put("errorType", "MissingWorkerIdException");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
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
            @RequestParam(value = "workerId", required = false) String workerIdParam,
            @RequestBody WorkerRegistrationDTO dto) {
        try {
            // Handle null or "null" string workerId
            Long workerId = null;
            if (workerIdParam != null && !workerIdParam.equals("null") && !workerIdParam.trim().isEmpty()) {
                try {
                    workerId = Long.parseLong(workerIdParam);
                } catch (NumberFormatException e) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Invalid worker ID format: " + workerIdParam);
                    errorResponse.put("errorType", "InvalidWorkerIdException");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }
            
            if (workerId == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Worker ID is required for this step. Please restart registration from Step 1.");
                errorResponse.put("errorType", "MissingWorkerIdException");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
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
            @RequestParam(value = "workerId", required = false) String workerIdParam,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "idProof", required = false) MultipartFile idProof,
            @RequestPart(value = "selfieWithId", required = false) MultipartFile selfieWithId,
            @RequestPart(value = "certificates", required = false) MultipartFile[] certificates) {
        try {
            // Handle null or "null" string workerId
            Long workerId = null;
            if (workerIdParam != null && !workerIdParam.equals("null") && !workerIdParam.trim().isEmpty()) {
                try {
                    workerId = Long.parseLong(workerIdParam);
                } catch (NumberFormatException e) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Invalid worker ID format: " + workerIdParam);
                    errorResponse.put("errorType", "InvalidWorkerIdException");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }
            
            if (workerId == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Worker ID is required for this step. Please restart registration from Step 1.");
                errorResponse.put("errorType", "MissingWorkerIdException");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            System.out.println("Received Step 4 registration request - Worker ID: " + workerId);
            System.out.println("Raw JSON data: " + dataJson);
            
            // Parse JSON data to DTO
            ObjectMapper objectMapper = new ObjectMapper();
            WorkerRegistrationDTO dto = objectMapper.readValue(dataJson, WorkerRegistrationDTO.class);
            
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
            System.err.println("=== STEP 4 ERROR DEBUG ===");
            System.err.println("Error in registerStep4: " + e.getMessage());
            System.err.println("Error type: " + e.getClass().getSimpleName());
            System.err.println("Stack trace:");
            e.printStackTrace();
            System.err.println("Worker ID param: " + workerIdParam);
            System.err.println("Raw JSON data: " + dataJson);
            System.err.println("ID Proof provided: " + (idProof != null && !idProof.isEmpty()));
            System.err.println("Selfie provided: " + (selfieWithId != null && !selfieWithId.isEmpty()));
            System.err.println("Certificates count: " + (certificates != null ? certificates.length : 0));
            System.err.println("=== END STEP 4 ERROR DEBUG ===");
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage() != null ? e.getMessage() : "Unknown error");
            errorResponse.put("errorType", e.getClass().getSimpleName());
            errorResponse.put("details", "Check server logs for full stack trace");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Step 5: Payment Information
    @PostMapping("/register/step5")
    public ResponseEntity<?> registerStep5(
            @RequestParam(value = "workerId", required = false) String workerIdParam,
            @RequestBody WorkerRegistrationDTO dto) {
        try {
            // Handle null or "null" string workerId
            Long workerId = null;
            if (workerIdParam != null && !workerIdParam.equals("null") && !workerIdParam.trim().isEmpty()) {
                try {
                    workerId = Long.parseLong(workerIdParam);
                } catch (NumberFormatException e) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Invalid worker ID format: " + workerIdParam);
                    errorResponse.put("errorType", "InvalidWorkerIdException");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }
            
            if (workerId == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Worker ID is required for this step. Please restart registration from Step 1.");
                errorResponse.put("errorType", "MissingWorkerIdException");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
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

}



