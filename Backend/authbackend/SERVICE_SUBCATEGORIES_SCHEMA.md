# NeedStation Service Subcategories & User Parameters Schema

## Service Categories with Subcategories and Required User Parameters

---

## 1. ELDERLY CARE

### Subcategories:
- **Companion Care**
  - Daily companionship
  - Social interaction
  - Activity assistance
  - Emotional support

- **Personal Care**
  - Bathing assistance
  - Dressing help
  - Grooming support
  - Toileting assistance

- **Dementia/Alzheimer's Care**
  - Memory care
  - Cognitive exercises
  - Behavior management
  - Safety supervision

- **Respite Care**
  - Short-term relief
  - Weekend care
  - Holiday coverage
  - Emergency backup

### User Parameters Required:
```json
{
  "patient_info": {
    "age": "number",
    "gender": "male/female",
    "mobility_status": "mobile/partially_mobile/immobile",
    "cognitive_status": "alert/mild_impairment/moderate_impairment/severe_impairment"
  },
  "care_requirements": {
    "duration_type": "hourly/daily/weekly/monthly",
    "hours_per_day": "4/8/12/24",
    "start_date": "date",
    "care_level": "basic/intermediate/advanced",
    "specific_needs": ["medication_reminder", "meal_preparation", "mobility_assistance", "companionship"]
  },
  "medical_conditions": {
    "existing_conditions": ["diabetes", "hypertension", "arthritis", "dementia", "other"],
    "medications": "text",
    "allergies": "text",
    "emergency_contact": "phone"
  },
  "preferences": {
    "caregiver_gender": "male/female/no_preference",
    "language_preference": ["hindi", "english", "regional"],
    "dietary_restrictions": "text"
  }
}
```

---

## 2. NURSING CARE

### Subcategories:
- **General Nursing**
  - Vital monitoring
  - Medication administration
  - Basic medical procedures
  - Health assessment

- **ICU Trained Nursing**
  - Critical care
  - Ventilator management
  - Advanced monitoring
  - Emergency response

- **Wound Care Nursing**
  - Dressing changes
  - Wound assessment
  - Infection prevention
  - Post-surgical care

- **Pediatric Nursing**
  - Child health monitoring
  - Vaccination support
  - Growth tracking
  - Pediatric medication

### User Parameters Required:
```json
{
  "patient_details": {
    "age": "number",
    "gender": "male/female",
    "diagnosis": "text",
    "hospitalization_history": "text"
  },
  "nursing_requirements": {
    "care_type": "general/icu/wound_care/pediatric",
    "duration": "hours/days/weeks/months",
    "shift_preference": "day/night/24x7",
    "procedures_needed": ["injection", "iv_line", "catheter", "wound_dressing", "tube_feeding"]
  },
  "medical_equipment": {
    "equipment_at_home": ["oxygen_concentrator", "ventilator", "suction_machine", "nebulizer", "none"],
    "equipment_needed": ["hospital_bed", "wheelchair", "walker", "other"]
  },
  "doctor_details": {
    "primary_doctor": "text",
    "hospital": "text",
    "next_appointment": "date"
  }
}
```

---

## 3. CARETAKER AT HOME

### Subcategories:
- **Live-in Caretaker**
  - 24x7 availability
  - Full-time residence
  - Complete care management
  - Night supervision

- **Part-time Caretaker**
  - Fixed hours
  - Daily visits
  - Specific task assistance
  - Flexible scheduling

- **Cook-cum-Caretaker**
  - Meal preparation
  - Kitchen management
  - Basic care duties
  - Dietary planning

- **Baby Caretaker/Nanny**
  - Infant care
  - Child supervision
  - Educational activities
  - Safety monitoring

### User Parameters Required:
```json
{
  "household_info": {
    "family_size": "number",
    "home_type": "apartment/house/villa",
    "location": "address",
    "pets": "yes/no"
  },
  "caretaker_duties": {
    "primary_responsibilities": ["cooking", "cleaning", "patient_care", "child_care", "elderly_care"],
    "working_hours": "8/10/12/24",
    "accommodation": "live_in/live_out",
    "days_per_week": "number"
  },
  "specific_requirements": {
    "cooking_type": "vegetarian/non_vegetarian/jain/vegan",
    "languages_required": ["hindi", "english", "regional"],
    "experience_needed": "fresher/1-2years/3-5years/5+years",
    "age_preference": "18-25/26-35/36-45/45+"
  }
}
```

