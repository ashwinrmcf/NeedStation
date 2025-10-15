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
        com.example.authbackend.model.Service service = serviceRepository.findByServiceCodeNotDeleted(serviceCode)
                .orElseThrow(() -> new RuntimeException("Service not found: " + serviceCode));
        
        // Get subservices
        List<SubService> subServices = subServiceRepository.findByServiceIdActive(service.getId());
        
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
                        ss.getDisplayOrder()
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
                        sf.getDisplayOrder()
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
}
