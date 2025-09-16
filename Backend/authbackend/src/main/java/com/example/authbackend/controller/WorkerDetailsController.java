package com.example.authbackend.controller;

import com.example.authbackend.model.Worker;
import com.example.authbackend.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "*")
public class WorkerDetailsController {

    private final WorkerService workerService;

    @Autowired
    public WorkerDetailsController(WorkerService workerService) {
        this.workerService = workerService;
    }

    // Get worker details for review page - matches frontend expectation of /api/worker/details/{workerId}
    @GetMapping("/details/{workerId}")
    public ResponseEntity<?> getWorkerDetails(@PathVariable Long workerId) {
        try {
            System.out.println("=== WORKER DETAILS DEBUG ===");
            System.out.println("Fetching details for worker ID: " + workerId);
            
            Optional<Worker> workerOpt = workerService.getWorkerById(workerId);
            System.out.println("Worker found in database: " + workerOpt.isPresent());
            
            if (workerOpt.isPresent()) {
                Worker worker = workerOpt.get();
                System.out.println("Worker details:");
                System.out.println("  - ID: " + worker.getId());
                System.out.println("  - Name: " + worker.getFullName());
                System.out.println("  - Phone: " + worker.getPhone());
                System.out.println("  - Profile Image URL: " + worker.getProfileImageUrl());
                System.out.println("  - Registration Status: " + worker.getRegistrationStatus());
                System.out.println("=== END WORKER DETAILS DEBUG ===");
                return ResponseEntity.ok(worker);
            } else {
                System.err.println("Worker not found with ID: " + workerId);
                System.out.println("=== END WORKER DETAILS DEBUG ===");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("=== WORKER DETAILS ERROR DEBUG ===");
            System.err.println("Error fetching worker details: " + e.getMessage());
            System.err.println("Error type: " + e.getClass().getSimpleName());
            System.err.println("Stack trace:");
            e.printStackTrace();
            System.err.println("=== END WORKER DETAILS ERROR DEBUG ===");
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage() != null ? e.getMessage() : "Unknown error");
            errorResponse.put("errorType", e.getClass().getSimpleName());
            errorResponse.put("details", "Check server logs for full stack trace");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Worker login endpoint - matches frontend expectation of /api/worker/login
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

    // Check if worker exists by phone number (for OTP login verification)
    @GetMapping("/check-phone/{phone}")
    public ResponseEntity<?> checkWorkerByPhone(@PathVariable String phone) {
        try {
            java.util.Optional<Worker> workerOpt = workerService.findWorkerByPhone(phone);
            if (workerOpt.isPresent()) {
                Worker worker = workerOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("workerId", worker.getId());
                response.put("exists", true);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("exists", false);
                response.put("message", "No worker found with this phone number");
                return ResponseEntity.ok(response);
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

    // Verify worker name matches phone number (first name only, case-insensitive)
    @PostMapping("/verify-name")
    public ResponseEntity<?> verifyWorkerName(@RequestBody Map<String, String> request) {
        try {
            String phone = request.get("phone");
            String firstName = request.get("firstName");
            
            if (phone == null || firstName == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("verified", false);
                error.put("error", "Phone and firstName are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            java.util.Optional<Worker> workerOpt = workerService.findWorkerByPhone(phone);
            if (workerOpt.isPresent()) {
                Worker worker = workerOpt.get();
                
                // Extract first name from full name and compare case-insensitively
                String workerFirstName = "";
                if (worker.getFullName() != null && !worker.getFullName().trim().isEmpty()) {
                    workerFirstName = worker.getFullName().trim().split("\\s+")[0]; // Get first word
                }
                
                boolean nameMatches = workerFirstName.equalsIgnoreCase(firstName.trim());
                
                Map<String, Object> response = new HashMap<>();
                response.put("verified", nameMatches);
                if (!nameMatches) {
                    response.put("message", "First name does not match our records");
                }
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("verified", false);
                response.put("message", "Worker not found with this phone number");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
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

    // Test endpoint for direct Backblaze B2 upload
    @PostMapping("/test-upload")
    public ResponseEntity<?> testUpload(@RequestPart("file") org.springframework.web.multipart.MultipartFile file) {
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