---

## 4. BEDRIDDEN PATIENT CARE

### Subcategories:
- **Complete Bedridden Care**
  - Total dependency care
  - 24x7 monitoring
  - All ADL support
  - Medical management

- **Stroke Patient Care**
  - Paralysis management
  - Speech therapy support
  - Cognitive rehabilitation
  - Physical therapy assistance

- **Coma Patient Care**
  - Specialized monitoring
  - Sensory stimulation
  - Family training
  - Medical coordination

- **Palliative Care**
  - End-of-life care
  - Pain management
  - Comfort care
  - Family support

### User Parameters Required:
```json
{
  "patient_condition": {
    "diagnosis": "text",
    "bedridden_duration": "weeks/months/years",
    "consciousness_level": "alert/semi_conscious/unconscious",
    "communication_ability": "verbal/non_verbal/none"
  },
  "care_intensity": {
    "dependency_level": "partial/complete",
    "medical_procedures": ["tube_feeding", "catheter_care", "tracheostomy", "oxygen_therapy"],
    "pressure_sore_status": "none/grade1/grade2/grade3/grade4",
    "mobility_exercises": "required/not_required"
  },
  "support_equipment": {
    "available": ["hospital_bed", "air_mattress", "oxygen", "suction", "feeding_pump"],
    "required": ["patient_lift", "wheelchair", "commode", "other"]
  }
}
```

---

## 5. PARKINSON'S CARE

### Subcategories:
- **Early Stage Care**
  - Medication management
  - Exercise programs
  - Fall prevention
  - Lifestyle adaptation

- **Advanced Stage Care**
  - Complete ADL support
  - Mobility assistance
  - Swallowing therapy
  - Cognitive support

- **Therapy Support**
  - Physical therapy
  - Occupational therapy
  - Speech therapy
  - Music/Dance therapy

### User Parameters Required:
```json
{
  "disease_stage": {
    "stage": "early/moderate/advanced",
    "years_since_diagnosis": "number",
    "primary_symptoms": ["tremor", "rigidity", "bradykinesia", "postural_instability"]
  },
  "current_management": {
    "medications": "list",
    "therapy_schedule": "text",
    "neurologist": "contact_details",
    "last_assessment": "date"
  },
  "specific_challenges": {
    "mobility_issues": "mild/moderate/severe",
    "swallowing_difficulty": "yes/no",
    "speech_problems": "yes/no",
    "cognitive_issues": "yes/no"
  }
}
```

---

## 6. PHYSIOTHERAPY

### Subcategories:
- **Orthopedic Physiotherapy**
  - Joint replacement rehab
  - Fracture recovery
  - Sports injuries
  - Back/neck pain

- **Neurological Physiotherapy**
  - Stroke rehabilitation
  - Paralysis therapy
  - Balance training
  - Gait training

- **Pediatric Physiotherapy**
  - Developmental delays
  - Cerebral palsy
  - Birth injuries
  - Postural correction

- **Geriatric Physiotherapy**
  - Fall prevention
  - Strength training
  - Balance improvement
  - Pain management

- **Chest Physiotherapy**
  - Breathing exercises
  - Lung expansion
  - Secretion clearance
  - Post-COVID recovery

### User Parameters Required:
```json
{
  "condition_details": {
    "primary_complaint": "text",
    "diagnosis": "text",
    "surgery_date": "date_if_applicable",
    "pain_level": "1-10_scale"
  },
  "therapy_requirements": {
    "therapy_type": "orthopedic/neurological/pediatric/geriatric/chest",
    "sessions_per_week": "number",
    "duration_per_session": "30min/45min/60min",
    "preferred_time": "morning/afternoon/evening"
  },
  "mobility_status": {
    "ambulatory": "independent/with_support/wheelchair/bedridden",
    "equipment_available": ["walker", "crutches", "parallel_bars", "exercise_mat", "none"]
  }
}
```

