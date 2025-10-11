package com.example.authbackend.controller;

import com.example.authbackend.dto.BookingDTO;
import com.example.authbackend.model.BookingStatus;
import com.example.authbackend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    // Create a new booking
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO) {
        try {
            BookingDTO createdBooking = bookingService.createBooking(bookingDTO);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Booking created successfully",
                "booking", createdBooking
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Failed to create booking: " + e.getMessage()
                    ));
        }
    }
    
    // Get booking by booking ID
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingByBookingId(@PathVariable String bookingId) {
        try {
            Optional<BookingDTO> booking = bookingService.getBookingByBookingId(bookingId);
            if (booking.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "booking", booking.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                            "success", false,
                            "message", "Booking not found"
                        ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error retrieving booking: " + e.getMessage()
                    ));
        }
    }
    
    // Get bookings by customer phone
    @GetMapping("/customer/{customerPhone}")
    public ResponseEntity<?> getBookingsByCustomerPhone(@PathVariable String customerPhone) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByCustomerPhone(customerPhone);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "bookings", bookings,
                "count", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error retrieving bookings: " + e.getMessage()
                    ));
        }
    }
    
    // Get bookings by worker ID
    @GetMapping("/worker/{workerId}")
    public ResponseEntity<?> getBookingsByWorkerId(@PathVariable Long workerId) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByWorkerId(workerId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "bookings", bookings,
                "count", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error retrieving bookings: " + e.getMessage()
                    ));
        }
    }
    
    // Get bookings by status
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getBookingsByStatus(@PathVariable String status) {
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            List<BookingDTO> bookings = bookingService.getBookingsByStatus(bookingStatus);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "bookings", bookings,
                "count", bookings.size()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "success", false,
                        "message", "Invalid booking status: " + status
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error retrieving bookings: " + e.getMessage()
                    ));
        }
    }
    
    // Update booking status
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable String bookingId, 
            @RequestBody Map<String, String> request) {
        try {
            String statusStr = request.get("status");
            BookingStatus newStatus = BookingStatus.valueOf(statusStr.toUpperCase());
            
            BookingDTO updatedBooking = bookingService.updateBookingStatus(bookingId, newStatus);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Booking status updated successfully",
                "booking", updatedBooking
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "success", false,
                        "message", "Invalid booking status"
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error updating booking status: " + e.getMessage()
                    ));
        }
    }
    
    // Assign worker to booking
    @PutMapping("/{bookingId}/assign-worker")
    public ResponseEntity<?> assignWorkerToBooking(
            @PathVariable String bookingId, 
            @RequestBody Map<String, Long> request) {
        try {
            Long workerId = request.get("workerId");
            BookingDTO updatedBooking = bookingService.assignWorkerToBooking(bookingId, workerId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Worker assigned successfully",
                "booking", updatedBooking
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error assigning worker: " + e.getMessage()
                    ));
        }
    }
    
    // Cancel booking
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable String bookingId, 
            @RequestBody Map<String, String> request) {
        try {
            String reason = request.getOrDefault("reason", "Cancelled by customer");
            BookingDTO cancelledBooking = bookingService.cancelBooking(bookingId, reason);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Booking cancelled successfully",
                "booking", cancelledBooking
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error cancelling booking: " + e.getMessage()
                    ));
        }
    }
    
    // Get available bookings for a worker
    @GetMapping("/worker/{workerId}/available")
    public ResponseEntity<?> getAvailableBookingsForWorker(@PathVariable Long workerId) {
        try {
            List<BookingDTO> bookings = bookingService.getAvailableBookingsForWorker(workerId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "bookings", bookings,
                "count", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error retrieving available bookings: " + e.getMessage()
                    ));
        }
    }
    
    // Get bookings near location
    @GetMapping("/near")
    public ResponseEntity<?> getBookingsNearLocation(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10.0") Double radiusKm) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsNearLocation(latitude, longitude, radiusKm);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "bookings", bookings,
                "count", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error retrieving nearby bookings: " + e.getMessage()
                    ));
        }
    }
    
    // Get booking statistics
    @GetMapping("/statistics")
    public ResponseEntity<?> getBookingStatistics() {
        try {
            Map<String, Long> statistics = bookingService.getBookingStatistics();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "statistics", statistics
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error retrieving statistics: " + e.getMessage()
                    ));
        }
    }
    
    // Get all bookings (with pagination support)
    @GetMapping("/all")
    public ResponseEntity<?> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            // For now, return all bookings by status PENDING
            // You can enhance this with proper pagination using Spring Data's Pageable
            List<BookingDTO> allBookings = bookingService.getBookingsByStatus(BookingStatus.PENDING);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "bookings", allBookings,
                "count", allBookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Error retrieving bookings: " + e.getMessage()
                    ));
        }
    }
}
