package com.example.authbackend.repository;

import com.example.authbackend.model.ServiceFormality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceFormalityRepository extends JpaRepository<ServiceFormality, Long> {
    
    @Query("SELECT sf FROM ServiceFormality sf WHERE sf.service.id = :serviceId ORDER BY sf.id")
    List<ServiceFormality> findByServiceIdNotDeleted(Long serviceId);
    
    @Query("SELECT sf FROM ServiceFormality sf WHERE sf.service.id = :serviceId AND sf.isRequired = true ORDER BY sf.id")
    List<ServiceFormality> findRequiredByServiceId(Long serviceId);
}
