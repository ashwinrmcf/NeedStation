package com.example.authbackend.service;

import com.example.authbackend.dto.WorkerDashboardStatsDTO;
import com.example.authbackend.dto.WorkerTaskDTO;
import com.example.authbackend.model.BookingNew;
import com.example.authbackend.repository.BookingNewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WorkerDashboardService {
    
    @Autowired
    private BookingNewRepository bookingRepository;
    
    @Autowired
    private com.example.authbackend.repository.WorkerRepository workerRepository;
    
    @Autowired
    private WorkerAssignmentService workerAssignmentService;
    
    /**
     * Get available bookings for worker (PENDING_WORKER_ASSIGNMENT based on worker type/category)
     */
    public List<WorkerTaskDTO> getAvailableBookingsForWorker(Long workerId) {
        // Get worker details
        com.example.authbackend.model.Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        
        System.out.println("✅ Fetching available bookings for worker: " + workerId + ", Type: " + worker.getWorkerType());
        
        // Get all PENDING_WORKER_ASSIGNMENT bookings
        List<BookingNew> pendingBookings = bookingRepository.findByStatus("PENDING_WORKER_ASSIGNMENT");
        
        System.out.println("📋 Found " + pendingBookings.size() + " pending bookings");
        
        // Filter by worker type only (no location check)
        return pendingBookings.stream()
                .filter(booking -> {
                    // Check if worker type matches service
                    com.example.authbackend.model.WorkerType requiredType = 
                        workerAssignmentService.mapServiceCodeToWorkerType(booking.getServiceCode());
                    
                    boolean matches = worker.getWorkerType() != null && worker.getWorkerType().equals(requiredType);
                    
                    if (matches) {
                        System.out.println("✅ Booking " + booking.getBookingNumber() + " matches worker type");
                    }
                    
                    return matches;
                })
                .sorted((a, b) -> {
                    // Sort by urgency and then by date
                    int urgencyCompare = compareUrgency(a.getUrgency(), b.getUrgency());
                    if (urgencyCompare != 0) return urgencyCompare;
                    return a.getCreatedAt().compareTo(b.getCreatedAt());
                })
                .map(this::convertToTaskDTO)
                .collect(Collectors.toList());
    }
    
    private int compareUrgency(String urgency1, String urgency2) {
        int priority1 = "URGENT".equals(urgency1) ? 0 : 1;
        int priority2 = "URGENT".equals(urgency2) ? 0 : 1;
        return Integer.compare(priority1, priority2);
    }
    
    /**
     * Get worker dashboard statistics
     */
    public WorkerDashboardStatsDTO getWorkerStats(Long workerId) {
        WorkerDashboardStatsDTO stats = new WorkerDashboardStatsDTO();
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekStart = now.minus(7, ChronoUnit.DAYS);
        LocalDateTime monthStart = now.minus(30, ChronoUnit.DAYS);
        
        // Get all bookings for this worker
        List<BookingNew> allBookings = bookingRepository.findByAssignedWorkerId(workerId);
        
        // Total completed tasks
        long completedTasks = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .count();
        stats.setTasksCompleted((int) completedTasks);
        
        // Tasks this week
        long tasksThisWeek = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(weekStart))
                .count();
        stats.setTasksThisWeek((int) tasksThisWeek);
        
        // Tasks this month
        long tasksThisMonth = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(monthStart))
                .count();
        stats.setTasksThisMonth((int) tasksThisMonth);
        
        // Monthly earnings
        BigDecimal monthlyEarnings = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(monthStart))
                .map(BookingNew::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setMonthlyEarnings(monthlyEarnings);
        
        // Weekly earnings
        BigDecimal weeklyEarnings = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(weekStart))
                .map(BookingNew::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setWeeklyEarnings(weeklyEarnings);
        
        // Total earnings
        BigDecimal totalEarnings = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .map(BookingNew::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalEarnings(totalEarnings);
        
        // Average rating
        List<Integer> ratings = allBookings.stream()
                .filter(b -> b.getCustomerRating() != null)
                .map(BookingNew::getCustomerRating)
                .collect(Collectors.toList());
        
        if (!ratings.isEmpty()) {
            double avgRating = ratings.stream()
                    .mapToInt(Integer::intValue)
                    .average()
                    .orElse(0.0);
            stats.setAverageRating(Math.round(avgRating * 10.0) / 10.0);
            stats.setTotalRatings(ratings.size());
        } else {
            stats.setAverageRating(0.0);
            stats.setTotalRatings(0);
        }
        
        // New messages (placeholder - implement when messaging system is ready)
        stats.setNewMessages(0);
        
        // Pending tasks (new requests)
        long pendingTasks = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()) || "PAYMENT_PENDING".equals(b.getStatus()))
                .count();
        stats.setPendingTasks((int) pendingTasks);
        
        // Upcoming tasks (accepted but not completed)
        long upcomingTasks = allBookings.stream()
                .filter(b -> "ASSIGNED".equals(b.getStatus()) || "IN_PROGRESS".equals(b.getStatus()))
                .count();
        stats.setUpcomingTasks((int) upcomingTasks);
        
        return stats;
    }
    
    /**
     * Get today's tasks
     */
    public List<WorkerTaskDTO> getTodaysTasks(Long workerId) {
        LocalDate today = LocalDate.now();
        List<BookingNew> bookings = bookingRepository.findByAssignedWorkerIdAndPreferredDate(workerId, today);
        
        return bookings.stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()) && !"COMPLETED".equals(b.getStatus()))
                .map(this::convertToTaskDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get upcoming tasks
     */
    public List<WorkerTaskDTO> getUpcomingTasks(Long workerId, String status) {
        List<BookingNew> bookings;
        
        if (status != null && !status.isEmpty()) {
            bookings = bookingRepository.findByAssignedWorkerIdAndStatus(workerId, status);
        } else {
            bookings = bookingRepository.findByAssignedWorkerId(workerId);
        }
        
        LocalDate today = LocalDate.now();
        
        return bookings.stream()
                .filter(b -> {
                    // Include tasks that are not completed or cancelled
                    if ("COMPLETED".equals(b.getStatus()) || "CANCELLED".equals(b.getStatus())) {
                        return false;
                    }
                    // Include tasks for today or future
                    return b.getPreferredDate() != null && 
                           (b.getPreferredDate().isEqual(today) || b.getPreferredDate().isAfter(today));
                })
                .sorted((a, b) -> a.getPreferredDate().compareTo(b.getPreferredDate()))
                .map(this::convertToTaskDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get completed tasks
     */
    public List<WorkerTaskDTO> getCompletedTasks(Long workerId, LocalDate startDate, LocalDate endDate) {
        List<BookingNew> bookings = bookingRepository.findByAssignedWorkerId(workerId);
        
        return bookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .filter(b -> {
                    if (startDate != null && b.getCompletedAt() != null) {
                        return !b.getCompletedAt().toLocalDate().isBefore(startDate);
                    }
                    return true;
                })
                .filter(b -> {
                    if (endDate != null && b.getCompletedAt() != null) {
                        return !b.getCompletedAt().toLocalDate().isAfter(endDate);
                    }
                    return true;
                })
                .sorted((a, b) -> {
                    if (a.getCompletedAt() == null) return 1;
                    if (b.getCompletedAt() == null) return -1;
                    return b.getCompletedAt().compareTo(a.getCompletedAt());
                })
                .map(this::convertToTaskDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get worker earnings
     */
    public Map<String, Object> getWorkerEarnings(Long workerId, String period) {
        Map<String, Object> result = new HashMap<>();
        List<BookingNew> completedBookings = bookingRepository.findByAssignedWorkerIdAndStatus(workerId, "COMPLETED");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime periodStart;
        
        switch (period != null ? period.toLowerCase() : "month") {
            case "today":
                periodStart = now.toLocalDate().atStartOfDay();
                break;
            case "week":
                periodStart = now.minus(7, ChronoUnit.DAYS);
                break;
            case "year":
                periodStart = now.minus(365, ChronoUnit.DAYS);
                break;
            case "month":
            default:
                periodStart = now.minus(30, ChronoUnit.DAYS);
                break;
        }
        
        // Filter by period
        List<BookingNew> periodBookings = completedBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(periodStart))
                .collect(Collectors.toList());
        
        // Calculate earnings
        BigDecimal totalEarnings = periodBookings.stream()
                .map(BookingNew::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Total all-time earnings
        BigDecimal allTimeEarnings = completedBookings.stream()
                .map(BookingNew::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        result.put("periodEarnings", totalEarnings);
        result.put("totalEarnings", allTimeEarnings);
        result.put("tasksCompleted", periodBookings.size());
        result.put("totalTasksCompleted", completedBookings.size());
        result.put("period", period != null ? period : "month");
        
        return result;
    }
    
    /**
     * Accept a task (first-come-first-served)
     */
    public void acceptTask(Long bookingId, Long workerId) {
        BookingNew booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Check if booking is still available
        if (!"PENDING_WORKER_ASSIGNMENT".equals(booking.getStatus())) {
            throw new RuntimeException("This booking has already been accepted by another worker");
        }
        
        // Get worker details
        com.example.authbackend.model.Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        
        // Assign worker to booking
        booking.setAssignedWorkerId(workerId);
        booking.setAssignedWorkerName(worker.getFullName());
        booking.setStatus("CONFIRMED");
        booking.setScheduledAt(LocalDateTime.now());
        bookingRepository.save(booking);
        
        System.out.println("✅ Worker " + workerId + " accepted booking " + bookingId);
    }
    
    /**
     * Decline a task
     */
    public void declineTask(Long bookingId, Long workerId, String reason) {
        BookingNew booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!workerId.equals(booking.getAssignedWorkerId())) {
            throw new RuntimeException("This task is not assigned to you");
        }
        
        // Unassign worker and set back to confirmed status
        booking.setAssignedWorkerId(null);
        booking.setAssignedWorkerName(null);
        booking.setStatus("CONFIRMED");
        if (reason != null) {
            booking.setAdminNotes("Worker declined: " + reason);
        }
        bookingRepository.save(booking);
    }
    
    /**
     * Complete a task
     */
    public void completeTask(Long bookingId, Long workerId) {
        BookingNew booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!workerId.equals(booking.getAssignedWorkerId())) {
            throw new RuntimeException("This task is not assigned to you");
        }
        
        booking.setStatus("COMPLETED");
        booking.setCompletedAt(LocalDateTime.now());
        bookingRepository.save(booking);
    }
    
    /**
     * Convert BookingNew to WorkerTaskDTO
     */
    private WorkerTaskDTO convertToTaskDTO(BookingNew booking) {
        WorkerTaskDTO dto = new WorkerTaskDTO();
        dto.setId(booking.getId());
        dto.setBookingNumber(booking.getBookingNumber());
        dto.setCustomerName(booking.getUserName());
        dto.setServiceName(booking.getServiceName());
        dto.setServiceCode(booking.getServiceCode());
        dto.setDescription(booking.getSpecialInstructions());
        dto.setPreferredDate(booking.getPreferredDate());
        dto.setPreferredTime(booking.getPreferredTime());
        dto.setPreferredTimeSlot(booking.getPreferredTimeSlot());
        dto.setStatus(booking.getStatus());
        dto.setUrgency(booking.getUrgency());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setPhone(booking.getPhone());
        dto.setAlternatePhone(booking.getAlternatePhone());
        dto.setFullAddress(booking.getFullAddress());
        dto.setCity(booking.getCity());
        dto.setState(booking.getState());
        dto.setPincode(booking.getPincode());
        dto.setLandmark(booking.getLandmark());
        dto.setSpecialInstructions(booking.getSpecialInstructions());
        dto.setCustomerRating(booking.getCustomerRating());
        dto.setCustomerFeedback(booking.getCustomerFeedback());
        dto.setScheduledAt(booking.getScheduledAt());
        dto.setCompletedAt(booking.getCompletedAt());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
