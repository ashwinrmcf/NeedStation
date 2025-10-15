-- Migration V10: Create BOOKINGS table (Optimized)
-- Purpose: Main booking record with contact, location, scheduling, and status

CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    
    -- Denormalized fields for performance (avoid joins)
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
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_address TEXT,
    
    -- Scheduling
    preferred_date DATE NOT NULL,
    preferred_time TIME,
    preferred_time_slot VARCHAR(50) COMMENT 'Morning, Afternoon, Evening',
    urgency VARCHAR(20) DEFAULT 'NORMAL' COMMENT 'NORMAL, URGENT, EMERGENCY',
    
    -- Status & Tracking
    status VARCHAR(50) DEFAULT 'PENDING' COMMENT 'PENDING, CONFIRMED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED',
    assigned_worker_id BIGINT,
    assigned_worker_name VARCHAR(200),
    
    -- Pricing
    base_amount DECIMAL(10,2),
    additional_charges DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING' COMMENT 'PENDING, PAID, REFUNDED',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    
    -- Denormalized summary fields (for quick access)
    subservices_summary TEXT COMMENT 'JSON array of selected subservice names',
    subservices_count INT DEFAULT 0,
    formality_summary TEXT COMMENT 'JSON summary of key formality responses',
    
    -- Notes & Feedback
    special_instructions TEXT,
    admin_notes TEXT,
    cancellation_reason TEXT,
    customer_rating INT COMMENT '1-5 star rating',
    customer_feedback TEXT,
    
    -- Audit fields
    created_by BIGINT,
    updated_by BIGINT,
    cancelled_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (assigned_worker_id) REFERENCES workers(id),
    
    -- Performance indexes
    INDEX idx_booking_number (booking_number),
    INDEX idx_booking_user_status (user_id, status),
    INDEX idx_booking_service_date (service_id, preferred_date),
    INDEX idx_booking_status_date (status, preferred_date),
    INDEX idx_booking_worker (assigned_worker_id),
    INDEX idx_booking_created (created_at),
    INDEX idx_booking_payment (payment_status),
    INDEX idx_booking_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger to auto-generate booking number
DELIMITER $$
CREATE TRIGGER before_booking_insert
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE next_number INT;
    DECLARE date_prefix VARCHAR(8);
    
    -- Generate date prefix: BK20251016
    SET date_prefix = CONCAT('BK', DATE_FORMAT(NOW(), '%Y%m%d'));
    
    -- Get next sequence number for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(booking_number, 11) AS UNSIGNED)), 0) + 1
    INTO next_number
    FROM bookings
    WHERE booking_number LIKE CONCAT(date_prefix, '%');
    
    -- Set booking number: BK20251016001
    SET NEW.booking_number = CONCAT(date_prefix, LPAD(next_number, 3, '0'));
    
    -- Auto-fill denormalized fields
    SET NEW.service_name = (SELECT service_name FROM services WHERE id = NEW.service_id);
    SET NEW.service_code = (SELECT service_code FROM services WHERE id = NEW.service_id);
    SET NEW.user_name = (SELECT full_name FROM users WHERE id = NEW.user_id);
    SET NEW.user_email = (SELECT email FROM users WHERE id = NEW.user_id);
END$$
DELIMITER ;

-- Trigger to update denormalized worker name
DELIMITER $$
CREATE TRIGGER before_booking_update
BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.assigned_worker_id IS NOT NULL AND NEW.assigned_worker_id != OLD.assigned_worker_id THEN
        SET NEW.assigned_worker_name = (SELECT full_name FROM workers WHERE id = NEW.assigned_worker_id);
    END IF;
END$$
DELIMITER ;
