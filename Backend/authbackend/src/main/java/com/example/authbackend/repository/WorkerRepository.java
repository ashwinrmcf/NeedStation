package com.example.authbackend.repository;

import com.example.authbackend.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
    
    Optional<Worker> findByEmailIgnoreCaseAndPhone(String email, String phone);
    Optional<Worker> findByPhone(String phone);
    Optional<Worker> findByEmail(String email);
}
