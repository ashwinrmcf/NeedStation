package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.model.Worker;
import com.example.authbackend.repository.WorkerRepository;
import com.example.authbackend.service.interfac.IWorkerService;
import com.example.authbackend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WorkerService implements IWorkerService {

    @Autowired
    private WorkerRepository workerRepository;

    @Override
    public Response authenticateWorker(String email, String phone) {
        Response response = new Response();
        try {
            if (email == null || phone == null) {
                response.setStatusCode(400);
                response.setMessage("Email and phone are required");
                return response;
            }
            
            Worker worker = workerRepository.findByEmailIgnoreCaseAndPhone(email.trim(), phone.trim())
                    .orElseThrow(() -> new Exception("Worker not found"));
            
            WorkerDTO workerDto = Utils.mapWorkerEntityToWorkerDto(worker);
            response.setWorkerDto(workerDto);
            response.setStatusCode(200);
            response.setMessage("Worker authenticated successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Authentication failed: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response registerWorker(WorkerDTO workerDto) {
        Response response = new Response();
        try {
            if (workerRepository.existsByEmail(workerDto.getEmail())) {
                response.setStatusCode(400);
                response.setMessage("Email is already registered");
                return response;
            }
            
            if (workerRepository.existsByPhone(workerDto.getPhone())) {
                response.setStatusCode(400);
                response.setMessage("Phone number is already registered");
                return response;
            }

            Worker worker = new Worker();
            worker.setFullName(workerDto.getFullName());
            worker.setGender(workerDto.getGender());
            worker.setDob(workerDto.getDob() != null ? LocalDate.parse(workerDto.getDob()) : null);
            worker.setPhone(workerDto.getPhone());
            worker.setEmail(workerDto.getEmail());
            worker.setWhatsappNumber(workerDto.getWhatsappNumber());
            worker.setProfileImageUrl(workerDto.getProfileImageUrl());

            Worker savedWorker = workerRepository.save(worker);
            WorkerDTO savedWorkerDto = Utils.mapWorkerEntityToWorkerDto(savedWorker);
            
            response.setWorkerDto(savedWorkerDto);
            response.setStatusCode(200);
            response.setMessage("Worker registered successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Registration failed: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getWorkerById(Long workerId) {
        Response response = new Response();
        try {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new Exception("Worker not found"));
            
            WorkerDTO workerDto = Utils.mapWorkerEntityToWorkerDto(worker);
            response.setWorkerDto(workerDto);
            response.setStatusCode(200);
            response.setMessage("Worker found successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retrieving worker: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllWorkers() {
        Response response = new Response();
        try {
            List<Worker> workerList = workerRepository.findAll();
            if (workerList.isEmpty()) {
                response.setStatusCode(404);
                response.setMessage("No workers found");
                return response;
            }
            
            List<WorkerDTO> workerDtoList = Utils.mapWorkerListEntityToWorkerDtoList(workerList);
            response.setWorkerDtoList(workerDtoList);
            response.setStatusCode(200);
            response.setMessage("Workers retrieved successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retrieving workers: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteWorker(Long workerId) {
        Response response = new Response();
        try {
            if (!workerRepository.existsById(workerId)) {
                response.setStatusCode(404);
                response.setMessage("Worker not found");
                return response;
            }
            
            workerRepository.deleteById(workerId);
            response.setStatusCode(200);
            response.setMessage("Worker deleted successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error deleting worker: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response generateOtp(Long workerId) {
        Response response = new Response();
        try {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new Exception("Worker not found"));
            
            // TODO: Implement OTP generation logic
            response.setStatusCode(200);
            response.setMessage("OTP generated successfully for worker: " + worker.getFullName());
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error generating OTP: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response verifyWorkerOtp(Long workerId, OtpVerificationRequestDto otpRequest) {
        Response response = new Response();
        try {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new Exception("Worker not found"));
            
            // TODO: Implement OTP verification logic
            response.setStatusCode(200);
            response.setMessage("OTP verification not implemented yet for worker: " + worker.getFullName());
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error verifying OTP: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response checkVerificationStatus(Long workerId) {
        Response response = new Response();
        try {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new Exception("Worker not found"));
            
            WorkerDTO workerDto = Utils.mapWorkerEntityToWorkerDto(worker);
            response.setWorkerDto(workerDto);
            response.setStatusCode(200);
            response.setMessage("Verification status retrieved successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error checking verification status: " + e.getMessage());
        }
        return response;
    }
}
