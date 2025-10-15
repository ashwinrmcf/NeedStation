package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking_formality_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingFormalityData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingNew booking;
    
    @Column(name = "formality_id", nullable = false)
    private Long formalityId;
    
    // Denormalized for performance
    @Column(name = "field_name", length = 100)
    private String fieldName;
    
    @Column(name = "field_label", length = 200)
    private String fieldLabel;
    
    @Column(name = "field_value", columnDefinition = "TEXT", nullable = false)
    private String fieldValue;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
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
