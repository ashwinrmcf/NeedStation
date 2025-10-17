-- Quick fix: Populate sub_services table
-- Run this in MySQL Workbench

USE needstation_db;

-- Clear existing data
DELETE FROM booking_sub_services;
DELETE FROM sub_services;

-- Insert sub-services for Elderly Care (service_id = 3 based on your screenshot)
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order, is_active)
SELECT id, 'Companionship', 'Social interaction and companionship', 0, 1, TRUE FROM services WHERE service_code = 'ELDERLY_CARE'
UNION ALL
SELECT id, 'Medication Reminders', 'Timely medication administration', 100, 2, TRUE FROM services WHERE service_code = 'ELDERLY_CARE'
UNION ALL
SELECT id, 'Meal Preparation', 'Cooking nutritious meals', 150, 3, TRUE FROM services WHERE service_code = 'ELDERLY_CARE'
UNION ALL
SELECT id, 'Mobility Support', 'Assistance with walking and movement', 200, 4, TRUE FROM services WHERE service_code = 'ELDERLY_CARE';

-- Insert for all other services
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order, is_active)
SELECT id, 'Medication Management', 'Timely medication administration and tracking', 0, 1, TRUE FROM services WHERE service_code = 'PARKINSONS_CARE'
UNION ALL
SELECT id, 'Mobility Assistance', 'Help with walking and movement exercises', 150, 2, TRUE FROM services WHERE service_code = 'PARKINSONS_CARE'
UNION ALL
SELECT id, 'Tremor Management', 'Specialized care for tremor control', 200, 3, TRUE FROM services WHERE service_code = 'PARKINSONS_CARE'
UNION ALL
SELECT id, 'Speech Therapy Support', 'Assistance with speech and swallowing difficulties', 250, 4, TRUE FROM services WHERE service_code = 'PARKINSONS_CARE';

-- Verify
SELECT 
    s.service_name,
    COUNT(ss.id) as subservice_count
FROM services s
LEFT JOIN sub_services ss ON s.id = ss.service_id
GROUP BY s.id, s.service_name
ORDER BY s.id;

SELECT * FROM sub_services ORDER BY service_id, display_order;