---

## 7. HOME SECURITY GUARD

### Subcategories:
- **Residential Security**
  - Individual homes
  - Apartment complexes
  - Gated communities
  - Farm houses

- **Corporate Security**
  - Office buildings
  - Retail stores
  - Warehouses
  - Construction sites

- **Event Security**
  - Private parties
  - Weddings
  - Corporate events
  - Exhibitions

- **Personal Security/Bodyguard**
  - VIP protection
  - Executive security
  - Family protection
  - Travel security

- **Night Watchman**
  - Night shift only
  - Property patrol
  - Asset protection
  - Emergency response

### User Parameters Required:
```json
{
  "property_details": {
    "property_type": "residential/commercial/industrial",
    "property_size": "sqft",
    "location": "address",
    "access_points": "number"
  },
  "security_requirements": {
    "guard_count": "number",
    "shift_type": "8hrs/12hrs/24hrs",
    "armed_unarmed": "armed/unarmed",
    "uniform_required": "yes/no"
  },
  "specific_duties": {
    "primary_responsibilities": ["gate_management", "visitor_verification", "patrolling", "cctv_monitoring"],
    "equipment_handling": ["metal_detector", "baggage_scanner", "communication_devices"],
    "reporting_requirements": "daily/weekly/incident_based"
  },
  "guard_specifications": {
    "experience_level": "fresher/1-3years/3-5years/5+years",
    "age_range": "21-30/31-40/41-50",
    "language_requirements": ["hindi", "english", "local_language"],
    "special_training": ["fire_safety", "first_aid", "crowd_control", "none"]
  }
}
```

---

## 8. MOTHER AND BABY CARE

### Subcategories:
- **Newborn Care (0-3 months)**
  - Breastfeeding support
  - Sleep training
  - Umbilical care
  - Bathing assistance

- **Postnatal Mother Care**
  - Recovery assistance
  - Nutrition guidance
  - Emotional support
  - Exercise guidance

- **Baby Massage & Care**
  - Traditional massage
  - Development activities
  - Milestone tracking
  - Immunization schedule

- **Twins/Multiple Babies Care**
  - Specialized handling
  - Feeding management
  - Schedule coordination
  - Extra support

### User Parameters Required:
```json
{
  "baby_details": {
    "age_in_days": "number",
    "birth_type": "normal/cesarean",
    "birth_weight": "kg",
    "premature": "yes/no",
    "twins_or_more": "yes/no"
  },
  "mother_details": {
    "delivery_date": "date",
    "delivery_type": "normal/cesarean",
    "first_baby": "yes/no",
    "health_complications": "text"
  },
  "care_preferences": {
    "care_duration": "weeks/months",
    "live_in_out": "live_in/daily_visit",
    "massage_type": "traditional/modern/both",
    "feeding_type": "breastfeeding/formula/mixed"
  },
  "specific_needs": {
    "lactation_support": "yes/no",
    "cooking_for_mother": "yes/no",
    "elder_child_care": "yes/no",
    "night_duty": "yes/no"
  }
}
```

---

## 9. PARALYSIS CARE

### Subcategories:
- **Hemiplegia Care** (One-sided paralysis)
  - Stroke recovery
  - Brain injury care
  - Mobility training
  - ADL retraining

- **Paraplegia Care** (Lower body paralysis)
  - Spinal injury care
  - Wheelchair management
  - Bladder/bowel management
  - Transfer training

- **Quadriplegia Care** (All four limbs)
  - Complete care management
  - Respiratory support
  - Advanced equipment handling
  - 24x7 monitoring

- **Facial Paralysis Care**
  - Bell's palsy care
  - Facial exercises
  - Speech therapy support
  - Eye care

