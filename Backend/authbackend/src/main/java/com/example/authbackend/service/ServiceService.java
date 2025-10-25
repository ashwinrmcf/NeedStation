package com.example.authbackend.service;

import com.example.authbackend.dto.ServiceConfigDTO;
import com.example.authbackend.model.ServiceFormality;
import com.example.authbackend.model.SubService;
import com.example.authbackend.repository.ServiceFormalityRepository;
import com.example.authbackend.repository.ServiceRepository;
import com.example.authbackend.repository.SubServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private SubServiceRepository subServiceRepository;
    
    @Autowired
    private ServiceFormalityRepository serviceFormalityRepository;
    
    /**
     * Get complete service configuration including subservices and formalities
     */
    public ServiceConfigDTO getServiceConfiguration(String serviceCode) {
        System.out.println("🔍 Fetching service configuration for: " + serviceCode);
        com.example.authbackend.model.Service service = serviceRepository.findByServiceCodeNotDeleted(serviceCode)
                .orElseThrow(() -> new RuntimeException("Service not found: " + serviceCode));
        
        System.out.println("✅ Service found: ID=" + service.getId() + ", Name=" + service.getServiceName());
        System.out.println("📋 Fetching subservices for service ID: " + service.getId());
        
        // Get subservices
        List<SubService> subServices = subServiceRepository.findByServiceIdActive(service.getId());
        System.out.println("✅ Found " + subServices.size() + " subservices");
        
        // Get formalities
        List<ServiceFormality> formalities = serviceFormalityRepository.findByServiceIdNotDeleted(service.getId());
        
        // Convert to DTOs
        ServiceConfigDTO.ServiceDTO serviceDTO = new ServiceConfigDTO.ServiceDTO(
                service.getId(),
                service.getServiceName(),
                service.getServiceCode(),
                service.getDescription(),
                service.getBasePrice()
        );
        
        List<ServiceConfigDTO.SubServiceDTO> subServiceDTOs = subServices.stream()
                .map(ss -> new ServiceConfigDTO.SubServiceDTO(
                        ss.getId(),
                        ss.getSubServiceName(),
                        ss.getDescription(),
                        ss.getAdditionalPrice(),
                        0
                ))
                .collect(Collectors.toList());
        
        List<ServiceConfigDTO.ServiceFormalityDTO> formalityDTOs = formalities.stream()
                .map(sf -> new ServiceConfigDTO.ServiceFormalityDTO(
                        sf.getId(),
                        sf.getFormalityType(),
                        sf.getFieldName(),
                        sf.getFieldLabel(),
                        sf.getFieldType(),
                        sf.getIsRequired(),
                        sf.getOptions(),
                        sf.getPlaceholder(),
                        sf.getValidationRules(),
                        sf.getHelpText(),
                        0
                ))
                .collect(Collectors.toList());
        
        return new ServiceConfigDTO(serviceDTO, subServiceDTOs, formalityDTOs);
    }
    
    /**
     * Get all active services
     */
    public List<ServiceConfigDTO.ServiceDTO> getAllActiveServices() {
        List<com.example.authbackend.model.Service> services = serviceRepository.findAllActive();
        
        return services.stream()
                .map(s -> new ServiceConfigDTO.ServiceDTO(
                        s.getId(),
                        s.getServiceName(),
                        s.getServiceCode(),
                        s.getDescription(),
                        s.getBasePrice()
                ))
                .collect(Collectors.toList());
    }
    
    /**
     * Get service by ID
     */
    public com.example.authbackend.model.Service getServiceById(Long serviceId) {
        return serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + serviceId));
    }
    
    /**
     * Get subservice by ID
     */
    public SubService getSubServiceById(Long subServiceId) {
        return subServiceRepository.findById(subServiceId)
                .orElseThrow(() -> new RuntimeException("SubService not found with ID: " + subServiceId));
    }
    
    /**
     * Get formality by ID
     */
    public ServiceFormality getFormalityById(Long formalityId) {
        return serviceFormalityRepository.findById(formalityId)
                .orElseThrow(() -> new RuntimeException("Formality not found with ID: " + formalityId));
    }
    
    /**
     * Populate sub-services data for all services
     */
    public int populateSubServices() {
        int count = 0;
        
        // Clear existing sub-services
        subServiceRepository.deleteAll();
        
        // Define sub-services for each service
        String[][] subServicesData = {
            // Home Security Guard
            {"HOME_SECURITY_GUARD", "Day Shift Security", "12-hour day shift security guard", "0", "1"},
            {"HOME_SECURITY_GUARD", "Night Shift Security", "12-hour night shift security guard", "100", "2"},
            {"HOME_SECURITY_GUARD", "24/7 Security", "Round-the-clock security coverage", "300", "3"},
            {"HOME_SECURITY_GUARD", "Armed Security", "Armed security personnel for high-risk areas", "500", "4"},
            
            // Parkinsons Care
            {"PARKINSONS_CARE", "Medication Management", "Timely medication administration and tracking", "0", "1"},
            {"PARKINSONS_CARE", "Mobility Assistance", "Help with walking and movement exercises", "150", "2"},
            {"PARKINSONS_CARE", "Tremor Management", "Specialized care for tremor control", "200", "3"},
            {"PARKINSONS_CARE", "Speech Therapy Support", "Assistance with speech and swallowing difficulties", "250", "4"},
            
            // Bedridden Patient Care
            {"BEDRIDDEN_PATIENT_CARE", "Hygiene Care", "Bathing, grooming, and personal hygiene", "0", "1"},
            {"BEDRIDDEN_PATIENT_CARE", "Pressure Sore Prevention", "Regular repositioning and skin care", "200", "2"},
            {"BEDRIDDEN_PATIENT_CARE", "Feeding Assistance", "Help with meals and nutrition", "150", "3"},
            {"BEDRIDDEN_PATIENT_CARE", "Medical Monitoring", "Vital signs monitoring and health tracking", "300", "4"},
            
            // Mother and Baby Care
            {"MOTHER_BABY_CARE", "Newborn Care", "Complete care for newborns including bathing and feeding", "0", "1"},
            {"MOTHER_BABY_CARE", "Breastfeeding Support", "Lactation consultation and support", "150", "2"},
            {"MOTHER_BABY_CARE", "Postnatal Mother Care", "Care and support for new mothers", "200", "3"},
            {"MOTHER_BABY_CARE", "Baby Massage", "Therapeutic baby massage sessions", "100", "4"},
            
            // Paralysis Care
            {"PARALYSIS_CARE", "Physical Therapy", "Daily physiotherapy exercises", "0", "1"},
            {"PARALYSIS_CARE", "Occupational Therapy", "Activities to improve daily living skills", "200", "2"},
            {"PARALYSIS_CARE", "Bladder & Bowel Care", "Catheter care and bowel management", "250", "3"},
            {"PARALYSIS_CARE", "Emotional Support", "Counseling and emotional well-being support", "150", "4"},
            
            // Elderly Care
            {"ELDERLY_CARE", "Companionship", "Social interaction and companionship", "0", "1"},
            {"ELDERLY_CARE", "Medication Reminders", "Timely medication administration", "100", "2"},
            {"ELDERLY_CARE", "Meal Preparation", "Cooking nutritious meals", "150", "3"},
            {"ELDERLY_CARE", "Mobility Support", "Assistance with walking and movement", "200", "4"},
            
            // Nursing Care
            {"NURSING_CARE", "Wound Dressing", "Professional wound care and dressing", "0", "1"},
            {"NURSING_CARE", "IV Administration", "Intravenous medication administration", "300", "2"},
            {"NURSING_CARE", "Catheter Care", "Catheter insertion and maintenance", "250", "3"},
            {"NURSING_CARE", "Vital Signs Monitoring", "Regular monitoring of vital parameters", "150", "4"},
            
            // Pathology Care
            {"PATHOLOGY_CARE", "Blood Sample Collection", "Home blood sample collection", "0", "1"},
            {"PATHOLOGY_CARE", "Urine Sample Collection", "Home urine sample collection", "50", "2"},
            {"PATHOLOGY_CARE", "ECG at Home", "Electrocardiogram test at home", "200", "3"},
            {"PATHOLOGY_CARE", "X-Ray at Home", "Portable X-ray services", "500", "4"},
            
            // Diabetes Management
            {"DIABETES_MANAGEMENT", "Blood Sugar Monitoring", "Regular glucose level checking", "0", "1"},
            {"DIABETES_MANAGEMENT", "Insulin Administration", "Insulin injection assistance", "150", "2"},
            {"DIABETES_MANAGEMENT", "Diet Planning", "Diabetic diet consultation and planning", "200", "3"},
            {"DIABETES_MANAGEMENT", "Foot Care", "Diabetic foot care and monitoring", "100", "4"},
            
            // Health Check-up Services
            {"HEALTH_CHECKUP", "Basic Health Check", "Basic vitals and health assessment", "0", "1"},
            {"HEALTH_CHECKUP", "Comprehensive Check", "Detailed health screening", "300", "2"},
            {"HEALTH_CHECKUP", "Senior Citizen Package", "Specialized check-up for elderly", "400", "3"},
            {"HEALTH_CHECKUP", "Cardiac Screening", "Heart health assessment", "500", "4"},
            
            // Physiotherapy
            {"PHYSIOTHERAPY", "Pain Management", "Therapeutic exercises for pain relief", "0", "1"},
            {"PHYSIOTHERAPY", "Sports Injury Rehab", "Rehabilitation for sports injuries", "200", "2"},
            {"PHYSIOTHERAPY", "Post-Stroke Therapy", "Physiotherapy after stroke", "300", "3"},
            {"PHYSIOTHERAPY", "Arthritis Management", "Exercises for arthritis patients", "150", "4"},
            
            // Post-Surgery Care
            {"POST_SURGERY_CARE", "Wound Care", "Surgical wound cleaning and dressing", "0", "1"},
            {"POST_SURGERY_CARE", "Pain Management", "Post-operative pain relief support", "200", "2"},
            {"POST_SURGERY_CARE", "Mobility Assistance", "Help with movement after surgery", "150", "3"},
            {"POST_SURGERY_CARE", "Drain Care", "Surgical drain maintenance", "250", "4"},
            
            // Caretaker at Home
            {"CARETAKER_AT_HOME", "Daily Living Assistance", "Help with daily activities", "0", "1"},
            {"CARETAKER_AT_HOME", "Household Chores", "Light housekeeping and cleaning", "100", "2"},
            {"CARETAKER_AT_HOME", "Grocery Shopping", "Assistance with shopping and errands", "150", "3"},
            {"CARETAKER_AT_HOME", "Transportation Support", "Accompaniment to appointments", "200", "4"}
        };
        
        // Insert sub-services
        for (String[] data : subServicesData) {
            String serviceCode = data[0];
            String subServiceName = data[1];
            String description = data[2];
            java.math.BigDecimal additionalPrice = new java.math.BigDecimal(data[3]);
            Integer displayOrder = Integer.parseInt(data[4]);
            
            // Find service by code
            com.example.authbackend.model.Service service = serviceRepository.findByServiceCodeNotDeleted(serviceCode)
                    .orElseThrow(() -> new RuntimeException("Service not found: " + serviceCode));
            
            // Create sub-service
            SubService subService = new SubService();
            subService.setService(service);
            subService.setSubServiceName(subServiceName);
            subService.setDescription(description);
            subService.setAdditionalPrice(additionalPrice);
            // displayOrder field removed - not in database
            subService.setIsActive(true);
            
            subServiceRepository.save(subService);
            count++;
        }
        
        return count;
    }
}
