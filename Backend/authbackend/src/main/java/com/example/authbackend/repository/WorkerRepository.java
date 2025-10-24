package com.example.authbackend.repository;

import com.example.authbackend.model.Worker;
import com.example.authbackend.model.WorkerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    boolean existsByPhone(String phone);
    java.util.Optional<Worker> findByEmailIgnoreCaseAndPhone(String email, String phone);
    java.util.Optional<Worker> findByPhone(String phone);
    
    // Find workers by type for assignment
    List<Worker> findByWorkerType(WorkerType workerType);
}
