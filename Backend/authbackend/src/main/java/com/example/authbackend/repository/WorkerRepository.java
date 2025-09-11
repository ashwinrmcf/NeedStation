    package com.example.authbackend.repository;

import com.example.authbackend.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    boolean existsByPhone(String phone);
    java.util.Optional<Worker> findByEmailIgnoreCaseAndPhone(String email, String phone);
    java.util.Optional<Worker> findByPhone(String phone);
}
