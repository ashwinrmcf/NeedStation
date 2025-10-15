# Booking System Architecture

## 🏗️ System Overview

The NeedStation booking system is designed as a comprehensive healthcare service platform with optimized database architecture, real-time data synchronization, and scalable API design.

### Core Components

1. **Service Management**
   - Dynamic service catalog
   - Configurable formality fields
   - Hierarchical subservice structure

2. **Booking Engine**
   - Multi-step booking flow
   - Real-time price calculation
   - Automatic data validation

3. **Data Layer**
   - Normalized relational database
   - Denormalized fields for performance
   - Automated triggers for consistency

4. **API Layer**
   - RESTful endpoints
   - Comprehensive DTOs
   - Error handling & validation

## 🗄️ Database Architecture

### Core Tables

#### 1. Services Table
```sql
CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
```

#### 2. Sub Services Table
```sql
CREATE TABLE sub_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,
    sub_service_name VARCHAR(100) NOT NULL,
    description TEXT,
    additional_price DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (service_id) REFERENCES services(id)
);
```

#### 3. Service Formalities Table
```sql
CREATE TABLE service_formalities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,
    formality_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_type ENUM('TEXT', 'NUMBER', 'SELECT', 'TEXTAREA', 'DATE', 'BOOLEAN') NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    options TEXT,
    placeholder VARCHAR(255),
    validation_rules TEXT,
    help_text TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (service_id) REFERENCES services(id)
);
```

#### 4. Bookings Table (Optimized)
```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Core References
    user_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    
    -- Denormalized Fields (Performance Optimization)
    service_name VARCHAR(100),
    service_code VARCHAR(50),
    user_name VARCHAR(200),
    user_email VARCHAR(255),
    
    -- Contact & Location
    phone VARCHAR(15) NOT NULL,
    alternate_phone VARCHAR(15),
    full_address TEXT NOT NULL,
    landmark VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_address TEXT,
    
    -- Scheduling
    preferred_date DATE,
    preferred_time TIME,
    preferred_time_slot VARCHAR(50),
    urgency ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') DEFAULT 'NORMAL',
    
    -- Pricing
    base_amount DECIMAL(10,2) NOT NULL,
    additional_charges DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status & Assignment
    status ENUM('PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    assigned_worker_id BIGINT,
    worker_name VARCHAR(200),
    
    -- Denormalized Summaries (Auto-updated by triggers)
    subservices_count INT DEFAULT 0,
    subservices_summary JSON,
    formality_summary JSON,
    
    -- Payment
    payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    
    -- Rating & Feedback
    rating DECIMAL(2,1),
    feedback TEXT,
    
    -- Special Instructions
    special_instructions TEXT,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    
    -- Indexes for Performance
    INDEX idx_user_id (user_id),
    INDEX idx_service_id (service_id),
    INDEX idx_status (status),
    INDEX idx_booking_number (booking_number),
    INDEX idx_preferred_date (preferred_date),
    INDEX idx_assigned_worker (assigned_worker_id),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);
```

#### 5. Booking Sub Services Table
```sql
CREATE TABLE booking_sub_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    sub_service_id BIGINT NOT NULL,
    sub_service_name VARCHAR(100), -- Denormalized
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id)
);
```

#### 6. Booking Formality Data Table
```sql
CREATE TABLE booking_formality_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    formality_id BIGINT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL, -- Denormalized
    field_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (formality_id) REFERENCES service_formalities(id),
    INDEX idx_booking_id (booking_id)
);
```

## 🔄 Data Synchronization

### Automatic Triggers

#### 1. Booking Number Generation
```sql
DELIMITER //
CREATE TRIGGER generate_booking_number
    BEFORE INSERT ON bookings
    FOR EACH ROW
BEGIN
    IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
        SET NEW.booking_number = CONCAT('BK', DATE_FORMAT(NOW(), '%Y%m%d'), 
                                       LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(booking_number, 11) AS UNSIGNED)), 0) + 1 
                                             FROM bookings 
                                             WHERE DATE(created_at) = CURDATE()), 3, '0'));
    END IF;
END//
DELIMITER ;
```

#### 2. Subservices Summary Update
```sql
DELIMITER //
CREATE TRIGGER update_subservices_summary
    AFTER INSERT ON booking_sub_services
    FOR EACH ROW
BEGIN
    UPDATE bookings 
    SET subservices_count = (
            SELECT COUNT(*) 
            FROM booking_sub_services 
            WHERE booking_id = NEW.booking_id
        ),
        subservices_summary = (
            SELECT JSON_ARRAYAGG(sub_service_name)
            FROM booking_sub_services 
            WHERE booking_id = NEW.booking_id
        )
    WHERE id = NEW.booking_id;
END//
DELIMITER ;
```

