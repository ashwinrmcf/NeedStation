package com.example.authbackend.repository;

import com.example.authbackend.entity.ContactSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {
    
    // Find all submissions by email
    List<ContactSubmission> findByEmailOrderBySubmittedAtDesc(String email);
    
    // Find all unresolved submissions
    List<ContactSubmission> findByIsResolvedFalseOrderBySubmittedAtDesc();
    
    // Find all resolved submissions
    List<ContactSubmission> findByIsResolvedTrueOrderBySubmittedAtDesc();
    
    // Find submissions by date range
    @Query("SELECT c FROM ContactSubmission c WHERE c.submittedAt BETWEEN :startDate AND :endDate ORDER BY c.submittedAt DESC")
    List<ContactSubmission> findBySubmittedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Count unresolved submissions
    long countByIsResolvedFalse();
    
    // Find submissions by subject containing keyword
    List<ContactSubmission> findBySubjectContainingIgnoreCaseOrderBySubmittedAtDesc(String keyword);
}
