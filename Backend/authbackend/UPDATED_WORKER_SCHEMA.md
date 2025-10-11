# NeedStation Worker Database Schema - Updated Recommendations

## 📋 **Current Schema Analysis & Improvements**

### **Database**: `needstation`
### **Table**: `workers`

---

## 🔧 **Complete Updated Workers Table Schema**

```sql
CREATE TABLE workers (
    -- Primary Key
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Agency Relationship (Made nullable for independent workers)
    agency_id BIGINT NULL DEFAULT 1,
    
    -- ========================================
    -- PERSONAL INFORMATION
    -- ========================================
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL, -- Made nullable for phone-only signups
    phone VARCHAR(20) UNIQUE NOT NULL,
    alternate_phone VARCHAR(20),
    gender ENUM('male', 'female', 'other') NOT NULL,
    date_of_birth DATE NOT NULL,
    
    -- ========================================
    -- ADDRESS INFORMATION
    -- ========================================
    current_address TEXT NOT NULL,
    permanent_address TEXT,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    
    -- ========================================
    -- PROFESSIONAL INFORMATION
    -- ========================================
    worker_type ENUM(
        'nurse', 
        'caretaker', 
        'security_guard', 
        'physiotherapist', 
        'pathologist',
        'general_nurse',
        'icu_nurse',
        'wound_care_specialist',
        'pediatric_nurse',
        'elderly_care_specialist',
        'mother_baby_care_specialist',
        'diabetes_care_specialist',
        'paralysis_care_specialist',
        'parkinsons_care_specialist',
        'post_surgery_care_specialist',
        'bedridden_patient_care_specialist'
    ) NOT NULL,
    
    experience_years INT DEFAULT 0,
    specializations JSON, -- Array of specialization IDs
    languages JSON, -- Array of languages spoken
    education_qualification VARCHAR(255),
    certifications JSON, -- Array of certification details
    
    -- ========================================
    -- WORK PREFERENCES & AVAILABILITY
    -- ========================================
    work_type ENUM('full_time', 'part_time', 'freelance') DEFAULT 'part_time',
    services JSON, -- Array of services offered
    availability_schedule JSON, -- Weekly schedule (Mon-Sun availability)
    time_slots JSON, -- Morning/afternoon/evening preferences
    shift_preferences ENUM('day', 'night', 'both') DEFAULT 'day',
    minimum_hours_per_day INT DEFAULT 8,
    
    -- ========================================
    -- VERIFICATION & DOCUMENTS
    -- ========================================
    aadhar_number VARCHAR(20) UNIQUE,
    pan_number VARCHAR(20),
    police_verification_status ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
    medical_certificate_status ENUM('pending', 'verified', 'failed', 'not_required') DEFAULT 'pending',
    background_check_status ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
    
    -- Document URLs
    profile_image_url VARCHAR(500),
    id_proof_url VARCHAR(500),
    selfie_with_id_url VARCHAR(500),
    certificate_urls JSON, -- Array of certificate document URLs
    
    -- ========================================
    -- PROFESSIONAL LICENSES
    -- ========================================
    license_number VARCHAR(50), -- For nurses, physiotherapists, etc.
    license_expiry_date DATE,
    medical_license_number VARCHAR(50), -- Specific for medical professionals
    security_license_number VARCHAR(50), -- Specific for security guards
    
    -- ========================================
    -- PLATFORM DETAILS
    -- ========================================
    availability_status ENUM('available', 'busy', 'offline') DEFAULT 'available',
    service_radius_km INT DEFAULT 10,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_bookings INT DEFAULT 0,
    
    -- ========================================
    -- PAYMENT INFORMATION
    -- ========================================
    payment_mode ENUM('UPI', 'Bank Transfer', 'Cash') DEFAULT 'Cash',
    upi_id VARCHAR(100),
    bank_name VARCHAR(100),
    account_number VARCHAR(20),
    ifsc_code VARCHAR(15),
    
    -- ========================================
    -- EMERGENCY CONTACT
    -- ========================================
    emergency_contact_name VARCHAR(255),
    emergency_contact_number VARCHAR(20),
    emergency_contact_relation VARCHAR(100),
    
    -- ========================================
    -- SERVICE-SPECIFIC FIELDS
    -- ========================================
    -- Nursing Specific
    nursing_specialization ENUM('general', 'icu_trained', 'wound_care', 'pediatric', 'geriatric'),
    can_handle_ventilator BOOLEAN DEFAULT FALSE,
    emergency_response_trained BOOLEAN DEFAULT FALSE,
    
    -- Physiotherapy Specific
    physiotherapy_specialization ENUM('orthopedic', 'neurological', 'sports', 'pediatric', 'geriatric'),
    equipment_available JSON, -- List of physiotherapy equipment available
    
    -- Security Specific
    armed_security_certified BOOLEAN DEFAULT FALSE,
    night_shift_available BOOLEAN DEFAULT TRUE,
    
    -- General Service Fields
    travel_allowance DECIMAL(8,2) DEFAULT 0.00,
    equipment_provided BOOLEAN DEFAULT FALSE,
    
    -- ========================================
    -- STATUS & TIMESTAMPS
    -- ========================================
    registration_status ENUM('pending', 'active', 'suspended', 'terminated') DEFAULT 'pending',
    registration_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- ========================================
    -- OTP & VERIFICATION FIELDS
    -- ========================================
    phone_verification_otp VARCHAR(10),
    phone_verified BOOLEAN DEFAULT FALSE,
    otp_attempts INT DEFAULT 0,
    otp_created_at TIMESTAMP NULL,
    otp_expires_at TIMESTAMP NULL,
    verification_date TIMESTAMP NULL,
    
    -- ========================================
    -- INDEXES
    -- ========================================
    INDEX idx_phone (phone),
    INDEX idx_worker_type (worker_type),
    INDEX idx_city (city),
    INDEX idx_availability_status (availability_status),
    INDEX idx_registration_status (registration_status),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);
```

