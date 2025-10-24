package com.example.authbackend.service;

import com.example.authbackend.model.BookingNew;
import com.example.authbackend.model.Worker;
import com.example.authbackend.model.WorkerType;
import com.example.authbackend.repository.BookingNewRepository;
import com.example.authbackend.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerAssignmentService {
    
    @Autowired
    private WorkerRepository workerRepository;
    
    @Autowired
    private BookingNewRepository bookingRepository;
    
    private static final double EARTH_RADIUS_KM = 6371.0;
    private static final double MAX_RADIUS_KM = 30.0; // 20-30 km radius
    
    /**
     * Find all available workers for a booking (based on worker type/category only)
     */
    public List<Worker> findAvailableWorkersForBooking(Long bookingId) {
        BookingNew booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        System.out.println("🔍 Finding workers for booking: " + booking.getBookingNumber());
        
        // Get all workers of matching service type
        String serviceCode = booking.getServiceCode();
        WorkerType requiredType = mapServiceCodeToWorkerType(serviceCode);
        
        System.out.println("📋 Service: " + serviceCode + " -> Worker Type: " + requiredType);
        
        List<Worker> allWorkers = workerRepository.findByWorkerType(requiredType);
        
        System.out.println("👥 Found " + allWorkers.size() + " workers with matching type");
        
        // Filter by availability only (no location check)
        List<Worker> availableWorkers = allWorkers.stream()
            .filter(worker -> {
                // Check if worker is available
                boolean isAvailable = "AVAILABLE".equals(worker.getAvailabilityStatus().toString());
                if (isAvailable) {
                    System.out.println("✅ Worker " + worker.getId() + " (" + worker.getFullName() + ") is available");
                }
                return isAvailable;
            })
            .sorted(Comparator.comparing(Worker::getRating, Comparator.reverseOrder()))
            .collect(Collectors.toList());
        
        System.out.println("✅ Returning " + availableWorkers.size() + " available workers");
        
        return availableWorkers;
    }
    
    /**
     * Calculate distance between two points using Haversine formula
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return EARTH_RADIUS_KM * c;
    }
    
    /**
     * Map service code to worker type
     */
    public WorkerType mapServiceCodeToWorkerType(String serviceCode) {
        // Map your service codes to worker types
        if (serviceCode == null) return WorkerType.NURSE;
        
        switch (serviceCode.toUpperCase()) {
            case "ELDERLY_CARE":
            case "ELDERLY":
                return WorkerType.CARETAKER; // Changed to CARETAKER to match your database
            case "NURSING":
            case "NURSING_CARE":
            case "POST_SURGERY":
            case "POST_SURGERY_CARE":
                return WorkerType.NURSE;
            case "PHYSIOTHERAPY":
            case "PHYSIO":
                return WorkerType.PHYSIOTHERAPIST;
            case "DIABETES":
            case "DIABETES_MANAGEMENT":
                return WorkerType.NURSE;
            case "CARETAKER_AT_HOME":
                return WorkerType.CARETAKER;
            case "BEDRIDDEN_PATIENT_CARE":
                return WorkerType.CARETAKER;
            case "MOTHER_AND_BABY_CARE":
                return WorkerType.NURSE;
            case "PARALYSIS_CARE":
                return WorkerType.CARETAKER;
            case "PARKINSONS_CARE":
                return WorkerType.CARETAKER;
            default:
                return WorkerType.NURSE;
        }
    }
    
    /**
     * Assign first worker who accepts the booking
     */
    @Transactional
    public void assignWorkerToBooking(Long bookingId, Long workerId) {
        BookingNew booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        Worker worker = workerRepository.findById(workerId)
            .orElseThrow(() -> new RuntimeException("Worker not found"));
        
        // Check if booking is still available for assignment
        if (booking.getAssignedWorkerId() != null) {
            throw new RuntimeException("Booking already assigned to another worker");
        }
        
        // Assign worker
        booking.setAssignedWorkerId(workerId);
        booking.setAssignedWorkerName(worker.getFullName());
        booking.setStatus("CONFIRMED");
        booking.setScheduledAt(LocalDateTime.now());
        
        bookingRepository.save(booking);
        
        // Update worker availability if needed
        // worker.setAvailabilityStatus(AvailabilityStatus.BUSY);
        // workerRepository.save(worker);
    }
    
    /**
     * Update worker location on login
     */
    @Transactional
    public void updateWorkerLocation(Long workerId, Double latitude, Double longitude) {
        Worker worker = workerRepository.findById(workerId)
            .orElseThrow(() -> new RuntimeException("Worker not found"));
        
        worker.setCurrentLatitude(latitude);
        worker.setCurrentLongitude(longitude);
        worker.setLastLocationUpdate(LocalDateTime.now());
        
        workerRepository.save(worker);
    }
    
    /**
     * Helper class to store worker with distance
     */
    private static class WorkerDistance {
        private final Worker worker;
        private final double distance;
        
        public WorkerDistance(Worker worker, double distance) {
            this.worker = worker;
            this.distance = distance;
        }
        
        public Worker getWorker() {
            return worker;
        }
        
        public double getDistance() {
            return distance;
        }
    }
}
