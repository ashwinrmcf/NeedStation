package com.example.authbackend.controller;

import com.example.authbackend.dto.WorkerDTO;
import com.example.authbackend.model.Worker;
import com.example.authbackend.service.FreeOtpService;
import com.example.authbackend.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controller for Worker OTP verification and registration using Free OTP API
 */
@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
public class WorkerOtpController {

    private final WorkerService workerService;
    private final FreeOtpService freeOtpService;

    @Autowired
    public WorkerOtpController(WorkerService workerService, FreeOtpService freeOtpService) {
        this.workerService = workerService;
        this.freeOtpService = freeOtpService;
    }

    /**
     * Register a new worker (Step 1) with OTP verification
     * JSON-only endpoint for login/OTP flow
     */
    @PostMapping(value = "/register/step1", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerWorker(@RequestBody WorkerDTO workerDTO) {
        try {
            System.out.println("Received worker registration request: " + workerDTO.getFullName() + ", " + workerDTO.getPhone());
            
            // Check if a worker with this phone already exists
            Optional<Worker> existingWorker = workerService.findWorkerByPhone(workerDTO.getPhone());
            if (existingWorker.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "A worker with this phone number already exists");
                response.put("workerId", existingWorker.get().getId());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            
            // Save worker (this will also generate and send OTP)
            Worker worker = workerService.saveWorker(workerDTO, null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("message", "Worker registration initiated. Verify with OTP.");
            response.put("requiresOtp", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in worker registration: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Verify OTP for worker registration or login
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, Object> request) {
        try {
            // Extract parameters
            Long workerId = Long.valueOf(request.get("workerId").toString());
            String otp = request.get("otp").toString();
            
            System.out.println("Verifying OTP for worker: " + workerId);
            
            // Verify OTP
            boolean verified = workerService.verifyOtp(workerId, otp);
            
            if (verified) {
                // Get worker details
                Optional<Worker> workerOpt = workerService.getWorkerById(workerId);
                if (workerOpt.isEmpty()) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Worker not found");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
                }
                
                Worker worker = workerOpt.get();
                
                Map<String, Object> response = new HashMap<>();
                response.put("workerId", worker.getId());
                response.put("verified", true);
                response.put("message", "OTP verified successfully");
                response.put("phoneVerified", worker.getPhoneVerified());
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("verified", false);
                response.put("message", "Invalid OTP or OTP expired");
                
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            System.err.println("Error in OTP verification: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Resend OTP to a worker's phone
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, Object> request) {
        try {
            Long workerId = Long.valueOf(request.get("workerId").toString());
            
            Optional<Worker> workerOpt = workerService.getWorkerById(workerId);
            if (workerOpt.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Worker not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            Worker worker = workerOpt.get();
            
            // Generate and send new OTP
            boolean sent = workerService.generateAndSendOtp(worker);
            
            Map<String, Object> response = new HashMap<>();
            response.put("workerId", worker.getId());
            response.put("phone", worker.getPhone());
            response.put("sent", sent);
            response.put("message", sent ? "OTP sent successfully" : "Failed to send OTP");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in resending OTP: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
