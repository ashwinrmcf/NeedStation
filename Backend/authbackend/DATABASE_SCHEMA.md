# NeedStation Database Schema Documentation

## Overview
NeedStation is a platform that connects service agencies with customers requiring various healthcare and security services. The system supports multiple user roles with different access levels.

## User Roles & Access Control

### 1. Super Admin (Platform Owner)
- **Access**: Full read/write access to all tables
- **Capabilities**: 
  - Manage agencies, workers, users
  - View all financial transactions
  - Generate platform-wide reports
  - Configure service categories and pricing
  - Handle disputes and refunds

### 2. Agency Admin
- **Access**: Read access to their agency data, limited write access
- **Capabilities**:
  - View their workers and bookings
  - View payment reports for their agency
  - Update agency profile
  - Cannot modify financial records or platform settings

### 3. Workers
- **Access**: Read access to assigned bookings
- **Capabilities**:
  - View assigned service requests
  - Update booking status
  - View their earnings
  - Update availability status

### 4. Customers
- **Access**: Own profile and bookings
- **Capabilities**:
  - Book services
  - View booking history
  - Make payments
  - Provide feedback

## Core Database Tables

### 1. agencies
```sql
CREATE TABLE agencies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agency_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    agency_type ENUM('healthcare', 'security', 'mixed') NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Business Details
    gst_number VARCHAR(20),
    pan_number VARCHAR(20),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    
    -- Platform Details
    commission_percentage DECIMAL(5, 2) DEFAULT 15.00,
    registration_status ENUM('pending', 'approved', 'suspended', 'rejected') DEFAULT 'pending',
    verification_documents JSON,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_bookings INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    approved_by BIGINT,
    
    INDEX idx_city (city),
    INDEX idx_status (registration_status),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

### 2. workers
```sql
CREATE TABLE workers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agency_id BIGINT NOT NULL,
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) UNIQUE NOT NULL,
    alternate_phone VARCHAR(20),
    gender ENUM('male', 'female', 'other') NOT NULL,
    date_of_birth DATE NOT NULL,
    
    -- Address
    current_address TEXT NOT NULL,
    permanent_address TEXT,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    
    -- Professional Information
    worker_type ENUM('nurse', 'caretaker', 'security_guard', 'physiotherapist', 'pathologist') NOT NULL,
    experience_years INT DEFAULT 0,
    specializations JSON, -- Array of specialization IDs
    languages JSON, -- Array of languages
    education_qualification VARCHAR(255),
    certifications JSON,
    
    -- Verification
    aadhar_number VARCHAR(20) UNIQUE,
    pan_number VARCHAR(20),
    police_verification_status ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
    medical_certificate_status ENUM('pending', 'verified', 'failed', 'not_required') DEFAULT 'pending',
    
    -- Platform Details
    profile_image_url VARCHAR(500),
    availability_status ENUM('available', 'busy', 'offline') DEFAULT 'available',
    service_radius_km INT DEFAULT 10,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_bookings INT DEFAULT 0,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_number VARCHAR(20),
    emergency_contact_relation VARCHAR(100),
    
    -- Status
    registration_status ENUM('pending', 'active', 'suspended', 'terminated') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_agency (agency_id),
    INDEX idx_phone (phone),
    INDEX idx_worker_type (worker_type),
    INDEX idx_availability (availability_status),
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);
```

### 3. service_categories
```sql
CREATE TABLE service_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
);

