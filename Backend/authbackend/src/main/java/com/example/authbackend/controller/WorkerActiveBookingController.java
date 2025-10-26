package com.example.authbackend.controller;

import com.example.authbackend.model.BookingNew;
import com.example.authbackend.repository.BookingNewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "*")
public class WorkerActiveBookingController {
    
    @Autowired
    private BookingNewRepository bookingRepository;
    
    /**
     * Get active booking for a worker with full details including JSON data
     */
    @GetMapping("/{workerId}/active-booking")
    public ResponseEntity<?> getActiveBooking(@PathVariable Long workerId) {
        // Find the most recent confirmed/in-progress booking for this worker
        BookingNew activeBooking = bookingRepository
            .findFirstByAssignedWorkerIdAndStatusInOrderByScheduledAtDesc(
                workerId, 
                java.util.Arrays.asList("ASSIGNED", "IN_PROGRESS", "SCHEDULED")
            )
            .orElse(null);
        
        if (activeBooking == null) {
            return ResponseEntity.ok(Map.of("hasActiveBooking", false));
        }
        
        // Create a safe DTO to avoid lazy loading issues
        Map<String, Object> bookingData = new HashMap<>();
        bookingData.put("id", activeBooking.getId());
        bookingData.put("bookingNumber", activeBooking.getBookingNumber());
        bookingData.put("serviceName", activeBooking.getServiceName());
        bookingData.put("customerName", activeBooking.getUserName());
        bookingData.put("phone", activeBooking.getPhone());
        bookingData.put("alternatePhone", activeBooking.getAlternatePhone());
        bookingData.put("fullAddress", activeBooking.getFullAddress());
        bookingData.put("landmark", activeBooking.getLandmark());
        bookingData.put("city", activeBooking.getCity());
        bookingData.put("state", activeBooking.getState());
        bookingData.put("pincode", activeBooking.getPincode());
        bookingData.put("preferredDate", activeBooking.getPreferredDate());
        bookingData.put("preferredTime", activeBooking.getPreferredTime());
        bookingData.put("preferredTimeSlot", activeBooking.getPreferredTimeSlot());
        bookingData.put("specialInstructions", activeBooking.getSpecialInstructions());
        bookingData.put("totalAmount", activeBooking.getTotalAmount());
        bookingData.put("status", activeBooking.getStatus());
        bookingData.put("urgency", activeBooking.getUrgency());
        
        // Return full booking details
        Map<String, Object> response = new HashMap<>();
        response.put("hasActiveBooking", true);
        response.put("booking", bookingData);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Mark service as started
     */
    @PostMapping("/booking/{bookingId}/start")
    public ResponseEntity<Map<String, String>> startService(
            @PathVariable Long bookingId,
            @RequestParam Long workerId) {
        
        BookingNew booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getAssignedWorkerId().equals(workerId)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "You are not assigned to this booking"));
        }
        
        booking.setStatus("IN_PROGRESS");
        booking.setStartedAt(java.time.LocalDateTime.now());
        bookingRepository.save(booking);
        
        return ResponseEntity.ok(Map.of(
            "message", "Service started successfully",
            "status", "IN_PROGRESS"
        ));
    }
    
    /**
     * Mark service as completed
     */
    @PostMapping("/booking/{bookingId}/complete")
    public ResponseEntity<Map<String, String>> completeService(
            @PathVariable Long bookingId,
            @RequestParam Long workerId) {
        
        BookingNew booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getAssignedWorkerId().equals(workerId)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "You are not assigned to this booking"));
        }
        
        booking.setStatus("COMPLETED");
        booking.setCompletedAt(java.time.LocalDateTime.now());
        bookingRepository.save(booking);
        
        return ResponseEntity.ok(Map.of(
            "message", "Service completed successfully",
            "status", "COMPLETED"
        ));
    }
}
