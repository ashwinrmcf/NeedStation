package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceConfigDTO {
    private ServiceDTO service;
    private List<SubServiceDTO> subServices;
    private List<ServiceFormalityDTO> formalities;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceDTO {
        private Long id;
        private String serviceName;
        private String serviceCode;
        private String description;
        private BigDecimal basePrice;
        private String category;
        private String imageUrl;
        private String minicardImageUrl;
        private Boolean isActive;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubServiceDTO {
        private Long id;
        private String subServiceName;
        private String description;
        private BigDecimal additionalPrice;
        private Integer displayOrder;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceFormalityDTO {
        private Long id;
        private String formalityType;
        private String fieldName;
        private String fieldLabel;
        private String fieldType;
        private Boolean isRequired;
        private String options; // JSON string
        private String placeholder;
        private String validationRules; // JSON string
        private String helpText;
        private Integer displayOrder;
    }
}
