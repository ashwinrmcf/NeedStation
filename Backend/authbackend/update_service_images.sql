-- ============================================
-- Update Service Minicard Image URLs
-- ============================================
-- Cloudinary Cloud: dchmvabfy
-- Base URL: https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/
-- ============================================

USE needstation;

SET SQL_SAFE_UPDATES = 0;

-- ============================================
-- 1. ELDER CARE (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec2_personal.jpg'
WHERE service_name = 'Personal Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec1_companion.jpg'
WHERE service_name = 'Companion Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec4_respite.jpg'
WHERE service_name = 'Respite Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec3_dementia.jpg'
WHERE service_name = 'Dementia Care';

-- ============================================
-- 2. BEDRIDDEN PATIENT CARE (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc1_complete_bed_care.jpg'
WHERE service_name = 'Complete Bed Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc2_stroke_patient.jpg'
WHERE service_name = 'Stroke Patient Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc3_coma.jpg'
WHERE service_name = 'Coma Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc4_palliativecare.jpg'
WHERE service_name = 'Palliative Care';

-- ============================================
-- 3. CARETAKER AT HOME (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah1_live_in_caretaker.jpg'
WHERE service_name = 'Live-in Caretaker';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah2_part_time_caretaker.webp'
WHERE service_name = 'Part-time Caretaker';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah3_cook.jpg'
WHERE service_name = 'Cook';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah4_nanny.jpg'
WHERE service_name = 'Nanny';

-- ============================================
-- 4. DIABETES CARE (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/dm_type_1.webp'
WHERE service_name = 'Type 1 Diabetes';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/db2_type2.jpg'
WHERE service_name = 'Type 2 Diabetes';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/dm3_gestational.jpg'
WHERE service_name = 'Gestational Diabetes';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/dm4_complication.jpg'
WHERE service_name = 'Diabetes Complication';

-- ============================================
-- 5. HEALTH CHECKUP (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs1_basic.jpg'
WHERE service_name = 'Basic Health Checkup';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs2_comprehensive_health_checkup.jpg'
WHERE service_name = 'Comprehensive Health Checkup';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs3_senior_citizen.png'
WHERE service_name = 'Senior Citizen Health Checkup';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs4_women_health_checkup.jpg'
WHERE service_name = 'Women Health Checkup';

-- ============================================
-- 6. MOTHER AND BABY CARE (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_newborn_care.jpg'
WHERE service_name = 'Newborn Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_postnatal.jpg'
WHERE service_name = 'Postnatal Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_baby_massage_and_care.jpg'
WHERE service_name = 'Baby Massage and Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_twins_baby_care.jpg'
WHERE service_name = 'Twins Baby Care';

-- ============================================
-- 7. NURSING CARE (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc1_general_nursing.jpg'
WHERE service_name = 'General Nursing';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc2_icu_trained.jpeg'
WHERE service_name = 'ICU Trained Nurse';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc3_wound_care.jpg'
WHERE service_name = 'Wound Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc4_pediatric.jpg'
WHERE service_name = 'Pediatric Nursing';

-- ============================================
-- 8. PARALYSIS CARE (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac1_hemiplegia_care.webp'
WHERE service_name = 'Hemiplegia Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac2_paraphlegia.jpg'
WHERE service_name = 'Paraphlegia Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac3_quadriplegia.jpg'
WHERE service_name = 'Quadriplegia Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac4_facial_paralysis.jpg'
WHERE service_name = 'Facial Paralysis Care';

-- ============================================
-- 9. PARKINSONS CARE (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc1_early_stage.jfif'
WHERE service_name = 'Early Stage Parkinsons';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc2_advanced_stage.jpg'
WHERE service_name = 'Advanced Stage Parkinsons';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc3_therapy_support.jpg'
WHERE service_name = 'Parkinsons Therapy Support';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc4_family_support.jpg'
WHERE service_name = 'Family Support Care';

-- ============================================
-- 10. PATHOLOGY CARE (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc1_home_sample.jpg'
WHERE service_name = 'Home Sample Collection';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc2_diagnostic_services.jpg'
WHERE service_name = 'Diagnostic Services';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc3_regular_monitoring.webp'
WHERE service_name = 'Regular Monitoring';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc4_corporate_health.jpg'
WHERE service_name = 'Corporate Health Package';

-- ============================================
-- 11. PHYSIOTHERAPY (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p1_orthopedic.jpg'
WHERE service_name = 'Orthopedic Physiotherapy';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p2_neurological.jpg'
WHERE service_name = 'Neurological Physiotherapy';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p3_pediatric.jpg'
WHERE service_name = 'Pediatric Physiotherapy';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p4_geriatric.jpg'
WHERE service_name = 'Geriatric Physiotherapy';

-- ============================================
-- 12. POST SURGERY CARE (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps1_cardiac_surgery.jpg'
WHERE service_name = 'Cardiac Surgery Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps2_orthopedic.jpg'
WHERE service_name = 'Orthopedic Surgery Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps3_abdominal_surgery_care.jpg'
WHERE service_name = 'Abdominal Surgery Care';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps4_neuro_surgery_care.webp'
WHERE service_name = 'Neuro Surgery Care';

-- ============================================
-- 13. SECURITY GUARD (4 services)
-- ============================================
UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_home_sec.jpg'
WHERE service_name = 'Home Security';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_corporate_security.jpg'
WHERE service_name = 'Corporate Security';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_event_security.jpg'
WHERE service_name = 'Event Security';

UPDATE services 
SET minicard_image_url = 'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_night_watchman.jpg'
WHERE service_name = 'Night Watchman';

SET SQL_SAFE_UPDATES = 1;

-- ============================================
-- Verify all updates
-- ============================================
SELECT 
    service_name,
    category,
    minicard_image_url
FROM services
ORDER BY category, service_name;

-- Count services with images
SELECT 
    COUNT(*) as total_services,
    SUM(CASE WHEN minicard_image_url IS NOT NULL THEN 1 ELSE 0 END) as services_with_images,
    SUM(CASE WHEN minicard_image_url IS NULL THEN 1 ELSE 0 END) as services_without_images
FROM services;
