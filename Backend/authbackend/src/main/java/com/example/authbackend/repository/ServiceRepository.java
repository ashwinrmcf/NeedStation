package com.example.authbackend.repository;

import com.example.authbackend.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    Optional<Service> findByServiceCode(String serviceCode);
    
    Optional<Service> findByServiceName(String serviceName);
    
    @Query("SELECT s FROM Service s WHERE s.isActive = true AND s.deletedAt IS NULL")
    List<Service> findAllActive();
    
    @Query("SELECT s FROM Service s WHERE s.deletedAt IS NULL")
    List<Service> findAllNotDeleted();
    
    @Query("SELECT s FROM Service s WHERE s.serviceCode = :serviceCode AND s.deletedAt IS NULL")
    Optional<Service> findByServiceCodeNotDeleted(String serviceCode);
    
    @Query("SELECT s FROM Service s WHERE s.category = :category AND s.isActive = true AND s.deletedAt IS NULL")
    List<Service> findByCategoryActive(String category);
    
    List<Service> findByServiceNameIn(List<String> serviceNames);
}
