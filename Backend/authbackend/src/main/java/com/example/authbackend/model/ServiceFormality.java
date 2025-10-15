package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_formalities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceFormality {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;
    
    @Column(name = "formality_type", nullable = false, length = 50)
    private String formalityType;
    
    @Column(name = "field_name", nullable = false, length = 100)
    private String fieldName;
    
    @Column(name = "field_label", nullable = false, length = 200)
    private String fieldLabel;
    
    @Column(name = "field_type", nullable = false, length = 50)
    private String fieldType; // TEXT, NUMBER, DATE, SELECT, CHECKBOX, TEXTAREA, RADIO
    
    @Column(name = "is_required")
    private Boolean isRequired = false;
    
    @Column(name = "options", columnDefinition = "TEXT")
    private String options; // JSON array for SELECT/CHECKBOX/RADIO
    
    @Column(name = "placeholder", length = 255)
    private String placeholder;
    
    @Column(name = "validation_rules", columnDefinition = "TEXT")
    private String validationRules; // JSON validation rules
    
    @Column(name = "help_text", length = 500)
    private String helpText;
    
    @Column(name = "display_order")
    private Integer displayOrder = 0;
    
    // Audit fields
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