### User Parameters Required:
```json
{
  "paralysis_type": {
    "affected_area": "right_side/left_side/lower_body/all_limbs/facial",
    "cause": "stroke/accident/infection/birth_defect/other",
    "duration": "months/years",
    "recovery_potential": "good/moderate/poor"
  },
  "functional_status": {
    "sensation": "present/absent/partial",
    "bladder_control": "normal/catheter/diaper",
    "bowel_control": "normal/managed/incontinent",
    "communication": "normal/impaired/non_verbal"
  },
  "rehabilitation_plan": {
    "physiotherapy": "ongoing/required/completed",
    "occupational_therapy": "yes/no",
    "speech_therapy": "yes/no",
    "psychology_support": "yes/no"
  }
}
```

---

## 10. PATHOLOGY CARE

### Subcategories:
- **Home Sample Collection**
  - Blood tests
  - Urine tests
  - Stool tests
  - Swab collection

- **Diagnostic Services**
  - ECG at home
  - Echo cardiogram
  - X-ray (portable)
  - Ultrasound

- **Regular Monitoring**
  - Diabetes monitoring
  - Cardiac markers
  - Thyroid profiles
  - Vitamin levels

- **Corporate Health Checkups**
  - Employee screening
  - Annual health checks
  - Pre-employment tests
  - Wellness programs

### User Parameters Required:
```json
{
  "test_requirements": {
    "test_type": "routine/specific/package",
    "tests_needed": ["CBC", "lipid_profile", "liver_function", "kidney_function", "other"],
    "doctor_prescription": "yes/no",
    "urgency": "routine/urgent/emergency"
  },
  "patient_info": {
    "age": "number",
    "fasting_status": "fasting/non_fasting",
    "medical_history": "text",
    "current_medications": "text"
  },
  "service_preferences": {
    "collection_time": "early_morning/morning/afternoon/evening",
    "report_delivery": "email/hard_copy/both",
    "report_urgency": "same_day/next_day/regular"
  }
}
```

---

## 11. DIABETES MANAGEMENT

### Subcategories:
- **Type 1 Diabetes Care**
  - Insulin administration
  - Continuous monitoring
  - Carb counting
  - Hypoglycemia management

- **Type 2 Diabetes Care**
  - Medication management
  - Diet counseling
  - Exercise planning
  - Weight management

- **Gestational Diabetes Care**
  - Pregnancy monitoring
  - Diet management
  - Insulin if needed
  - Fetal monitoring

- **Diabetic Complication Care**
  - Foot care
  - Eye care
  - Kidney monitoring
  - Neuropathy management

### User Parameters Required:
```json
{
  "diabetes_profile": {
    "diabetes_type": "type1/type2/gestational/prediabetes",
    "years_since_diagnosis": "number",
    "hba1c_level": "percentage",
    "current_medications": "list"
  },
  "monitoring_needs": {
    "glucose_checks_per_day": "number",
    "insulin_administration": "yes/no",
    "continuous_glucose_monitor": "yes/no",
    "diet_plan_required": "yes/no"
  },
  "complications": {
    "retinopathy": "yes/no",
    "neuropathy": "yes/no",
    "nephropathy": "yes/no",
    "foot_problems": "yes/no"
  },
  "lifestyle_factors": {
    "physical_activity": "sedentary/moderate/active",
    "dietary_preference": "vegetarian/non_vegetarian/vegan",
    "work_schedule": "regular/shift/irregular",
    "stress_level": "low/moderate/high"
  }
}
```

---

## 12. HEALTH CHECK UP SERVICE

### Subcategories:
- **Basic Health Checkup**
  - Vital signs
  - Basic blood tests
  - General examination
  - Health counseling

- **Comprehensive Health Checkup**
  - Full body checkup
  - All system evaluation
  - Cancer screening
  - Cardiac assessment

- **Senior Citizen Checkup**
  - Geriatric assessment
  - Fall risk evaluation
  - Memory testing
  - Bone density check

- **Women's Health Checkup**
  - Gynecological exam
  - Breast examination
  - Hormonal profiles
  - Pregnancy tests

- **Men's Health Checkup**
  - Prostate screening
  - Testosterone levels
  - Cardiac risk assessment
  - Fitness evaluation

