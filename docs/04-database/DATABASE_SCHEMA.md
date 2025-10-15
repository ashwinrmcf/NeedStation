# Database Schema Documentation

## 📊 Overview

The NeedStation database is designed with a focus on performance, scalability, and data integrity. It uses a hybrid approach combining normalized relational design with strategic denormalization for optimal read performance.

## 🏗️ Architecture Principles

### 1. Normalized Core Structure
- Eliminates data redundancy
- Ensures data integrity
- Supports complex relationships
- Enables flexible querying

### 2. Strategic Denormalization
- Improves read performance
- Reduces complex joins
- Enables faster reporting
- Maintained via triggers

### 3. Performance Optimization
- Comprehensive indexing strategy
- Database views for complex queries
- Automated triggers for data sync
- Connection pooling

## 📋 Core Tables

### 1. services
**Purpose:** Master catalog of all available services

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
    is_deleted BOOLEAN DEFAULT FALSE,
    
    INDEX idx_service_code (service_code),
    INDEX idx_active (is_active, is_deleted),
    INDEX idx_display_order (display_order)
);
```

**Sample Data:**
```sql
INSERT INTO services VALUES
(1, 'Home Security Guard', 'HOME_SECURITY_GUARD', 'Professional security services', 800.00, TRUE, 1),
(2, 'Elderly Care', 'ELDERLY_CARE', 'Comprehensive elderly care services', 900.00, TRUE, 2),
(3, 'Nursing Care', 'NURSING_CARE', 'Professional nursing services', 1200.00, TRUE, 3);
```

### 2. sub_services
**Purpose:** Additional services that can be added to main services

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
    
    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_service_id (service_id),
    INDEX idx_active (is_active),
    INDEX idx_display_order (display_order)
);
```

**Sample Data:**
```sql
INSERT INTO sub_services VALUES
(1, 1, 'Day Shift Security', 'Security during day hours', 0.00, TRUE, 1),
(2, 1, 'Night Shift Security', 'Security during night hours', 200.00, TRUE, 2),
(3, 1, 'Armed Security', 'Security with licensed weapons', 300.00, TRUE, 3),
(4, 2, 'Medication Management', 'Help with medication schedules', 150.00, TRUE, 1),
(5, 2, 'Meal Preparation', 'Nutritious meal preparation', 200.00, TRUE, 2);
```

### 3. service_formalities
**Purpose:** Dynamic form fields for each service

```sql
CREATE TABLE service_formalities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,
    formality_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_type ENUM('TEXT', 'NUMBER', 'SELECT', 'TEXTAREA', 'DATE', 'BOOLEAN') NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    options TEXT, -- JSON array for SELECT fields
    placeholder VARCHAR(255),
    validation_rules TEXT, -- JSON object with validation rules
    help_text TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_service_id (service_id),
    INDEX idx_formality_type (formality_type),
    INDEX idx_display_order (display_order),
    INDEX idx_not_deleted (is_deleted)
);
```

**Sample Data:**
```sql
INSERT INTO service_formalities VALUES
(1, 2, 'patient_info', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 0, "max": 120}', 'Age of the person requiring care', 1),
(2, 2, 'patient_info', 'medical_conditions', 'Medical Conditions', 'TEXTAREA', FALSE, NULL, 'List any medical conditions', NULL, 'Any existing medical conditions or allergies', 2),
(3, 2, 'care_preferences', 'mobility_level', 'Mobility Level', 'SELECT', TRUE, '["independent", "assisted", "wheelchair", "bedridden"]', NULL, NULL, 'Current mobility status of patient', 3);
```

