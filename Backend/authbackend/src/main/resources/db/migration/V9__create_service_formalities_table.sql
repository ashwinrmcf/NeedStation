-- Migration V9: Create SERVICE_FORMALITIES table
-- Purpose: Define dynamic form fields for each service (form builder)

CREATE TABLE service_formalities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,
    formality_type VARCHAR(50) NOT NULL COMMENT 'Category: PATIENT_INFO, CARE_DETAILS, EQUIPMENT, etc.',
    field_name VARCHAR(100) NOT NULL COMMENT 'Field identifier: patient_age, medical_conditions',
    field_label VARCHAR(200) NOT NULL COMMENT 'Display label for the field',
    field_type VARCHAR(50) NOT NULL COMMENT 'TEXT, NUMBER, DATE, SELECT, CHECKBOX, TEXTAREA, RADIO',
    is_required BOOLEAN DEFAULT FALSE,
    options TEXT COMMENT 'JSON array for SELECT/CHECKBOX/RADIO options',
    placeholder VARCHAR(255),
    validation_rules TEXT COMMENT 'JSON validation rules: {"min": 60, "max": 120}',
    help_text VARCHAR(500) COMMENT 'Helper text to guide user',
    display_order INT DEFAULT 0,
    
    -- Audit fields
    created_by BIGINT,
    updated_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_formalities_service (service_id, display_order),
    INDEX idx_formalities_type (formality_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert formalities for each service

-- 1. Home Security Guard
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(1, 'PROPERTY_INFO', 'property_type', 'Property Type', 'SELECT', TRUE, '["House", "Apartment", "Villa", "Commercial"]', NULL, NULL, 'Select your property type', 1),
(1, 'PROPERTY_INFO', 'property_size', 'Property Size (sq ft)', 'NUMBER', TRUE, NULL, 'Enter property size', '{"min": 100, "max": 50000}', 'Approximate area in square feet', 2),
(1, 'SECURITY_DETAILS', 'security_concerns', 'Specific Security Concerns', 'TEXTAREA', FALSE, NULL, 'Describe any specific security concerns', NULL, 'Optional: Any particular areas of concern', 3),
(1, 'SECURITY_DETAILS', 'shift_preference', 'Preferred Shift', 'SELECT', TRUE, '["Day (6 AM - 6 PM)", "Night (6 PM - 6 AM)", "24/7"]', NULL, NULL, 'Select your preferred security shift', 4);

-- 2. Parkinsons Care
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(2, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 40, "max": 120}', 'Age of the patient', 1),
(2, 'PATIENT_INFO', 'disease_stage', 'Parkinson''s Stage', 'SELECT', TRUE, '["Early Stage (1-2)", "Moderate Stage (3)", "Advanced Stage (4-5)"]', NULL, NULL, 'Current stage of Parkinson''s disease', 2),
(2, 'MEDICAL_INFO', 'current_medications', 'Current Medications', 'TEXTAREA', TRUE, 'List all current medications', NULL, NULL, 'Include dosage and frequency', 3),
(2, 'CARE_DETAILS', 'mobility_level', 'Mobility Level', 'SELECT', TRUE, '["Independent", "Needs Assistance", "Wheelchair Bound"]', NULL, NULL, 'Patient''s current mobility status', 4);

-- 3. Bedridden Patient Care
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(3, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 1, "max": 120}', 'Age of the patient', 1),
(3, 'MEDICAL_INFO', 'reason_bedridden', 'Reason for Being Bedridden', 'TEXTAREA', TRUE, 'Describe the medical condition', NULL, NULL, 'Primary medical condition', 2),
(3, 'MEDICAL_INFO', 'existing_conditions', 'Existing Medical Conditions', 'TEXTAREA', FALSE, 'List any other medical conditions', NULL, NULL, 'Diabetes, BP, heart conditions, etc.', 3),
(3, 'CARE_DETAILS', 'care_duration', 'Care Duration Needed', 'SELECT', TRUE, '["4 hours/day", "8 hours/day", "12 hours/day", "24 hours/day"]', NULL, NULL, 'How many hours of care needed daily', 4);

-- 4. Mother and Baby Care
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(4, 'BABY_INFO', 'baby_age_days', 'Baby Age (in days)', 'NUMBER', TRUE, NULL, 'Enter baby age', '{"min": 0, "max": 365}', 'Age of the newborn in days', 1),
(4, 'BABY_INFO', 'delivery_type', 'Delivery Type', 'SELECT', TRUE, '["Normal Delivery", "C-Section"]', NULL, NULL, 'Type of delivery', 2),
(4, 'MOTHER_INFO', 'feeding_method', 'Feeding Method', 'SELECT', TRUE, '["Breastfeeding", "Formula Feeding", "Mixed Feeding"]', NULL, NULL, 'Current feeding method', 3),
(4, 'CARE_DETAILS', 'special_requirements', 'Special Requirements', 'TEXTAREA', FALSE, 'Any special care requirements', NULL, NULL, 'Premature baby, jaundice, etc.', 4);

-- 5. Paralysis Care
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(5, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 1, "max": 120}', 'Age of the patient', 1),
(5, 'MEDICAL_INFO', 'paralysis_type', 'Type of Paralysis', 'SELECT', TRUE, '["Hemiplegia (One Side)", "Paraplegia (Lower Body)", "Quadriplegia (All Four Limbs)"]', NULL, NULL, 'Type and extent of paralysis', 2),
(5, 'MEDICAL_INFO', 'time_since_paralysis', 'Time Since Paralysis', 'SELECT', TRUE, '["Less than 1 month", "1-6 months", "6-12 months", "More than 1 year"]', NULL, NULL, 'Duration since paralysis occurred', 3),
(5, 'CARE_DETAILS', 'therapy_requirements', 'Therapy Requirements', 'CHECKBOX', TRUE, '["Physiotherapy", "Occupational Therapy", "Speech Therapy", "Bladder Care"]', NULL, NULL, 'Select all required therapies', 4);

-- 6. Elderly Care
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(6, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 60, "max": 120}', 'Age of the elderly person', 1),
(6, 'MEDICAL_INFO', 'medical_conditions', 'Medical Conditions', 'TEXTAREA', FALSE, 'List any medical conditions', NULL, NULL, 'Diabetes, BP, arthritis, dementia, etc.', 2),
(6, 'CARE_DETAILS', 'hours_per_day', 'Care Hours Needed', 'SELECT', TRUE, '["4 hours", "8 hours", "12 hours", "24 hours"]', NULL, NULL, 'Daily care duration required', 3),
(6, 'CARE_DETAILS', 'mobility_level', 'Mobility Level', 'SELECT', TRUE, '["Independent", "Needs Support", "Wheelchair", "Bedridden"]', NULL, NULL, 'Current mobility status', 4);

-- 7. Nursing Care
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(7, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 1, "max": 120}', 'Age of the patient', 1),
(7, 'MEDICAL_INFO', 'medical_condition', 'Medical Condition', 'TEXTAREA', TRUE, 'Describe the medical condition', NULL, NULL, 'Primary reason for nursing care', 2),
(7, 'CARE_DETAILS', 'nursing_requirements', 'Nursing Requirements', 'CHECKBOX', TRUE, '["Wound Dressing", "IV Administration", "Catheter Care", "Vital Monitoring", "Medication Management"]', NULL, NULL, 'Select all required nursing services', 3),
(7, 'CARE_DETAILS', 'care_duration', 'Care Duration', 'SELECT', TRUE, '["4 hours/day", "8 hours/day", "12 hours/day", "24 hours/day"]', NULL, NULL, 'Daily nursing care duration', 4);

-- 8. Pathology Care
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(8, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 1, "max": 120}', 'Age of the patient', 1),
(8, 'TEST_DETAILS', 'test_type', 'Type of Test', 'CHECKBOX', TRUE, '["Blood Test", "Urine Test", "ECG", "X-Ray", "Other"]', NULL, NULL, 'Select all required tests', 2),
(8, 'TEST_DETAILS', 'fasting_required', 'Fasting Required?', 'RADIO', TRUE, '["Yes", "No", "Not Sure"]', NULL, NULL, 'Is fasting required for the test?', 3),
(8, 'TEST_DETAILS', 'preferred_time', 'Preferred Collection Time', 'SELECT', TRUE, '["Morning (6-9 AM)", "Mid-Morning (9-12 PM)", "Afternoon (12-3 PM)", "Evening (3-6 PM)"]', NULL, NULL, 'Best time for sample collection', 4);

-- 9. Diabetes Management
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(9, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 1, "max": 120}', 'Age of the patient', 1),
(9, 'MEDICAL_INFO', 'diabetes_type', 'Diabetes Type', 'SELECT', TRUE, '["Type 1", "Type 2", "Gestational", "Pre-Diabetes"]', NULL, NULL, 'Type of diabetes', 2),
(9, 'MEDICAL_INFO', 'current_treatment', 'Current Treatment', 'SELECT', TRUE, '["Insulin", "Oral Medication", "Diet Control", "Combination"]', NULL, NULL, 'Current diabetes management method', 3),
(9, 'CARE_DETAILS', 'monitoring_frequency', 'Monitoring Frequency', 'SELECT', TRUE, '["Daily", "Twice Daily", "Weekly", "As Needed"]', NULL, NULL, 'How often monitoring is needed', 4);

-- 10. Health Check-up Services
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(10, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 1, "max": 120}', 'Age of the patient', 1),
(10, 'CHECKUP_DETAILS', 'checkup_type', 'Type of Check-up', 'SELECT', TRUE, '["Basic Health Check", "Comprehensive Check", "Senior Citizen Package", "Cardiac Screening"]', NULL, NULL, 'Select check-up package', 2),
(10, 'CHECKUP_DETAILS', 'health_concerns', 'Specific Health Concerns', 'TEXTAREA', FALSE, 'Any specific health concerns', NULL, NULL, 'Optional: Areas you want to focus on', 3),
(10, 'CHECKUP_DETAILS', 'last_checkup', 'Last Health Check-up', 'SELECT', TRUE, '["Less than 6 months", "6-12 months", "1-2 years", "More than 2 years", "Never"]', NULL, NULL, 'When was your last check-up?', 4);

-- 11. Physiotherapy
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(11, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 1, "max": 120}', 'Age of the patient', 1),
(11, 'MEDICAL_INFO', 'condition_type', 'Condition/Injury Type', 'SELECT', TRUE, '["Back Pain", "Knee Pain", "Sports Injury", "Post-Stroke", "Arthritis", "Other"]', NULL, NULL, 'Primary reason for physiotherapy', 2),
(11, 'MEDICAL_INFO', 'pain_duration', 'Duration of Pain/Condition', 'SELECT', TRUE, '["Less than 1 week", "1-4 weeks", "1-3 months", "3-6 months", "More than 6 months"]', NULL, NULL, 'How long have you had this condition?', 3),
(11, 'CARE_DETAILS', 'sessions_per_week', 'Sessions Per Week', 'SELECT', TRUE, '["1 session", "2 sessions", "3 sessions", "Daily"]', NULL, NULL, 'Recommended frequency of sessions', 4);

-- 12. Post-Surgery Care
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(12, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 1, "max": 120}', 'Age of the patient', 1),
(12, 'SURGERY_INFO', 'surgery_type', 'Type of Surgery', 'TEXT', TRUE, NULL, 'Enter surgery type', NULL, 'E.g., Knee replacement, Appendectomy', 2),
(12, 'SURGERY_INFO', 'surgery_date', 'Surgery Date', 'DATE', TRUE, NULL, 'Select surgery date', NULL, 'When was the surgery performed?', 3),
(12, 'CARE_DETAILS', 'care_requirements', 'Care Requirements', 'CHECKBOX', TRUE, '["Wound Care", "Pain Management", "Mobility Assistance", "Drain Care", "Medication Management"]', NULL, NULL, 'Select all required post-surgery care', 4);

-- 13. Caretaker at Home
INSERT INTO service_formalities (service_id, formality_type, field_name, field_label, field_type, is_required, options, placeholder, validation_rules, help_text, display_order) VALUES
(13, 'PATIENT_INFO', 'patient_age', 'Patient Age', 'NUMBER', TRUE, NULL, 'Enter patient age', '{"min": 1, "max": 120}', 'Age of the person needing care', 1),
(13, 'CARE_DETAILS', 'care_type', 'Type of Care Needed', 'CHECKBOX', TRUE, '["Daily Living Assistance", "Household Chores", "Meal Preparation", "Medication Reminders", "Companionship"]', NULL, NULL, 'Select all required services', 2),
(13, 'CARE_DETAILS', 'hours_per_day', 'Hours Per Day', 'SELECT', TRUE, '["4 hours", "8 hours", "12 hours", "24 hours"]', NULL, NULL, 'Daily care duration required', 3),
(13, 'CARE_DETAILS', 'special_requirements', 'Special Requirements', 'TEXTAREA', FALSE, 'Any special requirements or instructions', NULL, NULL, 'Optional: Dietary restrictions, preferences, etc.', 4);