### User Parameters Required:
```json
{
  "patient_demographics": {
    "age": "number",
    "gender": "male/female",
    "occupation": "text",
    "lifestyle": "sedentary/active"
  },
  "checkup_preferences": {
    "package_type": "basic/comprehensive/specialized",
    "specific_concerns": ["cardiac", "diabetes", "cancer_screening", "general"],
    "last_checkup": "date",
    "frequency": "annual/biannual/first_time"
  },
  "medical_history": {
    "existing_conditions": "list",
    "family_history": "text",
    "allergies": "text",
    "current_medications": "list"
  }
}
```

---

## 13. POST SURGERY CARE

### Subcategories:
- **Cardiac Surgery Care**
  - CABG recovery
  - Valve replacement care
  - Pacemaker monitoring
  - Cardiac rehabilitation

- **Orthopedic Surgery Care**
  - Joint replacement care
  - Fracture recovery
  - Spine surgery care
  - Arthroscopy recovery

- **Abdominal Surgery Care**
  - Laparoscopy care
  - Hernia recovery
  - Appendectomy care
  - Gastric surgery care

- **Neuro Surgery Care**
  - Brain surgery recovery
  - Spine surgery care
  - Nerve surgery care
  - Shunt monitoring

- **Cancer Surgery Care**
  - Mastectomy care
  - Chemotherapy support
  - Radiation therapy support
  - Pain management

### User Parameters Required:
```json
{
  "surgery_details": {
    "surgery_type": "text",
    "surgery_date": "date",
    "hospital": "text",
    "surgeon": "contact_details"
  },
  "post_op_requirements": {
    "wound_care": "yes/no",
    "drain_management": "yes/no",
    "medication_schedule": "text",
    "physiotherapy": "yes/no"
  },
  "recovery_status": {
    "mobility_level": "bedridden/limited/improving",
    "pain_level": "1-10_scale",
    "complications": "none/infection/other",
    "follow_up_date": "date"
  },
  "home_care_needs": {
    "nursing_level": "basic/skilled/specialized",
    "duration": "weeks/months",
    "equipment_needed": ["hospital_bed", "oxygen", "wheelchair", "other"],
    "diet_restrictions": "text"
  }
}
```

---

## Common Parameters for All Services

### Basic Information:
```json
{
  "customer_details": {
    "name": "text",
    "phone": "number",
    "email": "email",
    "address": "full_address",
    "pin_code": "number",
    "preferred_language": "hindi/english/regional"
  },
  "service_timing": {
    "start_date": "date",
    "service_duration": "days/weeks/months",
    "preferred_time_slot": "morning/afternoon/evening/night",
    "urgent": "yes/no"
  },
  "billing_preferences": {
    "payment_mode": "cash/online/insurance",
    "billing_cycle": "daily/weekly/monthly",
    "advance_payment": "yes/no",
    "gst_invoice": "yes/no"
  }
}
```

---

## Database Schema Recommendations

### Tables Structure:

1. **services** (Main services table)
   - id
   - name
   - category
   - description
   - base_price
   - status

2. **service_subcategories**
   - id
   - service_id (FK)
   - subcategory_name
   - description
   - additional_cost

3. **service_parameters**
   - id
   - service_id (FK)
   - parameter_name
   - parameter_type
   - required
   - options (JSON)

4. **user_service_requests**
   - id
   - user_id
   - service_id
   - subcategory_id
   - parameters (JSON)
   - status
   - created_at

5. **service_providers**
   - id
   - name
   - service_specializations (JSON)
   - experience
   - rating
   - availability

---

## Notes for Implementation

1. **Dynamic Form Generation**: Use the parameter schemas to dynamically generate forms for each service
2. **Validation Rules**: Implement validation based on parameter types and requirements
3. **Pricing Calculation**: Use base price + subcategory additional cost + parameter-based pricing
4. **Matching Algorithm**: Match user requirements with provider specializations
5. **Booking Flow**: Implement step-by-step booking with parameter collection
6. **API Endpoints**: Create RESTful APIs for each service and subcategory

---

*Last Updated: December 2024*
*Version: 1.0*