---

## 🔄 **Migration Scripts**

### **Step 1: Add Missing Columns to Existing Table**

```sql
-- Payment Information
ALTER TABLE workers ADD COLUMN payment_mode ENUM('UPI', 'Bank Transfer', 'Cash') DEFAULT 'Cash';
ALTER TABLE workers ADD COLUMN upi_id VARCHAR(100);
ALTER TABLE workers ADD COLUMN bank_name VARCHAR(100);
ALTER TABLE workers ADD COLUMN account_number VARCHAR(20);
ALTER TABLE workers ADD COLUMN ifsc_code VARCHAR(15);

-- Work Preferences
ALTER TABLE workers ADD COLUMN work_type ENUM('full_time', 'part_time', 'freelance') DEFAULT 'part_time';
ALTER TABLE workers ADD COLUMN services JSON;
ALTER TABLE workers ADD COLUMN availability_schedule JSON;
ALTER TABLE workers ADD COLUMN time_slots JSON;
ALTER TABLE workers ADD COLUMN shift_preferences ENUM('day', 'night', 'both') DEFAULT 'day';
ALTER TABLE workers ADD COLUMN minimum_hours_per_day INT DEFAULT 8;

-- Document URLs
ALTER TABLE workers ADD COLUMN id_proof_url VARCHAR(500);
ALTER TABLE workers ADD COLUMN selfie_with_id_url VARCHAR(500);
ALTER TABLE workers ADD COLUMN certificate_urls JSON;

-- Professional Licenses
ALTER TABLE workers ADD COLUMN license_number VARCHAR(50);
ALTER TABLE workers ADD COLUMN license_expiry_date DATE;
ALTER TABLE workers ADD COLUMN medical_license_number VARCHAR(50);
ALTER TABLE workers ADD COLUMN security_license_number VARCHAR(50);

-- Service-Specific Fields
ALTER TABLE workers ADD COLUMN nursing_specialization ENUM('general', 'icu_trained', 'wound_care', 'pediatric', 'geriatric');
ALTER TABLE workers ADD COLUMN can_handle_ventilator BOOLEAN DEFAULT FALSE;
ALTER TABLE workers ADD COLUMN emergency_response_trained BOOLEAN DEFAULT FALSE;
ALTER TABLE workers ADD COLUMN physiotherapy_specialization ENUM('orthopedic', 'neurological', 'sports', 'pediatric', 'geriatric');
ALTER TABLE workers ADD COLUMN equipment_available JSON;
ALTER TABLE workers ADD COLUMN armed_security_certified BOOLEAN DEFAULT FALSE;
ALTER TABLE workers ADD COLUMN night_shift_available BOOLEAN DEFAULT TRUE;
ALTER TABLE workers ADD COLUMN travel_allowance DECIMAL(8,2) DEFAULT 0.00;
ALTER TABLE workers ADD COLUMN equipment_provided BOOLEAN DEFAULT FALSE;
ALTER TABLE workers ADD COLUMN background_check_status ENUM('pending', 'verified', 'failed') DEFAULT 'pending';
```

