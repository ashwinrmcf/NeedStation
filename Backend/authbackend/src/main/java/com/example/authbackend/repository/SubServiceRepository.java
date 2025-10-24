package com.example.authbackend.repository;

import com.example.authbackend.model.SubService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubServiceRepository extends JpaRepository<SubService, Long> {
    
    @Query("SELECT ss FROM SubService ss WHERE ss.service.id = :serviceId AND ss.isActive = true ORDER BY ss.id")
    List<SubService> findByServiceIdActive(Long serviceId);
    
    @Query("SELECT ss FROM SubService ss WHERE ss.service.id = :serviceId ORDER BY ss.id")
    List<SubService> findByServiceIdNotDeleted(Long serviceId);
}
