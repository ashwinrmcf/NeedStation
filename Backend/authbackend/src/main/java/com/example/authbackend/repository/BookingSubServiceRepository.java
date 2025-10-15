package com.example.authbackend.repository;

import com.example.authbackend.model.BookingSubService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSubServiceRepository extends JpaRepository<BookingSubService, Long> {
    
    @Query("SELECT bss FROM BookingSubService bss WHERE bss.booking.id = :bookingId")
    List<BookingSubService> findByBookingId(Long bookingId);
}