#### 3. Formality Summary Update
```sql
DELIMITER //
CREATE TRIGGER update_formality_summary
    AFTER INSERT ON booking_formality_data
    FOR EACH ROW
BEGIN
    UPDATE bookings 
    SET formality_summary = (
            SELECT JSON_OBJECTAGG(field_name, field_value)
            FROM booking_formality_data 
            WHERE booking_id = NEW.booking_id
        )
    WHERE id = NEW.booking_id;
END//
DELIMITER ;
```

## 📊 Performance Optimization

### Database Views

#### 1. Booking List View
```sql
CREATE VIEW v_booking_list AS
SELECT 
    b.id,
    b.booking_number,
    b.service_name,
    b.user_name,
    b.phone,
    b.status,
    b.total_amount,
    b.preferred_date,
    b.created_at,
    b.subservices_count
FROM bookings b
WHERE b.status != 'CANCELLED'
ORDER BY b.created_at DESC;
```

#### 2. Service Statistics View
```sql
CREATE VIEW v_service_statistics AS
SELECT 
    s.service_name,
    s.service_code,
    COUNT(b.id) as total_bookings,
    AVG(b.total_amount) as avg_amount,
    COUNT(CASE WHEN b.status = 'COMPLETED' THEN 1 END) as completed_bookings,
    AVG(CASE WHEN b.rating IS NOT NULL THEN b.rating END) as avg_rating
FROM services s
LEFT JOIN bookings b ON s.id = b.service_id
WHERE s.is_active = TRUE AND s.is_deleted = FALSE
GROUP BY s.id, s.service_name, s.service_code;
```

### Indexes Strategy

1. **Primary Indexes**: All tables have optimized primary keys
2. **Foreign Key Indexes**: All foreign keys are indexed
3. **Query-Specific Indexes**: Based on common query patterns
4. **Composite Indexes**: For multi-column queries

## 🔌 API Architecture

### RESTful Endpoints

#### Service Management
- `GET /api/services` - List all active services
- `GET /api/services/{serviceCode}` - Get service configuration

#### Booking Management
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/{userId}` - Get user's bookings
- `GET /api/bookings/{bookingId}` - Get booking details
- `PUT /api/bookings/{bookingId}/status` - Update booking status
- `PUT /api/bookings/{bookingId}/assign` - Assign worker
- `POST /api/bookings/{bookingId}/rate` - Rate completed booking

### Data Transfer Objects (DTOs)

#### ServiceConfigDTO
```java
public class ServiceConfigDTO {
    private ServiceDTO service;
    private List<SubServiceDTO> subServices;
    private List<ServiceFormalityDTO> formalities;
    
    // Nested DTOs for clean structure
}
```

#### CreateBookingDTO
```java
public class CreateBookingDTO {
    private Long userId;
    private Long serviceId;
    private ContactInfo contactInfo;
    private Scheduling scheduling;
    private List<Long> selectedSubServices;
    private Map<String, String> formalityData;
    private String specialInstructions;
}
```

## 🔒 Security & Validation

### Input Validation
- All DTOs have validation annotations
- Phone number format validation
- Email format validation
- Required field validation

### Data Integrity
- Foreign key constraints
- Check constraints for enums
- Unique constraints where needed
- Soft delete implementation

### Error Handling
- Comprehensive exception handling
- Meaningful error messages
- HTTP status code mapping
- Logging for debugging

## 📈 Scalability Considerations

### Database Scaling
- Read replicas for reporting queries
- Connection pooling optimization
- Query optimization with indexes
- Partitioning strategy for large tables

### Application Scaling
- Stateless service design
- Caching strategy for service configurations
- Asynchronous processing for heavy operations
- Load balancing ready architecture

### Monitoring & Observability
- Database performance monitoring
- API response time tracking
- Error rate monitoring
- Business metrics tracking

## 🔄 Migration Strategy

### Flyway Integration
- Version-controlled database changes
- Rollback capabilities
- Environment-specific configurations
- Automated deployment pipeline

### Data Migration
- Gradual migration from old system
- Data validation scripts
- Rollback procedures
- Performance impact assessment

---

This architecture provides a solid foundation for the NeedStation booking system with emphasis on performance, scalability, and maintainability.
