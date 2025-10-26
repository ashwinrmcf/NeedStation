package com.example.authbackend.service;

import com.example.authbackend.dto.BookingResponseDTO;
import com.example.authbackend.dto.CreateBookingDTO;
import com.example.authbackend.model.*;
import com.example.authbackend.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookingServiceNew {
    
    @Autowired
    private BookingNewRepository bookingRepository;
    
    @Autowired
    private BookingSubServiceRepository bookingSubServiceRepository;
    
    @Autowired
    private BookingFormalityDataRepository bookingFormalityDataRepository;
    
    @Autowired
    private ServiceFormalityRepository serviceFormalityRepository;
    
    @Autowired
    private ServiceService serviceService;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WorkerAssignmentService workerAssignmentService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Create a new booking
     */
    @Transactional
    public BookingResponseDTO createBooking(CreateBookingDTO dto) {
        try {
            System.out.println("📝 Creating booking for userId: " + dto.getUserId() + ", serviceId: " + dto.getServiceId());
            
            // 1. Get service details
            com.example.authbackend.model.Service service = serviceRepository.findById(dto.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Service not found with ID: " + dto.getServiceId()));
            System.out.println("✅ Service found: " + service.getServiceName());
            
            // 2. Get user details
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));
            System.out.println("✅ User found: " + user.getUsername());
            
            // 3. Calculate total amount
            BigDecimal totalAmount = calculateTotalAmount(service, dto.getSelectedSubServices());
            System.out.println("✅ Total amount calculated: " + totalAmount);
        
        // 4. Create booking record
        BookingNew booking = new BookingNew();
        booking.setUserId(dto.getUserId());
        booking.setServiceId(dto.getServiceId());
        
        // Denormalized fields (will be auto-filled by trigger, but set manually for safety)
        booking.setServiceName(service.getServiceName());
        booking.setServiceCode(service.getServiceCode());
        
        // Handle user name - fallback to username if fullName is null
        String userName = user.getFullName();
        if (userName == null || userName.trim().isEmpty()) {
            userName = user.getUsername();
        }
        booking.setUserName(userName);
        booking.setUserEmail(user.getEmail());
        
        // Contact & Location
        CreateBookingDTO.ContactInfo contact = dto.getContactInfo();
        booking.setPhone(contact.getPhone());
        booking.setAlternatePhone(contact.getAlternatePhone());
        booking.setFullAddress(contact.getFullAddress());
        booking.setLandmark(contact.getLandmark());
        booking.setCity(contact.getCity());
        booking.setState(contact.getState());
        booking.setPincode(contact.getPincode());
        booking.setLocationLat(contact.getLocationLat());
        booking.setLocationLng(contact.getLocationLng());
        booking.setLocationAddress(contact.getLocationAddress());
        
        // Scheduling
        CreateBookingDTO.Scheduling scheduling = dto.getScheduling();
        booking.setPreferredDate(scheduling.getPreferredDate());
        booking.setPreferredTime(scheduling.getPreferredTime());
        booking.setPreferredTimeSlot(scheduling.getPreferredTimeSlot());
        booking.setUrgency(scheduling.getUrgency());
        
        // Pricing
        booking.setBaseAmount(service.getBasePrice());
        booking.setAdditionalCharges(totalAmount.subtract(service.getBasePrice()));
        booking.setTotalAmount(totalAmount);
        
        // Status
        booking.setStatus("PENDING");
        booking.setPaymentStatus("PENDING");
        
        // Special instructions
        booking.setSpecialInstructions(dto.getSpecialInstructions());
        
        // Audit
        booking.setCreatedBy(dto.getUserId());
        
        // Generate booking number (format: BK-YYYYMMDD-XXXXX)
        String bookingNumber = generateBookingNumber();
        booking.setBookingNumber(bookingNumber);
        System.out.println("✅ Generated booking number: " + bookingNumber);
        
        // Save booking
        booking = bookingRepository.save(booking);
        System.out.println("✅ Booking saved with ID: " + booking.getId());
        
        // 5. Automatically find and notify available workers within 30km radius
        try {
            List<com.example.authbackend.model.Worker> availableWorkers = 
                workerAssignmentService.findAvailableWorkersForBooking(booking.getId());
            
            if (!availableWorkers.isEmpty()) {
                System.out.println("✅ Found " + availableWorkers.size() + " available workers within 30km radius");
                // TODO: Send notifications to all available workers
                // For now, workers will see this in their "Upcoming Tasks" page
                booking.setStatus("PENDING_WORKER_ASSIGNMENT");
            } else {
                System.out.println("⚠️ No available workers found within 30km radius");
                booking.setStatus("PENDING_WORKER_ASSIGNMENT");
            }
            bookingRepository.save(booking);
        } catch (Exception e) {
            System.err.println("⚠️ Error finding available workers: " + e.getMessage());
            // Continue with booking creation even if worker assignment fails
            booking.setStatus("PENDING_WORKER_ASSIGNMENT");
            bookingRepository.save(booking);
        }
        
        // 6. Create booking subservices
        List<String> subServiceNames = new ArrayList<>();
        if (dto.getSelectedSubServices() != null && !dto.getSelectedSubServices().isEmpty()) {
            for (Long subServiceId : dto.getSelectedSubServices()) {
                SubService subService = serviceService.getSubServiceById(subServiceId);
                
                BookingSubService bss = new BookingSubService();
                bss.setBooking(booking);
                bss.setSubServiceId(subServiceId);
                bss.setSubServiceName(subService.getSubServiceName());
                bss.setQuantity(1);
                bss.setPrice(subService.getAdditionalPrice());
                
                bookingSubServiceRepository.save(bss);
                subServiceNames.add(subService.getSubServiceName());
            }
        }
        
        // 6. Store formality data as JSON
        if (dto.getFormalityData() != null && !dto.getFormalityData().isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                String formalityJson = objectMapper.writeValueAsString(dto.getFormalityData());
                booking.setFormalityDataJson(formalityJson);
                booking.setFormalitySummary(formalityJson); // Keep for backward compatibility
            } catch (JsonProcessingException e) {
                System.err.println("❌ Error converting formality data to JSON: " + e.getMessage());
                // Continue without formality data rather than failing the entire booking
            }
        }
        
        // 7. Build response DTO
        BookingResponseDTO response = new BookingResponseDTO();
        response.setId(booking.getId());
        response.setBookingNumber(booking.getBookingNumber());
        response.setStatus(booking.getStatus());
        response.setPaymentStatus(booking.getPaymentStatus());
        response.setTotalAmount(booking.getTotalAmount());
        response.setPreferredDate(booking.getPreferredDate());
        response.setPreferredTime(booking.getPreferredTime());
        response.setPreferredTimeSlot(booking.getPreferredTimeSlot());
        response.setUrgency(booking.getUrgency());
        response.setCreatedAt(booking.getCreatedAt());
        response.setServiceName(booking.getServiceName());
        response.setServiceCode(booking.getServiceCode());
        response.setUserName(booking.getUserName());
        response.setPhone(booking.getPhone());
        response.setSubServices(subServiceNames);
        response.setSubservicesCount(subServiceNames.size());
        response.setFormalityData(dto.getFormalityData()); // Use original DTO data
        response.setFullAddress(booking.getFullAddress());
        response.setCity(booking.getCity());
        
        System.out.println("✅ Booking created successfully: " + response.getBookingNumber());
        return response;
        
        } catch (Exception e) {
            System.err.println("❌ Error creating booking: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create booking: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate unique booking number
     * Format: BK-YYYYMMDD-XXXXX (e.g., BK-20251017-00001)
     * 
     * Uses synchronized method to prevent race conditions
     */
    private synchronized String generateBookingNumber() {
        String datePrefix = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Try to generate a unique booking number with retry logic
        int maxRetries = 10;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            // Get count of bookings created today
            long todayCount = bookingRepository.countBookingsCreatedToday();
            
            // Generate sequential number (5 digits, zero-padded)
            String sequentialNumber = String.format("%05d", todayCount + attempt);
            String bookingNumber = "BK-" + datePrefix + "-" + sequentialNumber;
            
            // Check if this booking number already exists
            if (!bookingRepository.existsByBookingNumber(bookingNumber)) {
                return bookingNumber;
            }
            
            System.out.println("⚠️ Booking number collision detected, retrying... (attempt " + attempt + ")");
        }
        
        // Fallback: use timestamp-based unique number
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(7);
        return "BK-" + datePrefix + "-" + timestamp;
    }
    
    /**
     * Get user's bookings
     */
    public List<BookingResponseDTO> getUserBookings(Long userId) {
        List<BookingNew> bookings = bookingRepository.findByUserIdNotDeleted(userId);
        
        return bookings.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get booking by ID
     */
    public BookingResponseDTO getBookingById(Long bookingId) {
        BookingNew booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        return convertToDetailedResponseDTO(booking);
    }
    
    /**
     * Get booking by booking number
     */
    public BookingResponseDTO getBookingByNumber(String bookingNumber) {
        BookingNew booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        return convertToDetailedResponseDTO(booking);
    }
    
    /**
     * Confirm payment and update booking status
     */
    @Transactional
    public BookingResponseDTO confirmPayment(Long bookingId, String paymentMethod, String transactionId, java.math.BigDecimal paidAmount) {
        BookingNew booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Update payment details
        booking.setPaymentMethod(paymentMethod);
        booking.setTransactionId(transactionId);
        booking.setPaymentStatus("PAID");
        
        // Update booking status from DRAFT to CONFIRMED
        booking.setStatus("CONFIRMED");
        booking.setUpdatedAt(LocalDateTime.now());
        
        bookingRepository.save(booking);
        
        System.out.println("✅ Payment confirmed for booking: " + booking.getBookingNumber());
        
        return convertToDetailedResponseDTO(booking);
    }
    
    /**
     * Update booking status
     */
    @Transactional
    public BookingResponseDTO updateBookingStatus(Long bookingId, String status, Long updatedBy) {
        BookingNew booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        booking.setUpdatedBy(updatedBy);
        
        if ("COMPLETED".equals(status)) {
            booking.setCompletedAt(LocalDateTime.now());
        } else if ("CANCELLED".equals(status)) {
            booking.setCancelledAt(LocalDateTime.now());
            booking.setCancelledBy(updatedBy);
        } else if ("IN_PROGRESS".equals(status)) {
            booking.setStartedAt(LocalDateTime.now());
        }
        
        booking = bookingRepository.save(booking);
        
        return convertToResponseDTO(booking);
    }
    
    /**
     * Assign worker to booking
     */
    @Transactional
    public BookingResponseDTO assignWorker(Long bookingId, Long workerId, Long updatedBy) {
        BookingNew booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setAssignedWorkerId(workerId);
        booking.setStatus("ASSIGNED");
        booking.setUpdatedBy(updatedBy);
        
        booking = bookingRepository.save(booking);
        
        return convertToResponseDTO(booking);
    }
    
    /**
     * Rate booking
     */
    @Transactional
    public BookingResponseDTO rateBooking(Long bookingId, Integer rating, String feedback) {
        BookingNew booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!"COMPLETED".equals(booking.getStatus())) {
            throw new RuntimeException("Can only rate completed bookings");
        }
        
        booking.setCustomerRating(rating);
        booking.setCustomerFeedback(feedback);
        
        booking = bookingRepository.save(booking);
        
        return convertToResponseDTO(booking);
    }
    
    /**
     * Calculate total amount
     */
    private BigDecimal calculateTotalAmount(com.example.authbackend.model.Service service, List<Long> subServiceIds) {
        BigDecimal total = service.getBasePrice();
        
        if (subServiceIds != null && !subServiceIds.isEmpty()) {
            for (Long subServiceId : subServiceIds) {
                SubService subService = serviceService.getSubServiceById(subServiceId);
                total = total.add(subService.getAdditionalPrice());
            }
        }
        
        return total;
    }
    
    /**
     * Convert booking to response DTO (simple)
     */
    private BookingResponseDTO convertToResponseDTO(BookingNew booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingNumber(booking.getBookingNumber());
        dto.setStatus(booking.getStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setPreferredDate(booking.getPreferredDate());
        dto.setPreferredTime(booking.getPreferredTime());
        dto.setPreferredTimeSlot(booking.getPreferredTimeSlot());
        dto.setUrgency(booking.getUrgency());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setServiceName(booking.getServiceName());
        dto.setServiceCode(booking.getServiceCode());
        dto.setUserName(booking.getUserName());
        dto.setPhone(booking.getPhone());
        dto.setAssignedWorkerName(booking.getAssignedWorkerName());
        dto.setSubservicesCount(booking.getSubservicesCount());
        dto.setFullAddress(booking.getFullAddress());
        dto.setCity(booking.getCity());
        dto.setCustomerRating(booking.getCustomerRating());
        dto.setCustomerFeedback(booking.getCustomerFeedback());
        
        // Parse subservices summary
        if (booking.getSubservicesSummary() != null) {
            try {
                List<String> subServices = objectMapper.readValue(
                        booking.getSubservicesSummary(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)
                );
                dto.setSubServices(subServices);
            } catch (JsonProcessingException e) {
                dto.setSubServices(new ArrayList<>());
            }
        }
        
        return dto;
    }
    
    /**
     * Convert booking to detailed response DTO (with formality data)
     */
    private BookingResponseDTO convertToDetailedResponseDTO(BookingNew booking) {
        BookingResponseDTO dto = convertToResponseDTO(booking);
        
        // Get formality data from JSON column
        if (booking.getFormalityDataJson() != null && !booking.getFormalityDataJson().isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                @SuppressWarnings("unchecked")
                Map<String, String> formalityMap = objectMapper.readValue(
                    booking.getFormalityDataJson(), 
                    Map.class
                );
                dto.setFormalityData(formalityMap);
            } catch (JsonProcessingException e) {
                System.err.println("❌ Error parsing formality JSON: " + e.getMessage());
                dto.setFormalityData(new java.util.HashMap<>());
            }
        }
        
        // Get subservices
        List<BookingSubService> subServices = bookingSubServiceRepository.findByBookingId(booking.getId());
        List<String> subServiceNames = subServices.stream()
                .map(BookingSubService::getSubServiceName)
                .collect(Collectors.toList());
        dto.setSubServices(subServiceNames);
        
        return dto;
    }
}
