-- Insert subservices for all services
-- This script can be run manually if the migration didn't populate the data

-- Clear existing subservices (if any)
DELETE FROM sub_services;

-- Get service IDs dynamically and insert subservices
-- 1. Home Security Guard
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Day Shift Security', '12-hour day shift security guard', 0, 1 FROM services WHERE service_code = 'HOME_SECURITY_GUARD'
UNION ALL
SELECT id, 'Night Shift Security', '12-hour night shift security guard', 100, 2 FROM services WHERE service_code = 'HOME_SECURITY_GUARD'
UNION ALL
SELECT id, '24/7 Security', 'Round-the-clock security coverage', 300, 3 FROM services WHERE service_code = 'HOME_SECURITY_GUARD'
UNION ALL
SELECT id, 'Armed Security', 'Armed security personnel for high-risk areas', 500, 4 FROM services WHERE service_code = 'HOME_SECURITY_GUARD';

-- 2. Parkinsons Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Medication Management', 'Timely medication administration and tracking', 0, 1 FROM services WHERE service_code = 'PARKINSONS_CARE'
UNION ALL
SELECT id, 'Mobility Assistance', 'Help with walking and movement exercises', 150, 2 FROM services WHERE service_code = 'PARKINSONS_CARE'
UNION ALL
SELECT id, 'Tremor Management', 'Specialized care for tremor control', 200, 3 FROM services WHERE service_code = 'PARKINSONS_CARE'
UNION ALL
SELECT id, 'Speech Therapy Support', 'Assistance with speech and swallowing difficulties', 250, 4 FROM services WHERE service_code = 'PARKINSONS_CARE';

-- 3. Bedridden Patient Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Hygiene Care', 'Bathing, grooming, and personal hygiene', 0, 1 FROM services WHERE service_code = 'BEDRIDDEN_PATIENT_CARE'
UNION ALL
SELECT id, 'Pressure Sore Prevention', 'Regular repositioning and skin care', 200, 2 FROM services WHERE service_code = 'BEDRIDDEN_PATIENT_CARE'
UNION ALL
SELECT id, 'Feeding Assistance', 'Help with meals and nutrition', 150, 3 FROM services WHERE service_code = 'BEDRIDDEN_PATIENT_CARE'
UNION ALL
SELECT id, 'Medical Monitoring', 'Vital signs monitoring and health tracking', 300, 4 FROM services WHERE service_code = 'BEDRIDDEN_PATIENT_CARE';

-- 4. Mother and Baby Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Newborn Care', 'Complete care for newborns including bathing and feeding', 0, 1 FROM services WHERE service_code = 'MOTHER_BABY_CARE'
UNION ALL
SELECT id, 'Breastfeeding Support', 'Lactation consultation and support', 150, 2 FROM services WHERE service_code = 'MOTHER_BABY_CARE'
UNION ALL
SELECT id, 'Postnatal Mother Care', 'Care and support for new mothers', 200, 3 FROM services WHERE service_code = 'MOTHER_BABY_CARE'
UNION ALL
SELECT id, 'Baby Massage', 'Therapeutic baby massage sessions', 100, 4 FROM services WHERE service_code = 'MOTHER_BABY_CARE';

-- 5. Paralysis Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Physical Therapy', 'Daily physiotherapy exercises', 0, 1 FROM services WHERE service_code = 'PARALYSIS_CARE'
UNION ALL
SELECT id, 'Occupational Therapy', 'Activities to improve daily living skills', 200, 2 FROM services WHERE service_code = 'PARALYSIS_CARE'
UNION ALL
SELECT id, 'Bladder & Bowel Care', 'Catheter care and bowel management', 250, 3 FROM services WHERE service_code = 'PARALYSIS_CARE'
UNION ALL
SELECT id, 'Emotional Support', 'Counseling and emotional well-being support', 150, 4 FROM services WHERE service_code = 'PARALYSIS_CARE';

-- 6. Elderly Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Companionship', 'Social interaction and companionship', 0, 1 FROM services WHERE service_code = 'ELDERLY_CARE'
UNION ALL
SELECT id, 'Medication Reminders', 'Timely medication administration', 100, 2 FROM services WHERE service_code = 'ELDERLY_CARE'
UNION ALL
SELECT id, 'Meal Preparation', 'Cooking nutritious meals', 150, 3 FROM services WHERE service_code = 'ELDERLY_CARE'
UNION ALL
SELECT id, 'Mobility Support', 'Assistance with walking and movement', 200, 4 FROM services WHERE service_code = 'ELDERLY_CARE';

-- 7. Nursing Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Wound Dressing', 'Professional wound care and dressing', 0, 1 FROM services WHERE service_code = 'NURSING_CARE'
UNION ALL
SELECT id, 'IV Administration', 'Intravenous medication administration', 300, 2 FROM services WHERE service_code = 'NURSING_CARE'
UNION ALL
SELECT id, 'Catheter Care', 'Catheter insertion and maintenance', 250, 3 FROM services WHERE service_code = 'NURSING_CARE'
UNION ALL
SELECT id, 'Vital Signs Monitoring', 'Regular monitoring of vital parameters', 150, 4 FROM services WHERE service_code = 'NURSING_CARE';