-- Insert main service categories
INSERT INTO service_categories (category_name, category_code) VALUES
('Home Security Guard', 'security_guard'),
('Parkinson\'s Care', 'parkinsons_care'),
('Bedridden Patient Care', 'bedridden_care'),
('Mother and Baby Care', 'mother_baby_care'),
('Paralysis Care', 'paralysis_care'),
('Elderly Care', 'elderly_care'),
('Nursing Care', 'nursing_care'),
('Pathology Care', 'pathology_care'),
('Diabetes Management', 'diabetes_mgmt'),
('Health Check-up Services', 'health_checkup'),
('Physiotherapy', 'physiotherapy'),
('Post Surgery Care', 'post_surgery_care'),
('Caretaker at Home', 'home_caretaker');
```

### 4. service_subcategories
```sql
CREATE TABLE service_subcategories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    subcategory_name VARCHAR(255) NOT NULL,
    subcategory_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Service Details
    min_duration_hours INT DEFAULT 1,
    max_duration_hours INT DEFAULT 720, -- 30 days
    base_price_per_hour DECIMAL(10, 2),
    base_price_per_day DECIMAL(10, 2),
    base_price_per_month DECIMAL(10, 2),
    
    -- Requirements
    requires_medical_info BOOLEAN DEFAULT FALSE,
    requires_prescription BOOLEAN DEFAULT FALSE,
    requires_emergency_contact BOOLEAN DEFAULT TRUE,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category (category_id),
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE
);

-- Example subcategories
INSERT INTO service_subcategories (category_id, subcategory_name, subcategory_code, base_price_per_hour) VALUES
-- Security Guard subcategories
(1, 'Corporate Security', 'security_corporate', 150.00),
(1, 'Domestic Security', 'security_domestic', 120.00),
(1, 'On-Demand Security', 'security_ondemand', 200.00),
(1, 'Event Security', 'security_event', 180.00),

-- Elderly Care subcategories
(6, 'Companion Care', 'elderly_companion', 100.00),
(6, 'Dementia Care', 'elderly_dementia', 150.00),
(6, 'Daily Living Assistance', 'elderly_daily', 120.00),
(6, 'Medical Monitoring', 'elderly_medical', 180.00);
```

### 5. service_form_fields
```sql
CREATE TABLE service_form_fields (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    subcategory_id BIGINT NOT NULL,
    field_name VARCHAR(255) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type ENUM('text', 'textarea', 'number', 'date', 'select', 'radio', 'checkbox', 'file') NOT NULL,
    field_options JSON, -- For select/radio options
    is_required BOOLEAN DEFAULT FALSE,
    validation_rules JSON,
    placeholder_text VARCHAR(255),
    help_text TEXT,
    display_order INT DEFAULT 0,
    
    INDEX idx_subcategory (subcategory_id),
    FOREIGN KEY (subcategory_id) REFERENCES service_subcategories(id) ON DELETE CASCADE
);

-- Example form fields for Paralysis Care
INSERT INTO service_form_fields (subcategory_id, field_name, field_label, field_type, is_required) VALUES
-- Assuming paralysis care subcategory has id = 10
(10, 'paralysis_type', 'Type of Paralysis', 'select', TRUE),
(10, 'paralysis_duration', 'How long has the patient been paralyzed?', 'text', TRUE),
(10, 'mobility_level', 'Current Mobility Level', 'select', TRUE),
(10, 'medical_equipment', 'Medical Equipment at Home', 'checkbox', FALSE),
(10, 'physician_name', 'Treating Physician Name', 'text', TRUE),
(10, 'medications', 'Current Medications', 'textarea', TRUE),
(10, 'special_requirements', 'Special Care Requirements', 'textarea', FALSE),
(10, 'medical_reports', 'Upload Medical Reports', 'file', FALSE);
```

### 6. users (Customers)
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    profile_image_url VARCHAR(500),
    
    -- Address Information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    landmark VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Account Status
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    account_status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
    
    -- Preferences
    preferred_language VARCHAR(10) DEFAULT 'en',
    notification_preferences JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);
```

