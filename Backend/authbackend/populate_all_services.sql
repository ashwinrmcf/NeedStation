-- ============================================
-- Populate All Services with Categories
-- ============================================
-- Total: 52 services across 13 categories (13 × 4)
-- ============================================

USE needstation;

-- ============================================
-- 1. ELDER CARE (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Personal Care', 'PERSONAL_CARE', 'Elder Care', 'Comprehensive personal care services for elderly', 1200.00, true, NOW(), NOW()),
('Companion Care', 'COMPANION_CARE', 'Elder Care', 'Companionship and emotional support for seniors', 1000.00, true, NOW(), NOW()),
('Respite Care', 'RESPITE_CARE', 'Elder Care', 'Temporary relief care for family caregivers', 1500.00, true, NOW(), NOW()),
('Dementia Care', 'DEMENTIA_CARE', 'Elder Care', 'Specialized care for dementia and Alzheimer patients', 2000.00, true, NOW(), NOW());

-- ============================================
-- 2. BEDRIDDEN PATIENT CARE (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Complete Bed Care', 'COMPLETE_BED_CARE', 'Bedridden Patient Care', 'Full care for bedridden patients', 2500.00, true, NOW(), NOW()),
('Stroke Patient Care', 'STROKE_PATIENT_CARE', 'Bedridden Patient Care', 'Specialized care for stroke patients', 2800.00, true, NOW(), NOW()),
('Coma Care', 'COMA_CARE', 'Bedridden Patient Care', 'Intensive care for coma patients', 3500.00, true, NOW(), NOW()),
('Palliative Care', 'PALLIATIVE_CARE', 'Bedridden Patient Care', 'Comfort care for terminally ill patients', 3000.00, true, NOW(), NOW());

-- ============================================
-- 3. CARETAKER AT HOME (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Live-in Caretaker', 'LIVE_IN_CARETAKER', 'Caretaker at Home', '24/7 live-in caretaker services', 15000.00, true, NOW(), NOW()),
('Part-time Caretaker', 'PART_TIME_CARETAKER', 'Caretaker at Home', 'Part-time caretaker for daily tasks', 8000.00, true, NOW(), NOW()),
('Cook', 'COOK', 'Caretaker at Home', 'Professional cooking services at home', 10000.00, true, NOW(), NOW()),
('Nanny', 'NANNY', 'Caretaker at Home', 'Professional nanny for child care', 12000.00, true, NOW(), NOW());

-- ============================================
-- 4. DIABETES CARE (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Type 1 Diabetes', 'TYPE1_DIABETES', 'Diabetes Care', 'Care and management for Type 1 diabetes', 1800.00, true, NOW(), NOW()),
('Type 2 Diabetes', 'TYPE2_DIABETES', 'Diabetes Care', 'Care and management for Type 2 diabetes', 1500.00, true, NOW(), NOW()),
('Gestational Diabetes', 'GESTATIONAL_DIABETES', 'Diabetes Care', 'Diabetes care during pregnancy', 2000.00, true, NOW(), NOW()),
('Diabetes Complication', 'DIABETES_COMPLICATION', 'Diabetes Care', 'Management of diabetes complications', 2500.00, true, NOW(), NOW());

-- ============================================
-- 5. HEALTH CHECKUP (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Basic Health Checkup', 'BASIC_HEALTH_CHECKUP', 'Health Checkup', 'Basic health screening package', 1500.00, true, NOW(), NOW()),
('Comprehensive Health Checkup', 'COMPREHENSIVE_HEALTH_CHECKUP', 'Health Checkup', 'Complete health checkup package', 3500.00, true, NOW(), NOW()),
('Senior Citizen Health Checkup', 'SENIOR_CITIZEN_HEALTH_CHECKUP', 'Health Checkup', 'Specialized health checkup for seniors', 2500.00, true, NOW(), NOW()),
('Women Health Checkup', 'WOMEN_HEALTH_CHECKUP', 'Health Checkup', 'Comprehensive women health screening', 2800.00, true, NOW(), NOW());

-- ============================================
-- 6. MOTHER AND BABY CARE (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Newborn Care', 'NEWBORN_CARE', 'Mother and Baby Care', 'Professional newborn care services', 2000.00, true, NOW(), NOW()),
('Postnatal Care', 'POSTNATAL_CARE', 'Mother and Baby Care', 'Postnatal care for mother and baby', 2500.00, true, NOW(), NOW()),
('Baby Massage and Care', 'BABY_MASSAGE_CARE', 'Mother and Baby Care', 'Baby massage and wellness care', 1200.00, true, NOW(), NOW()),
('Twins Baby Care', 'TWINS_BABY_CARE', 'Mother and Baby Care', 'Specialized care for twins', 3500.00, true, NOW(), NOW());

-- ============================================
-- 7. NURSING CARE (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('General Nursing', 'GENERAL_NURSING', 'Nursing Care', 'General nursing care at home', 2000.00, true, NOW(), NOW()),
('ICU Trained Nurse', 'ICU_TRAINED_NURSE', 'Nursing Care', 'ICU trained nursing care', 3500.00, true, NOW(), NOW()),
('Wound Care', 'WOUND_CARE', 'Nursing Care', 'Professional wound care and dressing', 1800.00, true, NOW(), NOW()),
('Pediatric Nursing', 'PEDIATRIC_NURSING', 'Nursing Care', 'Specialized pediatric nursing care', 2500.00, true, NOW(), NOW());

-- ============================================
-- 8. PARALYSIS CARE (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Hemiplegia Care', 'HEMIPLEGIA_CARE', 'Paralysis Care', 'Care for one-sided paralysis', 2500.00, true, NOW(), NOW()),
('Paraphlegia Care', 'PARAPHLEGIA_CARE', 'Paralysis Care', 'Care for lower body paralysis', 3000.00, true, NOW(), NOW()),
('Quadriplegia Care', 'QUADRIPLEGIA_CARE', 'Paralysis Care', 'Care for full body paralysis', 4000.00, true, NOW(), NOW()),
('Facial Paralysis Care', 'FACIAL_PARALYSIS_CARE', 'Paralysis Care', 'Care for facial paralysis', 2000.00, true, NOW(), NOW());

-- ============================================
-- 9. PARKINSONS CARE (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Early Stage Parkinsons', 'EARLY_STAGE_PARKINSONS', 'Parkinsons Care', 'Care for early stage Parkinsons', 2200.00, true, NOW(), NOW()),
('Advanced Stage Parkinsons', 'ADVANCED_STAGE_PARKINSONS', 'Parkinsons Care', 'Care for advanced Parkinsons', 3500.00, true, NOW(), NOW()),
('Parkinsons Therapy Support', 'PARKINSONS_THERAPY_SUPPORT', 'Parkinsons Care', 'Therapy and support for Parkinsons', 2800.00, true, NOW(), NOW()),
('Family Support Care', 'FAMILY_SUPPORT_CARE', 'Parkinsons Care', 'Family support and counseling for Parkinsons', 2500.00, true, NOW(), NOW());

-- ============================================
-- 10. PATHOLOGY CARE (4 services)
-- ============================================
INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Home Sample Collection', 'HOME_SAMPLE_COLLECTION', 'Pathology Care', 'Blood and sample collection at home', 500.00, true, NOW(), NOW()),
('Diagnostic Services', 'DIAGNOSTIC_SERVICES', 'Pathology Care', 'Complete diagnostic services', 1500.00, true, NOW(), NOW()),
('Regular Monitoring', 'REGULAR_MONITORING', 'Pathology Care', 'Regular health monitoring services', 2000.00, true, NOW(), NOW()),
('Corporate Health Package', 'CORPORATE_HEALTH_PACKAGE', 'Pathology Care', 'Corporate health screening package', 3000.00, true, NOW(), NOW());

INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Orthopedic Physiotherapy', 'ORTHOPEDIC_PHYSIOTHERAPY', 'Physiotherapy', 'Physiotherapy for bone and joint issues', 1500.00, true, NOW(), NOW()),
('Neurological Physiotherapy', 'NEUROLOGICAL_PHYSIOTHERAPY', 'Physiotherapy', 'Physiotherapy for neurological conditions', 2000.00, true, NOW(), NOW()),
('Pediatric Physiotherapy', 'PEDIATRIC_PHYSIOTHERAPY', 'Physiotherapy', 'Physiotherapy for children', 1800.00, true, NOW(), NOW()),
('Geriatric Physiotherapy', 'GERIATRIC_PHYSIOTHERAPY', 'Physiotherapy', 'Physiotherapy for elderly patients', 1600.00, true, NOW(), NOW());


INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Cardiac Surgery Care', 'CARDIAC_SURGERY_CARE', 'Post Surgery Care', 'Post-operative care for cardiac surgery', 3500.00, true, NOW(), NOW()),
('Orthopedic Surgery Care', 'ORTHOPEDIC_SURGERY_CARE', 'Post Surgery Care', 'Post-operative care for orthopedic surgery', 2500.00, true, NOW(), NOW()),
('Abdominal Surgery Care', 'ABDOMINAL_SURGERY_CARE', 'Post Surgery Care', 'Post-operative care for abdominal surgery', 2800.00, true, NOW(), NOW()),
('Neuro Surgery Care', 'NEURO_SURGERY_CARE', 'Post Surgery Care', 'Post-operative care for neuro surgery', 4000.00, true, NOW(), NOW());

INSERT INTO services (service_name, service_code, category, description, base_price, is_active, created_at, updated_at)
VALUES 
('Home Security', 'HOME_SECURITY', 'Security Guard', 'Residential security guard services', 12000.00, true, NOW(), NOW()),
('Corporate Security', 'CORPORATE_SECURITY', 'Security Guard', 'Corporate security services', 15000.00, true, NOW(), NOW()),
('Event Security', 'EVENT_SECURITY', 'Security Guard', 'Event security management', 8000.00, true, NOW(), NOW()),
('Night Watchman', 'NIGHT_WATCHMAN', 'Security Guard', 'Night watchman services', 10000.00, true, NOW(), NOW());

SELECT 
    category,
    COUNT(*) as service_count,
    GROUP_CONCAT(service_name SEPARATOR ', ') as services
FROM services
GROUP BY category
ORDER BY category;

-- Total count
SELECT COUNT(*) as total_services FROM services;

-- List all services
SELECT 
    id,
    service_name,
    service_code,
    category,
    base_price,
    is_active
FROM services
ORDER BY category, service_name;
