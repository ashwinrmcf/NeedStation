package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_sub_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingSubService {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingNew booking;
    
    @Column(name = "sub_service_id", nullable = false)
    private Long subServiceId;
    
    // Denormalized for performance
    @Column(name = "sub_service_name", length = 100)
    private String subServiceName;
    
    @Column(name = "quantity")
    private Integer quantity = 1;
    
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
