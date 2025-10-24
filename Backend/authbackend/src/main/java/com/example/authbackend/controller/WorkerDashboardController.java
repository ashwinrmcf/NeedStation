package com.example.authbackend.controller;

import com.example.authbackend.dto.WorkerDashboardStatsDTO;
import com.example.authbackend.dto.WorkerTaskDTO;
import com.example.authbackend.service.WorkerDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/worker/dashboard")
@CrossOrigin(origins = "*")
public class WorkerDashboardController {
    
    @Autowired
    private WorkerDashboardService dashboardService;
    
    /**
     * Get available bookings for worker (within 30km radius, PENDING_WORKER_ASSIGNMENT status)
     */
    @GetMapping("/tasks/available/{workerId}")
    public ResponseEntity<List<WorkerTaskDTO>> getAvailableBookings(@PathVariable Long workerId) {
        List<WorkerTaskDTO> tasks = dashboardService.getAvailableBookingsForWorker(workerId);
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Get worker dashboard statistics
     */
    @GetMapping("/stats/{workerId}")
    public ResponseEntity<WorkerDashboardStatsDTO> getDashboardStats(@PathVariable Long workerId) {
        WorkerDashboardStatsDTO stats = dashboardService.getWorkerStats(workerId);
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Get today's tasks for worker
     */
    @GetMapping("/tasks/today/{workerId}")
    public ResponseEntity<List<WorkerTaskDTO>> getTodaysTasks(@PathVariable Long workerId) {
        List<WorkerTaskDTO> tasks = dashboardService.getTodaysTasks(workerId);
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Get upcoming tasks for worker
     */
    @GetMapping("/tasks/upcoming/{workerId}")
    public ResponseEntity<List<WorkerTaskDTO>> getUpcomingTasks(
            @PathVariable Long workerId,
            @RequestParam(required = false) String status) {
        List<WorkerTaskDTO> tasks = dashboardService.getUpcomingTasks(workerId, status);
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Get completed tasks for worker
     */
    @GetMapping("/tasks/completed/{workerId}")
    public ResponseEntity<List<WorkerTaskDTO>> getCompletedTasks(
            @PathVariable Long workerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<WorkerTaskDTO> tasks = dashboardService.getCompletedTasks(workerId, startDate, endDate);
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Get earnings data for worker
     */
    @GetMapping("/earnings/{workerId}")
    public ResponseEntity<Map<String, Object>> getEarnings(
            @PathVariable Long workerId,
            @RequestParam(required = false) String period) { // today, week, month, year
        Map<String, Object> earnings = dashboardService.getWorkerEarnings(workerId, period);
        return ResponseEntity.ok(earnings);
    }
    
    /**
     * Accept a task
     */
    @PostMapping("/tasks/{bookingId}/accept")
    public ResponseEntity<Map<String, String>> acceptTask(
            @PathVariable Long bookingId,
            @RequestParam Long workerId) {
        dashboardService.acceptTask(bookingId, workerId);
        return ResponseEntity.ok(Map.of("message", "Task accepted successfully"));
    }
    
    /**
     * Decline a task
     */
    @PostMapping("/tasks/{bookingId}/decline")
    public ResponseEntity<Map<String, String>> declineTask(
            @PathVariable Long bookingId,
            @RequestParam Long workerId,
            @RequestParam(required = false) String reason) {
        dashboardService.declineTask(bookingId, workerId, reason);
        return ResponseEntity.ok(Map.of("message", "Task declined"));
    }
    
    /**
     * Mark task as completed
     */
    @PostMapping("/tasks/{bookingId}/complete")
    public ResponseEntity<Map<String, String>> completeTask(
            @PathVariable Long bookingId,
            @RequestParam Long workerId) {
        dashboardService.completeTask(bookingId, workerId);
        return ResponseEntity.ok(Map.of("message", "Task marked as completed"));
    }
}
