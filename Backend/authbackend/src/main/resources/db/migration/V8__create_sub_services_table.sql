-- Migration V8: Create SUB_SERVICES table
-- Purpose: Store subservices under each main service (4 per service)

CREATE TABLE sub_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,
    sub_service_name VARCHAR(100) NOT NULL,
    description TEXT,
    additional_price DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    
    -- Audit fields
    created_by BIGINT,
    updated_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_subservice_service (service_id),
    INDEX idx_subservice_active (is_active),
    INDEX idx_subservice_order (service_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert subservices for each service

-- 1. Home Security Guard
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(1, 'Day Shift Security', '12-hour day shift security guard', 0, 1),
(1, 'Night Shift Security', '12-hour night shift security guard', 100, 2),
(1, '24/7 Security', 'Round-the-clock security coverage', 300, 3),
(1, 'Armed Security', 'Armed security personnel for high-risk areas', 500, 4);

-- 2. Parkinsons Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(2, 'Medication Management', 'Timely medication administration and tracking', 0, 1),
(2, 'Mobility Assistance', 'Help with walking and movement exercises', 150, 2),
(2, 'Tremor Management', 'Specialized care for tremor control', 200, 3),
(2, 'Speech Therapy Support', 'Assistance with speech and swallowing difficulties', 250, 4);

-- 3. Bedridden Patient Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(3, 'Hygiene Care', 'Bathing, grooming, and personal hygiene', 0, 1),
(3, 'Pressure Sore Prevention', 'Regular repositioning and skin care', 200, 2),
(3, 'Feeding Assistance', 'Help with meals and nutrition', 150, 3),
(3, 'Medical Monitoring', 'Vital signs monitoring and health tracking', 300, 4);

-- 4. Mother and Baby Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(4, 'Newborn Care', 'Complete care for newborns including bathing and feeding', 0, 1),
(4, 'Breastfeeding Support', 'Lactation consultation and support', 150, 2),
(4, 'Postnatal Mother Care', 'Care and support for new mothers', 200, 3),
(4, 'Baby Massage', 'Therapeutic baby massage sessions', 100, 4);

-- 5. Paralysis Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(5, 'Physical Therapy', 'Daily physiotherapy exercises', 0, 1),
(5, 'Occupational Therapy', 'Activities to improve daily living skills', 200, 2),
(5, 'Bladder & Bowel Care', 'Catheter care and bowel management', 250, 3),
(5, 'Emotional Support', 'Counseling and emotional well-being support', 150, 4);

-- 6. Elderly Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(6, 'Companionship', 'Social interaction and companionship', 0, 1),
(6, 'Medication Reminders', 'Timely medication administration', 100, 2),
(6, 'Meal Preparation', 'Cooking nutritious meals', 150, 3),
(6, 'Mobility Support', 'Assistance with walking and movement', 200, 4);

-- 7. Nursing Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(7, 'Wound Dressing', 'Professional wound care and dressing', 0, 1),
(7, 'IV Administration', 'Intravenous medication administration', 300, 2),
(7, 'Catheter Care', 'Catheter insertion and maintenance', 250, 3),
(7, 'Vital Signs Monitoring', 'Regular monitoring of vital parameters', 150, 4);

-- 8. Pathology Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(8, 'Blood Sample Collection', 'Home blood sample collection', 0, 1),
(8, 'Urine Sample Collection', 'Home urine sample collection', 50, 2),
(8, 'ECG at Home', 'Electrocardiogram test at home', 200, 3),
(8, 'X-Ray at Home', 'Portable X-ray services', 500, 4);

-- 9. Diabetes Management
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(9, 'Blood Sugar Monitoring', 'Regular glucose level checking', 0, 1),
(9, 'Insulin Administration', 'Insulin injection assistance', 150, 2),
(9, 'Diet Planning', 'Diabetic diet consultation and planning', 200, 3),
(9, 'Foot Care', 'Diabetic foot care and monitoring', 100, 4);

-- 10. Health Check-up Services
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(10, 'Basic Health Check', 'Basic vitals and health assessment', 0, 1),
(10, 'Comprehensive Check', 'Detailed health screening', 300, 2),
(10, 'Senior Citizen Package', 'Specialized check-up for elderly', 400, 3),
(10, 'Cardiac Screening', 'Heart health assessment', 500, 4);

-- 11. Physiotherapy
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(11, 'Pain Management', 'Therapeutic exercises for pain relief', 0, 1),
(11, 'Sports Injury Rehab', 'Rehabilitation for sports injuries', 200, 2),
(11, 'Post-Stroke Therapy', 'Physiotherapy after stroke', 300, 3),
(11, 'Arthritis Management', 'Exercises for arthritis patients', 150, 4);

-- 12. Post-Surgery Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(12, 'Wound Care', 'Surgical wound cleaning and dressing', 0, 1),
(12, 'Pain Management', 'Post-operative pain relief support', 200, 2),
(12, 'Mobility Assistance', 'Help with movement after surgery', 150, 3),
(12, 'Drain Care', 'Surgical drain maintenance', 250, 4);

-- 13. Caretaker at Home
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order) VALUES
(13, 'Daily Living Assistance', 'Help with daily activities', 0, 1),
(13, 'Household Chores', 'Light housekeeping and cleaning', 100, 2),
(13, 'Grocery Shopping', 'Assistance with shopping and errands', 150, 3),
(13, 'Transportation Support', 'Accompaniment to appointments', 200, 4);