### 7. bookings
```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Parties Involved
    user_id BIGINT NOT NULL,
    worker_id BIGINT,
    agency_id BIGINT NOT NULL,
    subcategory_id BIGINT NOT NULL,
    
    -- Service Details
    service_type ENUM('hourly', 'daily', 'monthly') NOT NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE NOT NULL,
    end_time TIME NOT NULL,
    total_hours INT,
    
    -- Location
    service_address TEXT NOT NULL,
    service_city VARCHAR(100) NOT NULL,
    service_pincode VARCHAR(10) NOT NULL,
    service_latitude DECIMAL(10, 8),
    service_longitude DECIMAL(11, 8),
    
    -- Patient/Service Information
    patient_name VARCHAR(255),
    patient_age INT,
    patient_gender ENUM('male', 'female', 'other'),
    service_requirements JSON, -- Stores form field responses
    special_instructions TEXT,
    
    -- Emergency Contact for this booking
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    
    -- Financial
    base_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    agency_commission DECIMAL(10, 2) NOT NULL,
    gst_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Status
    booking_status ENUM('pending', 'confirmed', 'assigned', 'ongoing', 'completed', 'cancelled', 'disputed') DEFAULT 'pending',
    payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
    
    -- Assignment
    assigned_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    cancelled_by ENUM('user', 'worker', 'agency', 'admin'),
    
    -- Ratings & Feedback
    user_rating INT,
    user_feedback TEXT,
    worker_rating INT,
    worker_feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_worker (worker_id),
    INDEX idx_agency (agency_id),
    INDEX idx_status (booking_status),
    INDEX idx_date (start_date),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (worker_id) REFERENCES workers(id),
    FOREIGN KEY (agency_id) REFERENCES agencies(id),
    FOREIGN KEY (subcategory_id) REFERENCES service_subcategories(id)
);
```

### 8. worker_service_mappings
```sql
CREATE TABLE worker_service_mappings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    worker_id BIGINT NOT NULL,
    subcategory_id BIGINT NOT NULL,
    is_primary_service BOOLEAN DEFAULT FALSE,
    experience_in_service INT DEFAULT 0, -- Years of experience in this specific service
    certification_for_service JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_worker_service (worker_id, subcategory_id),
    INDEX idx_worker (worker_id),
    INDEX idx_subcategory (subcategory_id),
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES service_subcategories(id) ON DELETE CASCADE
);
```

### 9. worker_availability
```sql
CREATE TABLE worker_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    worker_id BIGINT NOT NULL,
    
    -- Availability Schedule
    monday BOOLEAN DEFAULT TRUE,
    tuesday BOOLEAN DEFAULT TRUE,
    wednesday BOOLEAN DEFAULT TRUE,
    thursday BOOLEAN DEFAULT TRUE,
    friday BOOLEAN DEFAULT TRUE,
    saturday BOOLEAN DEFAULT TRUE,
    sunday BOOLEAN DEFAULT FALSE,
    
    -- Time Slots
    morning_shift BOOLEAN DEFAULT TRUE, -- 6 AM - 2 PM
    afternoon_shift BOOLEAN DEFAULT TRUE, -- 2 PM - 10 PM
    night_shift BOOLEAN DEFAULT FALSE, -- 10 PM - 6 AM
    
    -- Leave/Unavailability
    on_leave_from DATE,
    on_leave_to DATE,
    leave_reason VARCHAR(255),
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_worker (worker_id),
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);
```

