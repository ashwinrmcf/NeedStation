package com.example.authbackend.service;

import com.example.authbackend.dto.BookingDTO;
import com.example.authbackend.model.Booking;
import com.example.authbackend.model.BookingStatus;
import com.example.authbackend.model.Worker;
import com.example.authbackend.repository.BookingRepository;
import com.example.authbackend.repository.WorkerRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private WorkerRepository workerRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Create a new booking
    public BookingDTO createBooking(BookingDTO bookingDTO) {
        try {
            Booking booking = convertToEntity(bookingDTO);
            
            // Generate unique booking ID
            booking.setBookingId(generateBookingId());
            
            // Set initial status
            booking.setStatus(BookingStatus.PENDING);
            
            // Set timestamps
            booking.setCreatedAt(LocalDateTime.now());
            booking.setUpdatedAt(LocalDateTime.now());
            
            // Calculate estimated price based on service
            Double estimatedPrice = calculateEstimatedPrice(booking.getServiceName(), booking.getUrgency());
            booking.setEstimatedPrice(estimatedPrice);
            
            // Save booking
            Booking savedBooking = bookingRepository.save(booking);
            
            // Try to find and assign available worker
            tryAssignWorker(savedBooking);
            
            return convertToDTO(savedBooking);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to create booking: " + e.getMessage(), e);
        }
    }
    
    // Get booking by ID
    public Optional<BookingDTO> getBookingById(Long id) {
        return bookingRepository.findById(id).map(this::convertToDTO);
    }
    
    // Get booking by booking ID
    public Optional<BookingDTO> getBookingByBookingId(String bookingId) {
        return bookingRepository.findByBookingId(bookingId).map(this::convertToDTO);
    }
    
    // Get bookings by customer phone
    public List<BookingDTO> getBookingsByCustomerPhone(String customerPhone) {
        return bookingRepository.findByCustomerPhoneOrderByCreatedAtDesc(customerPhone)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get bookings by worker ID
    public List<BookingDTO> getBookingsByWorkerId(Long workerId) {
        return bookingRepository.findByAssignedWorkerIdOrderByCreatedAtDesc(workerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get bookings by status
    public List<BookingDTO> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Update booking status
    public BookingDTO updateBookingStatus(String bookingId, BookingStatus newStatus) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(newStatus);
            booking.setUpdatedAt(LocalDateTime.now());
            
            // Set completion time if completed
            if (newStatus == BookingStatus.COMPLETED) {
                booking.setCompletedAt(LocalDateTime.now());
            }
            
            Booking updatedBooking = bookingRepository.save(booking);
            return convertToDTO(updatedBooking);
        }
        throw new RuntimeException("Booking not found with ID: " + bookingId);
    }
    
    // Assign worker to booking
    public BookingDTO assignWorkerToBooking(String bookingId, Long workerId) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId);
        Optional<Worker> workerOpt = workerRepository.findById(workerId);
        
        if (bookingOpt.isPresent() && workerOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            Worker worker = workerOpt.get();
            
            booking.setAssignedWorkerId(workerId);
            booking.setWorkerName(worker.getFullName());
            booking.setWorkerPhone(worker.getPhone());
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setUpdatedAt(LocalDateTime.now());
            
            Booking updatedBooking = bookingRepository.save(booking);
            return convertToDTO(updatedBooking);
        }
        throw new RuntimeException("Booking or Worker not found");
    }
    
    // Cancel booking
    public BookingDTO cancelBooking(String bookingId, String reason) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setCancellationReason(reason);
            booking.setUpdatedAt(LocalDateTime.now());
            
            Booking updatedBooking = bookingRepository.save(booking);
            return convertToDTO(updatedBooking);
        }
        throw new RuntimeException("Booking not found with ID: " + bookingId);
    }
    
    // Get available bookings for a worker
    public List<BookingDTO> getAvailableBookingsForWorker(Long workerId) {
        Optional<Worker> workerOpt = workerRepository.findById(workerId);
        if (workerOpt.isPresent()) {
            Worker worker = workerOpt.get();
            
            // Parse worker's services
            List<String> workerServices = parseWorkerServices(worker.getServices());
            
            return bookingRepository.findAvailableBookingsForWorker(
                    workerServices, 
                    worker.getCity(), 
                    BookingStatus.PENDING
            ).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        }
        throw new RuntimeException("Worker not found with ID: " + workerId);
    }
    
    // Get bookings near location
    public List<BookingDTO> getBookingsNearLocation(Double latitude, Double longitude, Double radiusKm) {
        return bookingRepository.findBookingsNearLocation(latitude, longitude, radiusKm)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get booking statistics
    public Map<String, Long> getBookingStatistics() {
        return Map.of(
            "total", bookingRepository.count(),
            "pending", bookingRepository.countByStatus(BookingStatus.PENDING),
            "confirmed", bookingRepository.countByStatus(BookingStatus.CONFIRMED),
            "inProgress", bookingRepository.countByStatus(BookingStatus.IN_PROGRESS),
            "completed", bookingRepository.countByStatus(BookingStatus.COMPLETED),
            "cancelled", bookingRepository.countByStatus(BookingStatus.CANCELLED)
        );
    }
    
    // Private helper methods
    private String generateBookingId() {
        return "BK" + System.currentTimeMillis() + (int)(Math.random() * 1000);
    }
    
    private Double calculateEstimatedPrice(String serviceName, String urgency) {
        // Basic pricing logic - can be enhanced
        Double basePrice = 500.0; // Default base price
        
        // Service-specific pricing
        switch (serviceName.toLowerCase()) {
            case "elderly care":
            case "nursing care":
                basePrice = 800.0;
                break;
            case "physiotherapy":
                basePrice = 600.0;
                break;
            case "pathology care":
                basePrice = 300.0;
                break;
            default:
                basePrice = 500.0;
        }
        
        // Urgency multiplier
        if ("urgent".equals(urgency)) {
            basePrice *= 1.5;
        } else if ("emergency".equals(urgency)) {
            basePrice *= 2.0;
        }
        
        return basePrice;
    }
    
    private void tryAssignWorker(Booking booking) {
        try {
            // Find available workers for this service and location
            List<String> serviceList = List.of(booking.getServiceName());
            List<Booking> availableBookings = bookingRepository.findAvailableBookingsForWorker(
                serviceList, 
                booking.getCity(), 
                BookingStatus.PENDING
            );
            
            // Auto-assignment logic can be implemented here
            // For now, we'll leave it as PENDING for manual assignment
            
        } catch (Exception e) {
            // Log error but don't fail the booking creation
            System.err.println("Failed to auto-assign worker: " + e.getMessage());
        }
    }
    
    private List<String> parseWorkerServices(String servicesJson) {
        try {
            if (servicesJson == null || servicesJson.trim().isEmpty()) {
                return List.of();
            }
            
            Map<String, Object> servicesMap = objectMapper.readValue(servicesJson, Map.class);
            return servicesMap.entrySet().stream()
                    .filter(entry -> Boolean.TRUE.equals(entry.getValue()))
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return List.of();
        }
    }
    
    private Booking convertToEntity(BookingDTO dto) {
        Booking booking = new Booking();
        
        booking.setCustomerPhone(dto.getCustomerPhone());
        booking.setAlternatePhone(dto.getAlternatePhone());
        booking.setCustomerName(dto.getCustomerName());
        booking.setCustomerEmail(dto.getCustomerEmail());
        booking.setServiceName(dto.getServiceName());
        booking.setServiceCategory(dto.getServiceCategory());
        booking.setLatitude(dto.getLatitude());
        booking.setLongitude(dto.getLongitude());
        booking.setFullAddress(dto.getFullAddress());
        booking.setPincode(dto.getPincode());
        booking.setLandmark(dto.getLandmark());
        booking.setCity(dto.getCity());
        booking.setState(dto.getState());
        booking.setPreferredDate(dto.getPreferredDate());
        booking.setPreferredTime(dto.getPreferredTime());
        booking.setUrgency(dto.getUrgency());
        booking.setSpecialInstructions(dto.getSpecialInstructions());
        
        // Convert service details map to JSON string
        if (dto.getServiceDetails() != null) {
            try {
                booking.setServiceDetails(objectMapper.writeValueAsString(dto.getServiceDetails()));
            } catch (JsonProcessingException e) {
                booking.setServiceDetails("{}");
            }
        }
        
        return booking;
    }
    
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        
        dto.setId(booking.getId());
        dto.setBookingId(booking.getBookingId());
        dto.setCustomerPhone(booking.getCustomerPhone());
        dto.setAlternatePhone(booking.getAlternatePhone());
        dto.setCustomerName(booking.getCustomerName());
        dto.setCustomerEmail(booking.getCustomerEmail());
        dto.setServiceName(booking.getServiceName());
        dto.setServiceCategory(booking.getServiceCategory());
        dto.setLatitude(booking.getLatitude());
        dto.setLongitude(booking.getLongitude());
        dto.setFullAddress(booking.getFullAddress());
        dto.setPincode(booking.getPincode());
        dto.setLandmark(booking.getLandmark());
        dto.setCity(booking.getCity());
        dto.setState(booking.getState());
        dto.setPreferredDate(booking.getPreferredDate());
        dto.setPreferredTime(booking.getPreferredTime());
        dto.setUrgency(booking.getUrgency());
        dto.setStatus(booking.getStatus().toString());
        dto.setEstimatedPrice(booking.getEstimatedPrice());
        dto.setFinalPrice(booking.getFinalPrice());
        dto.setPaymentMethod(booking.getPaymentMethod());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setAssignedWorkerId(booking.getAssignedWorkerId());
        dto.setWorkerName(booking.getWorkerName());
        dto.setWorkerPhone(booking.getWorkerPhone());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        dto.setScheduledAt(booking.getScheduledAt());
        dto.setCompletedAt(booking.getCompletedAt());
        dto.setSpecialInstructions(booking.getSpecialInstructions());
        dto.setCancellationReason(booking.getCancellationReason());
        dto.setRating(booking.getRating());
        dto.setReview(booking.getReview());
        
        // Convert service details JSON string to map
        if (booking.getServiceDetails() != null && !booking.getServiceDetails().trim().isEmpty()) {
            try {
                dto.setServiceDetails(objectMapper.readValue(booking.getServiceDetails(), Map.class));
            } catch (JsonProcessingException e) {
                dto.setServiceDetails(Map.of());
            }
        }
        
        return dto;
    }
}
