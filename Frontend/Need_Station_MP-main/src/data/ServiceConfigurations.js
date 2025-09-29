// Service field configurations based on SERVICE_SUBCATEGORIES_SCHEMA.md
export const SERVICE_CONFIGURATIONS = {
  "ELDERLY_CARE": {
    patient_info: {
      age: "number",
      gender: "male/female",
      mobility_status: "mobile/partially_mobile/immobile",
      cognitive_status: "alert/mild_impairment/moderate_impairment/severe_impairment"
    },
    care_requirements: {
      duration_type: "hourly/daily/weekly/monthly",
      hours_per_day: "4/8/12/24",
      start_date: "date",
      care_level: "basic/intermediate/advanced",
      specific_needs: ["medication_reminder", "meal_preparation", "mobility_assistance", "companionship"]
    },
    medical_conditions: {
      existing_conditions: ["diabetes", "hypertension", "arthritis", "dementia", "other"],
      medications: "text",
      allergies: "text",
      emergency_contact: "phone"
    },
    preferences: {
      caregiver_gender: "male/female/no_preference",
      language_preference: ["hindi", "english", "regional"],
      dietary_restrictions: "text"
    }
  },

  "NURSING_CARE": {
    patient_details: {
      age: "number",
      gender: "male/female",
      diagnosis: "text",
      hospitalization_history: "text"
    },
    nursing_requirements: {
      care_type: "general/icu/wound_care/pediatric",
      duration: "hours/days/weeks/months",
      shift_preference: "day/night/24x7",
      procedures_needed: ["injection", "iv_line", "catheter", "wound_dressing", "tube_feeding"]
    },
    medical_equipment: {
      equipment_at_home: ["oxygen_concentrator", "ventilator", "suction_machine", "nebulizer", "none"],
      equipment_needed: ["hospital_bed", "wheelchair", "walker", "other"]
    },
    doctor_details: {
      primary_doctor: "text",
      hospital: "text",
      next_appointment: "date"
    }
  },

  "CARETAKER_AT_HOME": {
    household_info: {
      family_size: "number",
      home_type: "apartment/house/villa",
      location: "text",
      pets: "yes/no"
    },
    caretaker_duties: {
      primary_responsibilities: ["cooking", "cleaning", "patient_care", "child_care", "elderly_care"],
      working_hours: "8/10/12/24",
      accommodation: "live_in/live_out",
      days_per_week: "number"
    },
    specific_requirements: {
      cooking_type: "vegetarian/non_vegetarian/jain/vegan",
      languages_required: ["hindi", "english", "regional"],
      experience_needed: "fresher/1-2years/3-5years/5+years",
      age_preference: "18-25/26-35/36-45/45+"
    }
  },

  "BEDRIDDEN_PATIENT_CARE": {
    patient_condition: {
      diagnosis: "text",
      bedridden_duration: "weeks/months/years",
      consciousness_level: "alert/semi_conscious/unconscious",
      communication_ability: "verbal/non_verbal/none"
    },
    care_intensity: {
      dependency_level: "partial/complete",
      medical_procedures: ["tube_feeding", "catheter_care", "tracheostomy", "oxygen_therapy"],
      pressure_sore_status: "none/grade1/grade2/grade3/grade4",
      mobility_exercises: "required/not_required"
    },
    support_equipment: {
      available: ["hospital_bed", "air_mattress", "oxygen", "suction", "feeding_pump"],
      required: ["patient_lift", "wheelchair", "commode", "other"]
    }
  },

  "PARKINSONS_CARE": {
    disease_stage: {
      stage: "early/moderate/advanced",
      years_since_diagnosis: "number",
      primary_symptoms: ["tremor", "rigidity", "bradykinesia", "postural_instability"]
    },
    current_management: {
      medications: "text",
      therapy_schedule: "text",
      neurologist: "text",
      last_assessment: "date"
    },
    specific_challenges: {
      mobility_issues: "mild/moderate/severe",
      swallowing_difficulty: "yes/no",
      speech_problems: "yes/no",
      cognitive_issues: "yes/no"
    }
  },

  "PHYSIOTHERAPY": {
    condition_details: {
      primary_complaint: "text",
      diagnosis: "text",
      surgery_date: "date",
      pain_level: "1/2/3/4/5/6/7/8/9/10"
    },
    therapy_requirements: {
      therapy_type: "orthopedic/neurological/pediatric/geriatric/chest",
      sessions_per_week: "number",
      duration_per_session: "30min/45min/60min",
      preferred_time: "morning/afternoon/evening"
    },
    mobility_status: {
      ambulatory: "independent/with_support/wheelchair/bedridden",
      equipment_available: ["walker", "crutches", "parallel_bars", "exercise_mat", "none"]
    }
  },

  "HOME_SECURITY_GUARD": {
    property_details: {
      property_type: "residential/commercial/industrial",
      property_size: "text",
      location: "text",
      access_points: "number"
    },
    security_requirements: {
      guard_count: "number",
      shift_type: "8hrs/12hrs/24hrs",
      armed_unarmed: "armed/unarmed",
      uniform_required: "yes/no"
    },
    specific_duties: {
      primary_responsibilities: ["gate_management", "visitor_verification", "patrolling", "cctv_monitoring"],
      equipment_handling: ["metal_detector", "baggage_scanner", "communication_devices"],
      reporting_requirements: "daily/weekly/incident_based"
    },
    guard_specifications: {
      experience_level: "fresher/1-3years/3-5years/5+years",
      age_range: "21-30/31-40/41-50",
      language_requirements: ["hindi", "english", "local_language"],
      special_training: ["fire_safety", "first_aid", "crowd_control", "none"]
    }
  },

  "MOTHER_AND_BABY_CARE": {
    baby_details: {
      age_in_days: "number",
      birth_type: "normal/cesarean",
      birth_weight: "number",
      premature: "yes/no",
      twins_or_more: "yes/no"
    },
    mother_details: {
      delivery_date: "date",
      delivery_type: "normal/cesarean",
      first_baby: "yes/no",
      health_complications: "text"
    },
    care_preferences: {
      care_duration: "weeks/months",
      live_in_out: "live_in/daily_visit",
      massage_type: "traditional/modern/both",
      feeding_type: "breastfeeding/formula/mixed"
    },
    specific_needs: {
      lactation_support: "yes/no",
      cooking_for_mother: "yes/no",
      elder_child_care: "yes/no",
      night_duty: "yes/no"
    }
  },

  "PARALYSIS_CARE": {
    paralysis_type: {
      affected_area: "right_side/left_side/lower_body/all_limbs/facial",
      cause: "stroke/accident/infection/birth_defect/other",
      duration: "months/years",
      recovery_potential: "good/moderate/poor"
    },
    functional_status: {
      sensation: "present/absent/partial",
      bladder_control: "normal/catheter/diaper",
      bowel_control: "normal/managed/incontinent",
      communication: "normal/impaired/non_verbal"
    },
    rehabilitation_plan: {
      physiotherapy: "ongoing/required/completed",
      occupational_therapy: "yes/no",
      speech_therapy: "yes/no",
      psychology_support: "yes/no"
    }
  },

  "PATHOLOGY_CARE": {
    test_requirements: {
      test_type: "routine/specific/package",
      tests_needed: ["CBC", "lipid_profile", "liver_function", "kidney_function", "other"],
      doctor_prescription: "yes/no",
      urgency: "routine/urgent/emergency"
    },
    patient_info: {
      age: "number",
      fasting_status: "fasting/non_fasting",
      medical_history: "text",
      current_medications: "text"
    },
    service_preferences: {
      collection_time: "early_morning/morning/afternoon/evening",
      report_delivery: "email/hard_copy/both",
      report_urgency: "same_day/next_day/regular"
    }
  },

  "DIABETES_MANAGEMENT": {
    diabetes_profile: {
      diabetes_type: "type1/type2/gestational/prediabetes",
      years_since_diagnosis: "number",
      hba1c_level: "text",
      current_medications: "text"
    },
    monitoring_needs: {
      glucose_checks_per_day: "number",
      insulin_administration: "yes/no",
      continuous_glucose_monitor: "yes/no",
      diet_plan_required: "yes/no"
    },
    complications: {
      retinopathy: "yes/no",
      neuropathy: "yes/no",
      nephropathy: "yes/no",
      foot_problems: "yes/no"
    },
    lifestyle_factors: {
      physical_activity: "sedentary/moderate/active",
      dietary_preference: "vegetarian/non_vegetarian/vegan",
      work_schedule: "regular/shift/irregular",
      stress_level: "low/moderate/high"
    }
  },

  "HEALTH_CHECK_UP_SERVICE": {
    patient_demographics: {
      age: "number",
      gender: "male/female",
      occupation: "text",
      lifestyle: "sedentary/active"
    },
    checkup_preferences: {
      package_type: "basic/comprehensive/specialized",
      specific_concerns: ["cardiac", "diabetes", "cancer_screening", "general"],
      last_checkup: "date",
      frequency: "annual/biannual/first_time"
    },
    medical_history: {
      existing_conditions: "text",
      family_history: "text",
      allergies: "text",
      current_medications: "text"
    }
  },

  "POST_SURGERY_CARE": {
    surgery_details: {
      surgery_type: "text",
      surgery_date: "date",
      hospital: "text",
      surgeon: "text"
    },
    post_op_requirements: {
      wound_care: "yes/no",
      drain_management: "yes/no",
      medication_schedule: "text",
      physiotherapy: "yes/no"
    },
    recovery_status: {
      mobility_level: "bedridden/limited/improving",
      pain_level: "1/2/3/4/5/6/7/8/9/10",
      complications: "none/infection/other",
      follow_up_date: "date"
    },
    home_care_needs: {
      nursing_level: "basic/skilled/specialized",
      duration: "weeks/months",
      equipment_needed: ["hospital_bed", "oxygen", "wheelchair", "other"],
      diet_restrictions: "text"
    }
  }
};