### **Step 2: Modify Existing Columns**

```sql
-- Make email nullable for phone-only signups
ALTER TABLE workers MODIFY COLUMN email VARCHAR(255) NULL;

-- Make agency_id nullable for independent workers
ALTER TABLE workers MODIFY COLUMN agency_id BIGINT NULL DEFAULT 1;

-- Update worker_type enum with new service types
ALTER TABLE workers MODIFY COLUMN worker_type ENUM(
    'nurse', 
    'caretaker', 
    'security_guard', 
    'physiotherapist', 
    'pathologist',
    'general_nurse',
    'icu_nurse',
    'wound_care_specialist',
    'pediatric_nurse',
    'elderly_care_specialist',
    'mother_baby_care_specialist',
    'diabetes_care_specialist',
    'paralysis_care_specialist',
    'parkinsons_care_specialist',
    'post_surgery_care_specialist',
    'bedridden_patient_care_specialist'
) NOT NULL;
```

### **Step 3: Add Indexes for Performance**

```sql
-- Add indexes for better query performance
CREATE INDEX idx_phone ON workers(phone);
CREATE INDEX idx_worker_type ON workers(worker_type);
CREATE INDEX idx_city ON workers(city);
CREATE INDEX idx_availability_status ON workers(availability_status);
CREATE INDEX idx_registration_status ON workers(registration_status);
CREATE INDEX idx_rating ON workers(rating);
CREATE INDEX idx_created_at ON workers(created_at);
```

---

## 📊 **Field Mapping to Registration Steps**

### **Step 1: Basic Information**
- `full_name`
- `email` (nullable)
- `phone`
- `alternate_phone`
- `gender`
- `date_of_birth`
- `profile_image_url`

### **Step 2: Contact Information**
- `current_address`
- `permanent_address`
- `city`
- `pincode`
- `service_radius_km`
- `open_to_travel` (mapped to `travel_allowance`)

### **Step 3: Professional Details**
- `worker_type`
- `services`
- `experience_years`
- `work_type`
- `availability_schedule`
- `time_slots`
- `languages`
- `shift_preferences`
- `minimum_hours_per_day`

### **Step 4: Verification**
- `aadhar_number`
- `police_verification_status`
- `id_proof_url`
- `selfie_with_id_url`
- `certificate_urls`
- `license_number`
- `license_expiry_date`

### **Step 5: Payment Information**
- `payment_mode`
- `upi_id`
- `bank_name`
- `account_number`
- `ifsc_code`
- `pan_number`
- `emergency_contact_name`
- `emergency_contact_number`
- `emergency_contact_relation`

---

## 🎯 **JSON Field Structures**

