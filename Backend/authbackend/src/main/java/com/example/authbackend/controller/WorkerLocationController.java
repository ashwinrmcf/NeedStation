package com.example.authbackend.controller;

import com.example.authbackend.model.Worker;
import com.example.authbackend.service.WorkerAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "*")
public class WorkerLocationController {
    
    @Autowired
    private WorkerAssignmentService workerAssignmentService;
    
    /**
     * Update worker location on login
     */
    @PostMapping("/{workerId}/location")
    public ResponseEntity<Map<String, String>> updateLocation(
            @PathVariable Long workerId,
            @RequestBody Map<String, Double> location) {
        
        Double latitude = location.get("latitude");
        Double longitude = location.get("longitude");
        
        if (latitude == null || longitude == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Latitude and longitude are required"));
        }
        
        workerAssignmentService.updateWorkerLocation(workerId, latitude, longitude);
        
        return ResponseEntity.ok(Map.of(
            "message", "Location updated successfully",
            "latitude", String.valueOf(latitude),
            "longitude", String.valueOf(longitude)
        ));
    }
    
    /**
     * Get available workers for a booking (for testing/admin)
     */
    @GetMapping("/available-for-booking/{bookingId}")
    public ResponseEntity<List<Worker>> getAvailableWorkers(@PathVariable Long bookingId) {
        List<Worker> workers = workerAssignmentService.findAvailableWorkersForBooking(bookingId);
        return ResponseEntity.ok(workers);
    }
    
    /**
     * Assign worker to booking (worker accepts)
     */
    @PostMapping("/accept-booking/{bookingId}")
    public ResponseEntity<Map<String, String>> acceptBooking(
            @PathVariable Long bookingId,
            @RequestParam Long workerId) {
        
        try {
            workerAssignmentService.assignWorkerToBooking(bookingId, workerId);
            return ResponseEntity.ok(Map.of(
                "message", "Booking accepted successfully",
                "status", "CONFIRMED"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}