### 10. payments
```sql
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    booking_id BIGINT NOT NULL,
    
    -- Payment Details
    payment_method ENUM('online', 'cash', 'bank_transfer', 'upi', 'card') NOT NULL,
    payment_gateway VARCHAR(50), -- razorpay, paytm, etc.
    gateway_transaction_id VARCHAR(255),
    
    -- Amounts
    amount DECIMAL(10, 2) NOT NULL,
    gateway_fee DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(10, 2) NOT NULL,
    
    -- Status
    payment_status ENUM('initiated', 'processing', 'success', 'failed', 'refunded') NOT NULL,
    payment_date TIMESTAMP NULL,
    
    -- Refund Information
    refund_amount DECIMAL(10, 2),
    refund_reason TEXT,
    refund_date TIMESTAMP NULL,
    refund_transaction_id VARCHAR(255),
    
    -- Additional Info
    payment_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_booking (booking_id),
    INDEX idx_transaction (transaction_id),
    INDEX idx_status (payment_status),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

### 11. agency_payments
```sql
CREATE TABLE agency_payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agency_id BIGINT NOT NULL,
    booking_id BIGINT NOT NULL,
    
    -- Payment Details
    total_booking_amount DECIMAL(10, 2) NOT NULL,
    platform_commission DECIMAL(10, 2) NOT NULL,
    agency_earning DECIMAL(10, 2) NOT NULL,
    worker_payment DECIMAL(10, 2) NOT NULL,
    
    -- Settlement
    settlement_status ENUM('pending', 'processed', 'settled', 'on_hold') DEFAULT 'pending',
    settlement_date DATE,
    settlement_reference VARCHAR(255),
    
    -- Bank Transfer Details
    transfer_method ENUM('bank', 'upi', 'wallet') DEFAULT 'bank',
    transfer_reference VARCHAR(255),
    transfer_date TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_agency (agency_id),
    INDEX idx_booking (booking_id),
    INDEX idx_settlement (settlement_status),
    FOREIGN KEY (agency_id) REFERENCES agencies(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

### 12. notifications
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Recipient
    recipient_type ENUM('user', 'worker', 'agency', 'admin') NOT NULL,
    recipient_id BIGINT NOT NULL,
    
    -- Notification Details
    notification_type ENUM('booking', 'payment', 'assignment', 'reminder', 'alert', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    
    -- Related Entities
    booking_id BIGINT,
    payment_id BIGINT,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    
    -- Delivery
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,
    sent_via_push BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    
    INDEX idx_recipient (recipient_type, recipient_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
);
```

### 13. admin_users
```sql
CREATE TABLE admin_users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    
    -- Role & Permissions
    role ENUM('super_admin', 'admin', 'support', 'finance') NOT NULL,
    permissions JSON, -- Granular permissions
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

### 14. service_queries (Dashboard Queries)
```sql
CREATE TABLE service_queries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Query Source
    user_id BIGINT NOT NULL,
    subcategory_id BIGINT NOT NULL,
    
    -- Query Details
    query_status ENUM('new', 'viewed', 'contacted', 'converted', 'expired') DEFAULT 'new',
    
    -- Service Requirements
    service_date DATE NOT NULL,
    service_time TIME NOT NULL,
    service_duration VARCHAR(100),
    service_location TEXT NOT NULL,
    service_requirements JSON,
    
    -- Target Workers (filtered by service type)
    target_worker_type VARCHAR(50) NOT NULL,
    target_city VARCHAR(100) NOT NULL,
    
    -- Visibility
    visible_to_agencies JSON, -- Array of agency IDs that can see this query
    visible_to_workers JSON, -- Array of worker IDs that can see this query
    
    -- Response Tracking
    viewed_by JSON, -- Array of {worker_id, viewed_at}
    responded_by JSON, -- Array of {worker_id, response, responded_at}
    
    -- Conversion
    converted_to_booking_id BIGINT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- Query expires after 48 hours
    
    INDEX idx_user (user_id),
    INDEX idx_status (query_status),
    INDEX idx_worker_type (target_worker_type),
    INDEX idx_city (target_city),
    INDEX idx_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subcategory_id) REFERENCES service_subcategories(id),
    FOREIGN KEY (converted_to_booking_id) REFERENCES bookings(id)
);
```

### 15. audit_logs
```sql
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Actor
    actor_type ENUM('user', 'worker', 'agency', 'admin') NOT NULL,
    actor_id BIGINT NOT NULL,
    actor_ip VARCHAR(45),
    
    -- Action
    action VARCHAR(100) NOT NULL, -- login, booking_created, payment_processed, etc.
    entity_type VARCHAR(50), -- booking, payment, user, etc.
    entity_id BIGINT,
    
    -- Details
    old_values JSON,
    new_values JSON,
    metadata JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_actor (actor_type, actor_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);
```

## Service-Specific Form Requirements

### 1. Paralysis Care
- Type of paralysis (Quadriplegia, Paraplegia, Hemiplegia, etc.)
- Duration of condition
- Current mobility level
- Medical equipment available
- Physician details
- Current medications
- Therapy requirements
- Special care needs

### 2. Elderly Care
- Age of patient
- Medical conditions
- Mobility status
- Cognitive status
- Daily assistance needed
- Medication schedule
- Dietary restrictions
- Emergency protocols

### 3. Mother & Baby Care
- Mother's age
- Delivery type
- Delivery date
- Baby's age
- Feeding type
- Special medical conditions
- Postnatal care requirements
- Vaccination schedule

### 4. Diabetes Management
- Type of diabetes
- Current HbA1c level
- Insulin dependency
- Diet plan status
- Exercise routine
- Complications if any
- Monitoring frequency
- Doctor's contact

### 5. Post-Surgery Care
- Type of surgery
- Surgery date
- Hospital discharge summary
- Wound care requirements
- Medication schedule
- Mobility restrictions
- Follow-up appointments
- Physiotherapy needs

## Query Flow & Dashboard System

### Worker Dashboard Query Display Logic
1. When a user submits a service request:
   - System identifies the service category and subcategory
   - Creates entry in `service_queries` table
   - Identifies eligible workers based on:
     - Service type mapping
     - Location proximity
     - Availability status
     - Agency affiliation

2. Dashboard Visibility Rules:
   - Workers see queries for their registered services only
   - Queries appear in real-time on worker dashboards
   - Workers can respond/express interest
   - Agency admins see all queries for their workers

3. Query Lifecycle:
   - NEW: Just created, visible to relevant workers
   - VIEWED: Worker has seen the query
   - CONTACTED: Worker has responded/shown interest
   - CONVERTED: Booking created from query
   - EXPIRED: No action taken within 48 hours

## Financial Flow

### Commission Structure
1. **Customer pays**: Total booking amount
2. **Platform keeps**: Platform fee (5-10%)
3. **Agency receives**: Booking amount - Platform fee
4. **Agency pays worker**: As per agency-worker agreement
5. **Settlement**: Weekly/Monthly to agencies

### Payment Tracking
- All transactions logged in `payments` table
- Agency earnings tracked in `agency_payments`
- Platform commission calculated automatically
- GST applied where applicable
- Refund management system

## Role-Based Access Implementation

### Database Views for Agency Admin
```sql
-- Agency Dashboard View
CREATE VIEW agency_dashboard AS
SELECT 
    a.id as agency_id,
    a.agency_name,
    COUNT(DISTINCT w.id) as total_workers,
    COUNT(DISTINCT b.id) as total_bookings,
    SUM(CASE WHEN b.booking_status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
    SUM(ap.agency_earning) as total_earnings,
    AVG(w.rating) as avg_worker_rating
FROM agencies a
LEFT JOIN workers w ON w.agency_id = a.id
LEFT JOIN bookings b ON b.agency_id = a.id
LEFT JOIN agency_payments ap ON ap.agency_id = a.id
GROUP BY a.id;

-- Agency Bookings View (Read-only for agencies)
CREATE VIEW agency_bookings_view AS
SELECT 
    b.booking_code,
    b.start_date,
    u.full_name as customer_name,
    w.full_name as worker_name,
    sc.subcategory_name as service,
    b.total_amount,
    b.booking_status,
    b.payment_status
FROM bookings b
JOIN users u ON b.user_id = u.id
LEFT JOIN workers w ON b.worker_id = w.id
JOIN service_subcategories sc ON b.subcategory_id = sc.id;
```

## Indexes for Performance

```sql
-- Additional performance indexes
CREATE INDEX idx_bookings_date_range ON bookings(start_date, end_date);
CREATE INDEX idx_workers_location ON workers(city, pincode);
CREATE INDEX idx_queries_expiry ON service_queries(expires_at, query_status);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_notifications_unread ON notifications(recipient_type, recipient_id, is_read);
```

## Data Security & Privacy

1. **Sensitive Data Encryption**:
   - Aadhar numbers
   - Bank account details
   - Medical information

2. **Access Logging**:
   - All data access logged in audit_logs
   - IP tracking for security

3. **Data Retention**:
   - Booking data: 7 years
   - Payment records: 10 years
   - Audit logs: 3 years

## Backup & Recovery Strategy

1. **Daily Backups**: Full database backup
2. **Hourly Backups**: Transaction logs
3. **Replication**: Master-slave setup for high availability
4. **Point-in-time Recovery**: Enabled through binary logs