### 4. bookings (Optimized)
**Purpose:** Main booking records with denormalized fields for performance

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
    INDEX idx_payment_status (payment_status),
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);
```

### 5. booking_sub_services
**Purpose:** Junction table for selected subservices with denormalized data

```sql
CREATE TABLE booking_sub_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    sub_service_id BIGINT NOT NULL,
    sub_service_name VARCHAR(100), -- Denormalized for performance
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_sub_service_id (sub_service_id)
);
```

### 6. booking_formality_data
**Purpose:** Stores user responses to dynamic form fields

```sql
CREATE TABLE booking_formality_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    formality_id BIGINT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL, -- Denormalized for reporting
    field_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (formality_id) REFERENCES service_formalities(id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_formality_id (formality_id),
    INDEX idx_field_name (field_name)
);
```

## 🔄 Database Triggers

### 1. Booking Number Generation
Automatically generates unique booking numbers in format: BK{YYYYMMDD}{001}

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

### 2. Subservices Summary Update
Updates denormalized fields when subservices are added/removed

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
        ),
        additional_charges = (
            SELECT COALESCE(SUM(price * quantity), 0)
            FROM booking_sub_services 
            WHERE booking_id = NEW.booking_id
        )
    WHERE id = NEW.booking_id;
    
    -- Update total amount
    UPDATE bookings 
    SET total_amount = base_amount + additional_charges
    WHERE id = NEW.booking_id;
END//
DELIMITER ;
```

### 3. Formality Summary Update
Updates formality summary when form data is saved

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

## 📊 Database Views

### 1. v_booking_list
Optimized view for booking listings

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
    b.subservices_count,
    CASE 
        WHEN b.status = 'PENDING' THEN 'Waiting for confirmation'
        WHEN b.status = 'CONFIRMED' THEN 'Confirmed, awaiting assignment'
        WHEN b.status = 'ASSIGNED' THEN CONCAT('Assigned to ', b.worker_name)
        WHEN b.status = 'IN_PROGRESS' THEN 'Service in progress'
        WHEN b.status = 'COMPLETED' THEN 'Service completed'
        WHEN b.status = 'CANCELLED' THEN 'Cancelled'
    END as status_description
FROM bookings b
WHERE b.status != 'CANCELLED'
ORDER BY b.created_at DESC;
```

### 2. v_booking_details
Complete booking information with related data

```sql
CREATE VIEW v_booking_details AS
SELECT 
    b.*,
    s.description as service_description,
    GROUP_CONCAT(DISTINCT bss.sub_service_name SEPARATOR ', ') as selected_subservices,
    COUNT(DISTINCT bss.id) as subservice_count,
    SUM(bss.price * bss.quantity) as subservices_total
FROM bookings b
LEFT JOIN services s ON b.service_id = s.id
LEFT JOIN booking_sub_services bss ON b.id = bss.booking_id
GROUP BY b.id;
```

### 3. v_service_statistics
Service performance metrics

```sql
CREATE VIEW v_service_statistics AS
SELECT 
    s.service_name,
    s.service_code,
    s.base_price,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'COMPLETED' THEN 1 END) as completed_bookings,
    COUNT(CASE WHEN b.status = 'CANCELLED' THEN 1 END) as cancelled_bookings,
    AVG(b.total_amount) as avg_booking_amount,
    AVG(CASE WHEN b.rating IS NOT NULL THEN b.rating END) as avg_rating,
    SUM(b.total_amount) as total_revenue
FROM services s
LEFT JOIN bookings b ON s.id = b.service_id
WHERE s.is_active = TRUE AND s.is_deleted = FALSE
GROUP BY s.id, s.service_name, s.service_code, s.base_price
ORDER BY total_bookings DESC;
```

### 4. v_user_booking_summary
User booking history and preferences

```sql
CREATE VIEW v_user_booking_summary AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    u.email,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'COMPLETED' THEN 1 END) as completed_bookings,
    AVG(CASE WHEN b.rating IS NOT NULL THEN b.rating END) as avg_rating_given,
    SUM(b.total_amount) as total_spent,
    MAX(b.created_at) as last_booking_date,
    GROUP_CONCAT(DISTINCT b.service_name SEPARATOR ', ') as preferred_services
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
GROUP BY u.id, u.name, u.email;
```

### 5. v_daily_revenue
Daily revenue tracking

```sql
CREATE VIEW v_daily_revenue AS
SELECT 
    DATE(created_at) as booking_date,
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_bookings,
    SUM(total_amount) as total_revenue,
    SUM(CASE WHEN status = 'COMPLETED' THEN total_amount ELSE 0 END) as confirmed_revenue,
    AVG(total_amount) as avg_booking_value
