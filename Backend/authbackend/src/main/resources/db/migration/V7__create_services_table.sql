-- Migration V7: Create SERVICES table
-- Purpose: Store 13 main service categories (Elderly Care, Nursing Care, etc.)

CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    service_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    base_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Audit fields
    created_by BIGINT,
    updated_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_service_code (service_code),
    INDEX idx_service_active (is_active),
    INDEX idx_service_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert 13 main services
INSERT INTO services (service_name, service_code, description, base_price, is_active) VALUES
('Home Security Guard', 'HOME_SECURITY_GUARD', 'Professional security personnel to protect your home and ensure safety 24/7', 800.00, TRUE),
('Parkinsons Care', 'PARKINSONS_CARE', 'Specialized care and support for patients with Parkinson''s disease', 1200.00, TRUE),
('Bedridden Patient Care', 'BEDRIDDEN_PATIENT_CARE', 'Comprehensive care for bedridden patients including hygiene, medication, and comfort', 1500.00, TRUE),
('Mother and Baby Care', 'MOTHER_BABY_CARE', 'Expert postnatal care for mothers and newborns', 1000.00, TRUE),
('Paralysis Care', 'PARALYSIS_CARE', 'Dedicated care for paralysis patients with physiotherapy and daily assistance', 1400.00, TRUE),
('Elderly Care', 'ELDERLY_CARE', 'Compassionate and professional care tailored to meet the needs of seniors', 900.00, TRUE),
('Nursing Care', 'NURSING_CARE', 'Professional nursing services for medical care at home', 1200.00, TRUE),
('Pathology Care', 'PATHOLOGY_CARE', 'Home sample collection and pathology services', 500.00, TRUE),
('Diabetes Management', 'DIABETES_MANAGEMENT', 'Specialized care and monitoring for diabetes patients', 800.00, TRUE),
('Health Check-up Services', 'HEALTH_CHECKUP', 'Comprehensive health check-ups at your doorstep', 600.00, TRUE),
('Physiotherapy', 'PHYSIOTHERAPY', 'Professional physiotherapy services for rehabilitation and pain management', 700.00, TRUE),
('Post-Surgery Care', 'POST_SURGERY_CARE', 'Expert post-operative care and recovery support', 1300.00, TRUE),
('Caretaker at Home', 'CARETAKER_AT_HOME', 'Reliable caretakers for daily assistance and companionship', 750.00, TRUE);
