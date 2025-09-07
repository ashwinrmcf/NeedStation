package com.example.authbackend.controller;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IWorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
public class WorkerController {

    @Autowired
    private IWorkerService iWorkerService;

    @PostMapping("/authenticate")
    public Response authenticateWorker(@RequestParam String email, @RequestParam String phone) {
        return iWorkerService.authenticateWorker(email, phone);
    }

    @PostMapping("/registerWorker")
    public Response registerWorker(@RequestBody WorkerDTO workerDto) {
        return iWorkerService.registerWorker(workerDto);
    }

    @GetMapping("/getWorker/{workerId}")
    public Response getWorkerById(@PathVariable Long workerId) {
        return iWorkerService.getWorkerById(workerId);
    }

    @GetMapping("/getAllWorkers")
    public Response getAllWorkers() {
        return iWorkerService.getAllWorkers();
    }

    @DeleteMapping("/deleteWorker/{workerId}")
    public Response deleteWorker(@PathVariable Long workerId) {
        return iWorkerService.deleteWorker(workerId);
    }

    // OTP endpoints merged from OtpController
    @PostMapping("/otp/generate/{workerId}")
    public Response generateOtp(@PathVariable Long workerId) {
        return iWorkerService.generateOtp(workerId);
    }

    @PostMapping("/otp/verify/{workerId}")
    public Response verifyOtp(@PathVariable Long workerId, @RequestBody OtpVerificationRequestDto otpRequest) {
        return iWorkerService.verifyWorkerOtp(workerId, otpRequest);
    }
    
    @GetMapping("/otp/status/{workerId}")
    public Response checkVerificationStatus(@PathVariable Long workerId) {
        return iWorkerService.checkVerificationStatus(workerId);
    }
}



