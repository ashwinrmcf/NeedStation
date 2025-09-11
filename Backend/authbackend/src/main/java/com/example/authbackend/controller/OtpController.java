package com.example.authbackend.controller;

import com.example.authbackend.model.Worker;
import com.example.authbackend.service.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/worker/otp")
public class OtpController {
    
    private final WorkerService workerService;
    
    public OtpController(WorkerService workerService) {
        this.workerService = workerService;
    }
    
    /**
     * Generate and send a new OTP for a worker
     * @param workerId The worker ID
     * @return Response containing success status and message
     */
    @PostMapping("/generate/{workerId}")
    public ResponseEntity<Map<String, Object>> generateOtp(@PathVariable Long workerId) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Worker> workerOpt = workerService.getWorkerById(workerId);
        if (workerOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Worker not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        Worker worker = workerOpt.get();
        boolean sent = workerService.generateAndSendOtp(worker);
        
        if (sent) {
            response.put("success", true);
            response.put("message", "OTP sent successfully");
            response.put("phoneNumber", maskPhoneNumber(worker.getPhone()));
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Failed to send OTP");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/verify/{workerId}")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @PathVariable Long workerId,
            @RequestBody Map<String, String> requestBody) {
        
        Map<String, Object> response = new HashMap<>();
        String otp = requestBody.get("otp");
        
        if (otp == null || otp.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "OTP is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean verified = workerService.verifyOtp(workerId, otp);
        
        if (verified) {
            response.put("success", true);
            response.put("message", "Phone verified successfully");
            return ResponseEntity.ok(response);
        } else {
            Optional<Worker> workerOpt = workerService.getWorkerById(workerId);
            if (workerOpt.isPresent()) {
                Worker worker = workerOpt.get();
                Integer attemptsLeft = 5 - worker.getOtpAttempts();
                response.put("attemptsLeft", Math.max(0, attemptsLeft));
            }
            
            response.put("success", false);
            response.put("message", "Invalid or expired OTP");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Check if a worker's phone is verified
     * @param workerId The worker ID
     * @return Response containing verification status
     */
    @GetMapping("/status/{workerId}")
    public ResponseEntity<Map<String, Object>> checkVerificationStatus(@PathVariable Long workerId) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Worker> workerOpt = workerService.getWorkerById(workerId);
        if (workerOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Worker not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        Worker worker = workerOpt.get();
        response.put("success", true);
        response.put("verified", worker.getPhoneVerified());
        response.put("phoneNumber", maskPhoneNumber(worker.getPhone()));
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Masks a phone number for privacy, showing only the last 4 digits
     * @param phoneNumber The full phone number
     * @return The masked phone number
     */
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
}
