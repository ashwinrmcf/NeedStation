package com.example.authbackend.controller;

import com.example.authbackend.dto.BookingResponseDTO;
import com.example.authbackend.dto.CreateBookingDTO;
import com.example.authbackend.service.BookingServiceNew;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingNewController {
    
    @Autowired
    private BookingServiceNew bookingService;
    
    /**
     * Create a new booking
     * POST /api/bookings
     * 
     * Request Body: CreateBookingDTO
     * Returns: BookingResponseDTO with booking number
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody CreateBookingDTO dto) {
        try {
            BookingResponseDTO booking = bookingService.createBooking(dto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking created successfully");
            response.put("booking", booking);
            response.put("bookingNumber", booking.getBookingNumber());
            response.put("bookingId", booking.getId());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(400).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create booking: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Get user's bookings
     * GET /api/bookings/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserBookings(@PathVariable Long userId) {
        try {
            List<BookingResponseDTO> bookings = bookingService.getUserBookings(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("bookings", bookings);
            response.put("count", bookings.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch bookings: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Get booking by ID
     * GET /api/bookings/{bookingId}
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<Map<String, Object>> getBookingById(@PathVariable Long bookingId) {
        try {
            BookingResponseDTO booking = bookingService.getBookingById(bookingId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(404).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch booking: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Get booking by booking number
     * GET /api/bookings/number/{bookingNumber}
     */
    @GetMapping("/number/{bookingNumber}")
    public ResponseEntity<Map<String, Object>> getBookingByNumber(@PathVariable String bookingNumber) {
        try {
            BookingResponseDTO booking = bookingService.getBookingByNumber(bookingNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(404).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch booking: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Update booking status
     * PUT /api/bookings/{bookingId}/status
     * 
     * Request Body: { "status": "CONFIRMED", "updatedBy": 123 }
     */
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<Map<String, Object>> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, Object> request) {
        try {
            String status = (String) request.get("status");
            Long updatedBy = Long.valueOf(request.get("updatedBy").toString());
            
            BookingResponseDTO booking = bookingService.updateBookingStatus(bookingId, status, updatedBy);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking status updated successfully");
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(400).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update booking status: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Assign worker to booking
     * PUT /api/bookings/{bookingId}/assign
     * 
     * Request Body: { "workerId": 456, "updatedBy": 123 }
     */
    @PutMapping("/{bookingId}/assign")
    public ResponseEntity<Map<String, Object>> assignWorker(
            @PathVariable Long bookingId,
            @RequestBody Map<String, Object> request) {
        try {
            Long workerId = Long.valueOf(request.get("workerId").toString());
            Long updatedBy = Long.valueOf(request.get("updatedBy").toString());
            
            BookingResponseDTO booking = bookingService.assignWorker(bookingId, workerId, updatedBy);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Worker assigned successfully");
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(400).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to assign worker: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Confirm payment for a booking
     * POST /api/bookings/{bookingId}/confirm-payment
     * 
     * Request Body: { "paymentMethod": "RAZORPAY", "transactionId": "pay_xxx", "paidAmount": 1500.00 }
     */
    @PostMapping("/{bookingId}/confirm-payment")
    public ResponseEntity<Map<String, Object>> confirmPayment(
            @PathVariable Long bookingId,
            @RequestBody Map<String, Object> request) {
        try {
            String paymentMethod = (String) request.get("paymentMethod");
            String transactionId = (String) request.get("transactionId");
            java.math.BigDecimal paidAmount = new java.math.BigDecimal(request.get("paidAmount").toString());
            
            BookingResponseDTO booking = bookingService.confirmPayment(bookingId, paymentMethod, transactionId, paidAmount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment confirmed successfully. Booking is now confirmed!");
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(400).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to confirm payment: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Rate a completed booking
     * POST /api/bookings/{bookingId}/rate
     * 
     * Request Body: { "rating": 5, "feedback": "Excellent service!" }
     */
    @PostMapping("/{bookingId}/rate")
    public ResponseEntity<Map<String, Object>> rateBooking(
            @PathVariable Long bookingId,
            @RequestBody Map<String, Object> request) {
        try {
            Integer rating = Integer.valueOf(request.get("rating").toString());
            String feedback = (String) request.get("feedback");
            
            BookingResponseDTO booking = bookingService.rateBooking(bookingId, rating, feedback);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Rating submitted successfully");
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(400).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to submit rating: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Cancel a booking (DELETE from database)
     * DELETE /api/bookings/{bookingId}/cancel
     */
    @DeleteMapping("/{bookingId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable Long bookingId) {
        try {
            bookingService.deleteBooking(bookingId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking cancelled and deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(404).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to cancel booking: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
