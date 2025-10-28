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
    private com.example.authbackend.repository.ServiceRepository serviceRepository;
    
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
        System.out.println("📋 Worker services: " + worker.getServices());
        
        // Get all PENDING_WORKER_ASSIGNMENT bookings
        List<BookingNew> pendingBookings = bookingRepository.findByStatus("PENDING_WORKER_ASSIGNMENT");
        
        System.out.println("📋 Found " + pendingBookings.size() + " pending bookings");
        
        // Filter by worker's selected services
        return pendingBookings.stream()
                .filter(booking -> {
                    // Get service category from service_id
                    String serviceCategory = getServiceCategory(booking.getServiceId());
                    String serviceCode = booking.getServiceCode();
                    
                    System.out.println("🔍 Checking booking: " + booking.getBookingNumber() + 
                                     ", Service: " + booking.getServiceName() +
                                     ", Category: " + serviceCategory + 
                                     ", Code: " + serviceCode);
                    
                    // Check if worker has this service category enabled
                    boolean matches = workerHasServiceEnabled(worker, serviceCategory, serviceCode);
                    
                    if (matches) {
                        System.out.println("✅ Booking " + booking.getBookingNumber() + " matches worker's services");
                    } else {
                        System.out.println("❌ Booking " + booking.getBookingNumber() + " does NOT match worker's services");
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
    
    /**
     * Get service category from service ID
     */
    private String getServiceCategory(Long serviceId) {
        try {
            return serviceRepository.findById(serviceId)
                    .map(com.example.authbackend.model.Service::getCategory)
                    .orElse("");
        } catch (Exception e) {
            System.err.println("❌ Error fetching service category: " + e.getMessage());
            return "";
        }
    }
    
    /**
     * Check if worker has a specific service category enabled
     */
    private boolean workerHasServiceEnabled(com.example.authbackend.model.Worker worker, String serviceCategory, String serviceCode) {
        String servicesJson = worker.getServices();
        if (servicesJson == null || servicesJson.isEmpty()) {
            return false;
        }
        
        try {
            // Parse the services JSON
            // Expected format: {"elderlyCare": true, "nursingCare": false, ...}
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            java.util.Map<String, Boolean> servicesMap = mapper.readValue(servicesJson, 
                new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Boolean>>() {});
            
            // Map service category to JSON key
            String serviceKey = mapCategoryToServiceKey(serviceCategory);
            
            Boolean isEnabled = servicesMap.get(serviceKey);
            return isEnabled != null && isEnabled;
        } catch (Exception e) {
            System.err.println("❌ Error parsing worker services JSON: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Map service category to the JSON key in worker's services
     */
    private String mapCategoryToServiceKey(String category) {
        if (category == null) return "";
        
        switch (category.toLowerCase()) {
            case "elder care":
                return "elderlyCare";
            case "nursing care":
                return "nursingCare";
            case "caretaker at home":
                return "caretakerAtHome";
            case "diabetes care":
                return "diabetesManagement";
            case "bedridden patient care":
                return "bedriddenPatientCare";
            case "mother and baby care":
                return "motherBabyCare";
            case "paralysis care":
                return "paralysisCare";
            case "parkinsons care":
                return "parkinsonsCare";
            case "post surgery care":
                return "postSurgeryCare";
            case "physiotherapy":
                return "physiotherapy";
            case "pathology care":
                return "pathologyCare";
            case "home security guard":
                return "homeSecurityGuard";
            case "health checkup services":
                return "healthCheckUpServices";
            default:
                return category.replaceAll(" ", "");
        }
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
     * Get worker's tasks (includes all assigned tasks + new available bookings)
     */
    public List<WorkerTaskDTO> getTodaysTasks(Long workerId) {
        // Get worker details
        com.example.authbackend.model.Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        
        // Get ALL assigned tasks (not just today's)
        List<BookingNew> assignedBookings = bookingRepository.findByAssignedWorkerId(workerId).stream()
                .filter(b -> "ASSIGNED".equals(b.getStatus()) || "IN_PROGRESS".equals(b.getStatus()))
                .collect(Collectors.toList());
        
        // Get ALL available bookings that match worker's services
        List<BookingNew> availableBookings = bookingRepository.findByStatus("PENDING_WORKER_ASSIGNMENT").stream()
                .filter(booking -> {
                    // Check if worker has this service enabled
                    String serviceCategory = getServiceCategory(booking.getServiceId());
                    return workerHasServiceEnabled(worker, serviceCategory, booking.getServiceCode());
                })
                .limit(5) // Limit to 5 most recent new requests
                .collect(Collectors.toList());
        
        // Combine both lists
        List<BookingNew> allTaskBookings = new java.util.ArrayList<>(availableBookings);
        allTaskBookings.addAll(assignedBookings);
        
        return allTaskBookings.stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()) && !"COMPLETED".equals(b.getStatus()))
                .sorted((a, b) -> {
                    // Show new requests first, then assigned tasks, sorted by date
                    if ("PENDING_WORKER_ASSIGNMENT".equals(a.getStatus()) && !"PENDING_WORKER_ASSIGNMENT".equals(b.getStatus())) {
                        return -1;
                    } else if (!"PENDING_WORKER_ASSIGNMENT".equals(a.getStatus()) && "PENDING_WORKER_ASSIGNMENT".equals(b.getStatus())) {
                        return 1;
                    }
                    // Sort by preferred date
                    return a.getPreferredDate().compareTo(b.getPreferredDate());
                })
                .limit(10) // Show max 10 tasks in overview
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
        booking.setStatus("ASSIGNED");
        booking.setScheduledAt(LocalDateTime.now());
        bookingRepository.save(booking);
        
        System.out.println("✅ Worker " + workerId + " accepted booking " + bookingId);
    }
    
    /**
     * Decline a task (within 10-15 minutes of accepting)
     */
    public void declineTask(Long bookingId, Long workerId, String reason) {
        BookingNew booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Check if this is an assigned task that can be declined
        if ("ASSIGNED".equals(booking.getStatus())) {
            // Worker can decline within 15 minutes of accepting
            if (!workerId.equals(booking.getAssignedWorkerId())) {
                throw new RuntimeException("This task is not assigned to you");
            }
            
            // Check if within 15 minutes
            if (booking.getScheduledAt() != null) {
                long minutesSinceAccept = java.time.Duration.between(
                    booking.getScheduledAt(), 
                    LocalDateTime.now()
                ).toMinutes();
                
                if (minutesSinceAccept > 15) {
                    throw new RuntimeException("Cannot decline task after 15 minutes of accepting");
                }
            }
            
            // Unassign worker and set back to pending status
            booking.setAssignedWorkerId(null);
            booking.setAssignedWorkerName(null);
            booking.setStatus("PENDING_WORKER_ASSIGNMENT");
            booking.setScheduledAt(null);
            if (reason != null) {
                booking.setAdminNotes("Worker declined: " + reason);
            }
            bookingRepository.save(booking);
            System.out.println("✅ Worker " + workerId + " declined booking " + bookingId + " (Reason: " + reason + ")");
        } else {
            throw new RuntimeException("Cannot decline a task that is not assigned to you");
        }
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