### **services** JSON Structure:
```json
{
  "cleaning": true,
  "electrician": false,
  "plumbing": true,
  "furnitureAssembly": false,
  "painting": true,
  "gardening": false,
  "cooking": true,
  "babysitting": false,
  "nursing": true,
  "physiotherapy": false
}
```

### **availability_schedule** JSON Structure:
```json
{
  "monday": true,
  "tuesday": true,
  "wednesday": true,
  "thursday": true,
  "friday": true,
  "saturday": false,
  "sunday": false
}
```

### **time_slots** JSON Structure:
```json
{
  "morning": true,
  "afternoon": true,
  "evening": false
}
```

### **languages** JSON Structure:
```json
{
  "english": true,
  "hindi": true,
  "tamil": false,
  "telugu": false,
  "kannada": false,
  "malayalam": false,
  "bengali": false,
  "marathi": false
}
```

### **specializations** JSON Structure:
```json
[
  "wound_care",
  "diabetes_management",
  "elderly_care",
  "post_surgery_care"
]
```

### **certificate_urls** JSON Structure:
```json
[
  "https://storage.example.com/certificates/cert1.pdf",
  "https://storage.example.com/certificates/cert2.pdf",
  "https://storage.example.com/certificates/cert3.pdf"
]
```

### **equipment_available** JSON Structure:
```json
[
  "wheelchair",
  "walker",
  "exercise_bands",
  "ultrasound_machine",
  "tens_unit"
]
```

---

## 🚨 **Critical Implementation Notes**

### **1. Email Nullable for Phone-Only Signups**
- Email field is now nullable to support phone-only registrations
- This addresses the requirement for older users who may not have email addresses

### **2. Agency ID Flexibility**
- Made `agency_id` nullable with default value 1
- Supports both agency-affiliated and independent workers

### **3. Service-Specific Specializations**
- Added specialized fields for different worker types
- Nursing, physiotherapy, and security guards have specific fields

### **4. Document Management**
- All document URLs are stored as VARCHAR(500)
- Certificate URLs stored as JSON array for multiple certificates

### **5. Payment Integration Ready**
- Complete payment information capture
- Supports both UPI and bank transfer methods

---

## 📈 **Performance Considerations**

### **Indexes Added:**
- `phone` - For quick worker lookup
- `worker_type` - For service-based filtering
- `city` - For location-based searches
- `availability_status` - For finding available workers
- `registration_status` - For admin filtering
- `rating` - For sorting by rating
- `created_at` - For chronological sorting

### **JSON Field Optimization:**
- Use JSON fields for flexible, schema-less data
- Consider adding JSON indexes for frequently queried JSON fields:

```sql
-- Example JSON indexes (MySQL 5.7+)
ALTER TABLE workers ADD INDEX idx_services_nursing ((JSON_EXTRACT(services, '$.nursing')));
ALTER TABLE workers ADD INDEX idx_languages_english ((JSON_EXTRACT(languages, '$.english')));
```

---

## 🔄 **Implementation Priority**

### **Phase 1 (Critical - Implement First):**
1. ✅ Make email nullable
2. ✅ Add payment fields
3. ✅ Add document URL fields
4. ✅ Add work preferences

### **Phase 2 (Important):**
1. Add service-specific specializations
2. Add license fields
3. Add equipment and travel fields

### **Phase 3 (Enhancement):**
1. Add performance indexes
2. Add JSON field indexes
3. Add advanced verification fields

---

## 📝 **Notes for Developers**

1. **Data Migration**: Existing workers will have default values for new fields
2. **Frontend Updates**: Registration forms need updates to capture new fields
3. **API Updates**: Backend DTOs and services need updates for new fields
4. **Validation**: Add proper validation for new enum values and JSON structures
5. **Testing**: Test all registration steps with new field requirements

---

**Last Updated**: 2025-10-10
**Version**: 2.0
**Status**: Ready for Implementation
