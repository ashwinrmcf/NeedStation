-- Migration V11: Create BOOKING_SUB_SERVICES table
-- Purpose: Track which subservices were selected for each booking (many-to-many)

CREATE TABLE booking_sub_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    sub_service_id BIGINT NOT NULL,
    
    -- Denormalized for performance
    sub_service_name VARCHAR(100),
    
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) NOT NULL COMMENT 'Price at time of booking',
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (sub_service_id) REFERENCES sub_services(id),
    
    INDEX idx_booking_subs_booking (booking_id),
    INDEX idx_booking_subs_subservice (sub_service_id),
    
    UNIQUE KEY unique_booking_subservice (booking_id, sub_service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger to auto-fill denormalized fields and update booking summary
DELIMITER $$
CREATE TRIGGER before_booking_subservice_insert
BEFORE INSERT ON booking_sub_services
FOR EACH ROW
BEGIN
    -- Auto-fill subservice name
    SET NEW.sub_service_name = (SELECT sub_service_name FROM sub_services WHERE id = NEW.sub_service_id);
END$$
DELIMITER ;

-- Trigger to update booking's subservices_summary after insert
DELIMITER $$
CREATE TRIGGER after_booking_subservice_insert
AFTER INSERT ON booking_sub_services
FOR EACH ROW
BEGIN
    DECLARE subservices_json TEXT;
    DECLARE subservices_cnt INT;
    
    -- Get all subservice names as JSON array
    SELECT 
        CONCAT('[', GROUP_CONCAT(CONCAT('"', sub_service_name, '"')), ']'),
        COUNT(*)
    INTO subservices_json, subservices_cnt
    FROM booking_sub_services
    WHERE booking_id = NEW.booking_id;
    
    -- Update booking summary
    UPDATE bookings
    SET subservices_summary = subservices_json,
        subservices_count = subservices_cnt
    WHERE id = NEW.booking_id;
END$$
DELIMITER ;

-- Trigger to update booking's subservices_summary after delete
DELIMITER $$
CREATE TRIGGER after_booking_subservice_delete
AFTER DELETE ON booking_sub_services
FOR EACH ROW
BEGIN
    DECLARE subservices_json TEXT;
    DECLARE subservices_cnt INT;
    
    -- Get remaining subservice names as JSON array
    SELECT 
        CONCAT('[', GROUP_CONCAT(CONCAT('"', sub_service_name, '"')), ']'),
        COUNT(*)
    INTO subservices_json, subservices_cnt
    FROM booking_sub_services
    WHERE booking_id = OLD.booking_id;
    
    -- Update booking summary
    UPDATE bookings
    SET subservices_summary = COALESCE(subservices_json, '[]'),
        subservices_count = COALESCE(subservices_cnt, 0)
    WHERE id = OLD.booking_id;
END$$
DELIMITER ;