-- 8. Pathology Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Blood Sample Collection', 'Home blood sample collection', 0, 1 FROM services WHERE service_code = 'PATHOLOGY_CARE'
UNION ALL
SELECT id, 'Urine Sample Collection', 'Home urine sample collection', 50, 2 FROM services WHERE service_code = 'PATHOLOGY_CARE'
UNION ALL
SELECT id, 'ECG at Home', 'Electrocardiogram test at home', 200, 3 FROM services WHERE service_code = 'PATHOLOGY_CARE'
UNION ALL
SELECT id, 'X-Ray at Home', 'Portable X-ray services', 500, 4 FROM services WHERE service_code = 'PATHOLOGY_CARE';

-- 9. Diabetes Management
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Blood Sugar Monitoring', 'Regular glucose level checking', 0, 1 FROM services WHERE service_code = 'DIABETES_MANAGEMENT'
UNION ALL
SELECT id, 'Insulin Administration', 'Insulin injection assistance', 150, 2 FROM services WHERE service_code = 'DIABETES_MANAGEMENT'
UNION ALL
SELECT id, 'Diet Planning', 'Diabetic diet consultation and planning', 200, 3 FROM services WHERE service_code = 'DIABETES_MANAGEMENT'
UNION ALL
SELECT id, 'Foot Care', 'Diabetic foot care and monitoring', 100, 4 FROM services WHERE service_code = 'DIABETES_MANAGEMENT';

-- 10. Health Check-up Services
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Basic Health Check', 'Basic vitals and health assessment', 0, 1 FROM services WHERE service_code = 'HEALTH_CHECKUP'
UNION ALL
SELECT id, 'Comprehensive Check', 'Detailed health screening', 300, 2 FROM services WHERE service_code = 'HEALTH_CHECKUP'
UNION ALL
SELECT id, 'Senior Citizen Package', 'Specialized check-up for elderly', 400, 3 FROM services WHERE service_code = 'HEALTH_CHECKUP'
UNION ALL
SELECT id, 'Cardiac Screening', 'Heart health assessment', 500, 4 FROM services WHERE service_code = 'HEALTH_CHECKUP';

-- 11. Physiotherapy
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Pain Management', 'Therapeutic exercises for pain relief', 0, 1 FROM services WHERE service_code = 'PHYSIOTHERAPY'
UNION ALL
SELECT id, 'Sports Injury Rehab', 'Rehabilitation for sports injuries', 200, 2 FROM services WHERE service_code = 'PHYSIOTHERAPY'
UNION ALL
SELECT id, 'Post-Stroke Therapy', 'Physiotherapy after stroke', 300, 3 FROM services WHERE service_code = 'PHYSIOTHERAPY'
UNION ALL
SELECT id, 'Arthritis Management', 'Exercises for arthritis patients', 150, 4 FROM services WHERE service_code = 'PHYSIOTHERAPY';

-- 12. Post-Surgery Care
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Wound Care', 'Surgical wound cleaning and dressing', 0, 1 FROM services WHERE service_code = 'POST_SURGERY_CARE'
UNION ALL
SELECT id, 'Pain Management', 'Post-operative pain relief support', 200, 2 FROM services WHERE service_code = 'POST_SURGERY_CARE'
UNION ALL
SELECT id, 'Mobility Assistance', 'Help with movement after surgery', 150, 3 FROM services WHERE service_code = 'POST_SURGERY_CARE'
UNION ALL
SELECT id, 'Drain Care', 'Surgical drain maintenance', 250, 4 FROM services WHERE service_code = 'POST_SURGERY_CARE';

-- 13. Caretaker at Home
INSERT INTO sub_services (service_id, sub_service_name, description, additional_price, display_order)
SELECT id, 'Daily Living Assistance', 'Help with daily activities', 0, 1 FROM services WHERE service_code = 'CARETAKER_AT_HOME'
UNION ALL
SELECT id, 'Household Chores', 'Light housekeeping and cleaning', 100, 2 FROM services WHERE service_code = 'CARETAKER_AT_HOME'
UNION ALL
SELECT id, 'Grocery Shopping', 'Assistance with shopping and errands', 150, 3 FROM services WHERE service_code = 'CARETAKER_AT_HOME'
UNION ALL
SELECT id, 'Transportation Support', 'Accompaniment to appointments', 200, 4 FROM services WHERE service_code = 'CARETAKER_AT_HOME';

-- Verify the inserts
SELECT 
    s.service_name,
    s.service_code,
    COUNT(ss.id) as subservice_count
FROM services s
LEFT JOIN sub_services ss ON s.id = ss.service_id
GROUP BY s.id, s.service_name, s.service_code
ORDER BY s.id;
