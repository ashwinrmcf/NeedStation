package com.example.authbackend.repository;

import com.example.authbackend.model.BookingFormalityData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingFormalityDataRepository extends JpaRepository<BookingFormalityData, Long> {
    
    @Query("SELECT bfd FROM BookingFormalityData bfd WHERE bfd.booking.id = :bookingId")
    List<BookingFormalityData> findByBookingId(Long bookingId);
}
