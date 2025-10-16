package com.example.authbackend.repository;

import com.example.authbackend.model.Booking;
import com.example.authbackend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find booking by booking ID
    Optional<Booking> findByBookingId(String bookingId);
    
    // Find bookings by customer phone
    List<Booking> findByCustomerPhoneOrderByCreatedAtDesc(String customerPhone);
    
    // Find bookings by service name
    List<Booking> findByServiceNameOrderByCreatedAtDesc(String serviceName);
    
    // Find bookings by status
    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);
    
    // Find bookings by assigned worker
    List<Booking> findByAssignedWorkerIdOrderByCreatedAtDesc(Long workerId);
    
    // Find bookings by city
    List<Booking> findByCityOrderByCreatedAtDesc(String city);
    
    // Find bookings by pincode
    List<Booking> findByPincodeOrderByCreatedAtDesc(String pincode);
    
    // Find bookings created between dates
    List<Booking> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find pending bookings for a specific service in a city
    @Query("SELECT b FROM Booking b WHERE b.serviceName = :serviceName AND b.city = :city AND b.status = :status ORDER BY b.createdAt ASC")
    List<Booking> findPendingBookingsByServiceAndCity(@Param("serviceName") String serviceName, 
                                                     @Param("city") String city, 
                                                     @Param("status") BookingStatus status);
    
    // Find bookings near a location (within radius)
    @Query("SELECT b FROM Booking b WHERE " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(b.latitude)) * " +
           "cos(radians(b.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(b.latitude)))) <= :radiusKm " +
           "ORDER BY b.createdAt DESC")
    List<Booking> findBookingsNearLocation(@Param("latitude") Double latitude, 
                                          @Param("longitude") Double longitude, 
                                          @Param("radiusKm") Double radiusKm);
    
    // Count bookings by status
    long countByStatus(BookingStatus status);
    
    // Count bookings for a customer
    long countByCustomerPhone(String customerPhone);
    
    // Count bookings for a worker
    long countByAssignedWorkerId(Long workerId);
    
    // Find recent bookings (last 24 hours)
    @Query("SELECT b FROM Booking b WHERE b.createdAt >= :since ORDER BY b.createdAt DESC")
    List<Booking> findRecentBookings(@Param("since") LocalDateTime since);
    
    // Find bookings that need worker assignment (pending for more than X minutes)
    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.createdAt <= :cutoffTime ORDER BY b.createdAt ASC")
    List<Booking> findBookingsNeedingAssignment(@Param("status") BookingStatus status, 
                                               @Param("cutoffTime") LocalDateTime cutoffTime);
    
    // Find available bookings for a worker based on their services and location
    @Query("SELECT b FROM Booking b WHERE b.serviceName IN :workerServices AND " +
           "b.city = :workerCity AND b.status = :status AND b.assignedWorkerId IS NULL " +
           "ORDER BY b.createdAt ASC")
    List<Booking> findAvailableBookingsForWorker(@Param("workerServices") List<String> workerServices,
                                                @Param("workerCity") String workerCity,
                                                @Param("status") BookingStatus status);
}
