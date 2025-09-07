package com.example.authbackend.controller;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IWorkerService;
import com.example.authbackend.service.interfac.IFreeOtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for Worker OTP verification and registration using Free OTP API
 */
@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
public class WorkerOtpController {

    @Autowired
    private IWorkerService iWorkerService;
    
    @Autowired
    private IFreeOtpService iFreeOtpService;

    /**
     * Register a new worker (Step 1) with OTP verification
     * JSON-only endpoint for login/OTP flow
     */
    @PostMapping(value = "/register/step1", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response registerWorker(@RequestBody WorkerDTO workerDTO) {
        return iWorkerService.registerWorker(workerDTO);
    }
    
    /**
     * Verify OTP for worker registration or login
     */
    @PostMapping("/verify-otp")
    public Response verifyOtp(@RequestBody OtpVerificationRequestDto request) {
        return iWorkerService.getWorkerById(request.getWorkerId());
    }
    
    /**
     * Resend OTP to a worker's phone
     */
    @PostMapping("/resend-otp")
    public Response resendOtp(@RequestParam Long workerId) {
        return iWorkerService.getWorkerById(workerId);
    }
}
