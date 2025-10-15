-- Migration V12: Create BOOKING_FORMALITY_DATA table
-- Purpose: Store user's answers to formality questions

CREATE TABLE booking_formality_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    formality_id BIGINT NOT NULL,
    
    -- Denormalized for performance
    field_name VARCHAR(100),
    field_label VARCHAR(200),
    
    field_value TEXT NOT NULL COMMENT 'User''s answer to the formality question',
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (formality_id) REFERENCES service_formalities(id),
    
    INDEX idx_formality_data_booking (booking_id),
    INDEX idx_formality_data_formality (formality_id),
    
    UNIQUE KEY unique_booking_formality (booking_id, formality_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger to auto-fill denormalized fields
DELIMITER $$
CREATE TRIGGER before_booking_formality_insert
BEFORE INSERT ON booking_formality_data
FOR EACH ROW
BEGIN
    -- Auto-fill field name and label
    SELECT field_name, field_label
    INTO NEW.field_name, NEW.field_label
    FROM service_formalities
    WHERE id = NEW.formality_id;
END$$
DELIMITER ;

-- Trigger to update booking's formality_summary after insert
DELIMITER $$
CREATE TRIGGER after_booking_formality_insert
AFTER INSERT ON booking_formality_data
FOR EACH ROW
BEGIN
    DECLARE formality_json TEXT;
    
    -- Create JSON summary of key formality responses
    SELECT CONCAT('{',
        GROUP_CONCAT(
            CONCAT('"', field_name, '":"', 
                   REPLACE(REPLACE(field_value, '"', '\\"'), '\n', ' '), 
                   '"')
        ),
    '}')
    INTO formality_json
    FROM booking_formality_data
    WHERE booking_id = NEW.booking_id;
    
    -- Update booking summary
    UPDATE bookings
    SET formality_summary = formality_json
    WHERE id = NEW.booking_id;
END$$
DELIMITER ;

-- Trigger to update booking's formality_summary after update
DELIMITER $$
CREATE TRIGGER after_booking_formality_update
AFTER UPDATE ON booking_formality_data
FOR EACH ROW
BEGIN
    DECLARE formality_json TEXT;
    
    -- Recreate JSON summary
    SELECT CONCAT('{',
        GROUP_CONCAT(
            CONCAT('"', field_name, '":"', 
                   REPLACE(REPLACE(field_value, '"', '\\"'), '\n', ' '), 
                   '"')
        ),
    '}')
    INTO formality_json
    FROM booking_formality_data
    WHERE booking_id = NEW.booking_id;
    
    -- Update booking summary
    UPDATE bookings
    SET formality_summary = formality_json
    WHERE id = NEW.booking_id;
END$$
DELIMITER ;