// Helper function to get service configuration by name
export const getServiceConfiguration = (serviceName) => {
  const serviceKey = serviceName.toUpperCase().replace(/\s+/g, '_');
  return SERVICE_CONFIGURATIONS[serviceKey] || {};
};

// Helper function to get all available services
export const getAvailableServices = () => {
  return Object.keys(SERVICE_CONFIGURATIONS).map(key => 
    key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
};

// Service name to URL path mapping
export const SERVICE_URL_MAPPING = {
  "Home Security Guard": "security-guard",
  "Elderly Care": "elderly-care", 
  "Nursing Care": "nursing-care",
  "Caretaker At Home": "caretaker-at-home",
  "Bedridden Patient Care": "bedridden-patient-care",
  "Parkinson's Care": "parkinsons-care",
  "Physiotherapy": "physiotherapy",
  "Mother And Baby Care": "mother-baby-care",
  "Paralysis Care": "paralysis-care",
  "Pathology Care": "pathology-care",
  "Diabetes Management": "diabetes-management",
  "Health Check Up Services": "health-check-up-services",
  "Post Surgery Care": "post-surgery-care"
};

// Helper function to get URL path from service name
export const getServiceUrlPath = (serviceName) => {
  return SERVICE_URL_MAPPING[serviceName] || serviceName.toLowerCase().replace(/\s+/g, '-');
};
