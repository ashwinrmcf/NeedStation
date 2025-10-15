package com.example.authbackend.controller;

import com.example.authbackend.dto.ServiceConfigDTO;
import com.example.authbackend.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {
    
    @Autowired
    private ServiceService serviceService;
    
    /**
     * Get all active services
     * GET /api/services
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllServices() {
        try {
            List<ServiceConfigDTO.ServiceDTO> services = serviceService.getAllActiveServices();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("services", services);
            response.put("count", services.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch services: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    /**
     * Get service configuration by service code
     * GET /api/services/{serviceCode}
     * 
     * Example: GET /api/services/ELDERLY_CARE
     * 
     * Returns: service details + subservices + formalities
     */
    @GetMapping("/{serviceCode}")
    public ResponseEntity<Map<String, Object>> getServiceConfiguration(@PathVariable String serviceCode) {
        try {
            ServiceConfigDTO config = serviceService.getServiceConfiguration(serviceCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("service", config.getService());
            response.put("subServices", config.getSubServices());
            response.put("formalities", config.getFormalities());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(404).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch service configuration: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
