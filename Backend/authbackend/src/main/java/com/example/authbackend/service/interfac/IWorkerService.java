package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.*;

public interface IWorkerService {
    
    Response authenticateWorker(String email, String phone);
    Response registerWorker(WorkerDTO workerDto);
    Response getWorkerById(Long workerId);
    Response getAllWorkers();
    Response deleteWorker(Long workerId);
    Response generateOtp(Long workerId);
    Response verifyWorkerOtp(Long workerId, OtpVerificationRequestDto otpRequest);
    Response checkVerificationStatus(Long workerId);
}