FROM bookings
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY booking_date DESC;
```

## 🔍 Indexing Strategy

### Primary Indexes
- All tables have optimized primary keys
- Auto-incrementing BIGINT for scalability

### Foreign Key Indexes
- All foreign key columns are indexed
- Supports efficient joins and cascading operations

### Query-Specific Indexes
- `bookings.status` - For filtering by booking status
- `bookings.preferred_date` - For date-based queries
- `bookings.created_at` - For chronological sorting
- `service_formalities.service_id` - For form field lookups

### Composite Indexes
- `services(is_active, is_deleted)` - For active service queries
- `bookings(user_id, status)` - For user-specific status queries

## 📈 Performance Metrics

### Query Performance Targets
- Simple lookups: < 10ms
- Complex joins: < 50ms
- Reporting queries: < 200ms
- Bulk operations: < 1s

### Storage Estimates
- Services: ~1KB per service (13 services = ~13KB)
- Subservices: ~500B per subservice (52 subservices = ~26KB)
- Formalities: ~300B per formality (52 formalities = ~16KB)
- Bookings: ~2KB per booking
- Booking data: ~100B per formality response

### Scalability Projections
- **1,000 bookings/month**: ~2MB additional storage
- **10,000 bookings/month**: ~20MB additional storage
- **100,000 bookings/month**: ~200MB additional storage

## 🔧 Maintenance Procedures

### Regular Maintenance Tasks

#### Daily
```sql
-- Check for failed bookings
SELECT COUNT(*) FROM bookings WHERE status = 'PENDING' AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- Monitor storage usage
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.tables 
WHERE table_schema = 'needstation'
ORDER BY (data_length + index_length) DESC;
```

#### Weekly
```sql
-- Analyze table performance
ANALYZE TABLE bookings, booking_sub_services, booking_formality_data;

-- Check index usage
SELECT 
    table_name,
    index_name,
    cardinality
FROM information_schema.statistics 
WHERE table_schema = 'needstation'
ORDER BY cardinality DESC;
```

#### Monthly
```sql
-- Archive old completed bookings (older than 1 year)
CREATE TABLE bookings_archive AS 
SELECT * FROM bookings 
WHERE status = 'COMPLETED' AND completed_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Clean up old data
DELETE FROM bookings 
WHERE status = 'COMPLETED' AND completed_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### Backup Strategy
1. **Daily**: Incremental backups of transaction data
2. **Weekly**: Full database backup
3. **Monthly**: Archive to long-term storage
4. **Testing**: Monthly restore testing

## 🔒 Security Considerations

### Data Protection
- Personal information encrypted at rest
- Payment data tokenized
- Location data anonymized for analytics

### Access Control
- Role-based database access
- Principle of least privilege
- Regular access reviews

### Audit Trail
- All data modifications logged
- User access tracked
- Suspicious activity monitoring

---

## 📋 Migration History

### V7: Create Services Table
- Initial service catalog structure
- Pre-populated with 13 core services
- Optimized indexes for performance

### V8: Create Sub Services Table
- Subservice catalog with pricing
- 52 pre-populated subservices
- Linked to main services

### V9: Create Service Formalities Table
- Dynamic form field definitions
- Support for multiple field types
- Validation rules and help text

### V10: Create Bookings Table
- Optimized booking structure
- Denormalized fields for performance
- Comprehensive indexing

### V11: Create Booking Sub Services Table
- Junction table for selected subservices
- Automatic pricing calculation
- Trigger-based summary updates

### V12: Create Booking Formality Data Table
- User form responses storage
- Flexible data structure
- Automatic summary generation

### V13: Create Booking Views
- Performance-optimized views
- Business intelligence queries
- Reporting and analytics support

---

**Last Updated:** October 16, 2025  
**Schema Version:** V13  
**Next Review:** November 16, 2025
