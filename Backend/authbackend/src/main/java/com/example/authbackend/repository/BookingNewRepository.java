package com.example.authbackend.repository;

import com.example.authbackend.model.BookingNew;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingNewRepository extends JpaRepository<BookingNew, Long> {
    
    Optional<BookingNew> findByBookingNumber(String bookingNumber);
    
    @Query("SELECT b FROM BookingNew b WHERE b.userId = :userId AND b.deletedAt IS NULL ORDER BY b.createdAt DESC")
    List<BookingNew> findByUserIdNotDeleted(Long userId);
    
    @Query("SELECT b FROM BookingNew b WHERE b.status = :status AND b.deletedAt IS NULL ORDER BY b.createdAt DESC")
    List<BookingNew> findByStatus(String status);
    
    @Query("SELECT b FROM BookingNew b WHERE b.preferredDate = :date AND b.deletedAt IS NULL AND b.status NOT IN ('CANCELLED', 'COMPLETED') ORDER BY b.preferredTime")
    List<BookingNew> findByPreferredDate(LocalDate date);
    
    @Query("SELECT b FROM BookingNew b WHERE b.assignedWorkerId = :workerId AND b.deletedAt IS NULL ORDER BY b.preferredDate, b.preferredTime")
    List<BookingNew> findByAssignedWorkerId(Long workerId);
    
    @Query("SELECT b FROM BookingNew b WHERE b.deletedAt IS NULL ORDER BY b.createdAt DESC")
    List<BookingNew> findAllNotDeleted();
    
    @Query("SELECT COUNT(b) FROM BookingNew b WHERE DATE(b.createdAt) = CURRENT_DATE")
    long countBookingsCreatedToday();
}
