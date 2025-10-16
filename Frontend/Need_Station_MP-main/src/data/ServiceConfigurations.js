// Service field configurations - Optimized for user-friendliness
export const SERVICE_CONFIGURATIONS = {
  "ELDERLY_CARE": {
    basic_details: {
      patient_age: "number",
      patient_gender: "male/female",
      care_duration: "daily/weekly/monthly"
    },
    care_needs: {
      mobility_status: "mobile/needs_support/wheelchair/bedridden",
      care_hours_per_day: "4_hours/8_hours/12_hours/24_hours",
      special_requirements: "text"
    }
  },

  "NURSING_CARE": {
    patient_info: {
      patient_age: "number",
      patient_gender: "male/female",
      medical_condition: "text"
    },
    care_requirements: {
      care_type: "general_nursing/icu_care/wound_care/post_surgery",
      duration_needed: "days/weeks/months",
      shift_preference: "day_shift/night_shift/24x7"
    }
  },

  "CARETAKER_AT_HOME": {
    basic_info: {
      family_members: "number",
      primary_duties: "cooking/cleaning/patient_care/child_care/elderly_care"
    },
    work_schedule: {
      working_hours: "8_hours/12_hours/24_hours",
      accommodation: "live_in/live_out",
      food_preference: "vegetarian/non_vegetarian/any"
    }
  },

  "BEDRIDDEN_PATIENT_CARE": {
    patient_details: {
      patient_age: "number",
      medical_condition: "text",
      bedridden_since: "weeks/months/years"
    },
    care_level: {
      dependency: "partial_assistance/full_assistance",
      care_hours: "12_hours/24_hours",
      special_needs: "text"
    }
  },

  "PARKINSONS_CARE": {
    patient_info: {
      patient_age: "number",
      disease_stage: "early/moderate/advanced",
      years_diagnosed: "number"
    },
    care_needs: {
      mobility_level: "independent/needs_support/wheelchair",
      care_hours_per_day: "4_hours/8_hours/12_hours/24_hours",
      special_requirements: "text"
    }
  },

  "PHYSIOTHERAPY": {
    patient_details: {
      patient_age: "number",
      condition: "text",
      therapy_type: "orthopedic/neurological/sports_injury/post_surgery"
    },
    session_preferences: {
      sessions_per_week: "2/3/4/5/6/7",
      session_duration: "30_min/45_min/60_min",
      preferred_time: "morning/afternoon/evening"
    }
  },

  "HOME_SECURITY_GUARD": {
    property_info: {
      property_type: "residential/commercial/industrial",
      number_of_guards: "1/2/3/4_or_more"
    },
    duty_schedule: {
      shift_type: "8_hours/12_hours/24_hours",
      guard_type: "armed/unarmed",
      primary_duties: "gate_security/patrolling/cctv_monitoring/all"
    }
  },

  "MOTHER_AND_BABY_CARE": {
    baby_info: {
      baby_age_days: "number",
      delivery_type: "normal/cesarean",
      twins: "yes/no"
    },
    care_requirements: {
      care_duration: "weeks/months",
      stay_type: "live_in/daily_visit",
      services_needed: "baby_care/mother_care/both"
    }
  },

  "PARALYSIS_CARE": {
    patient_condition: {
      patient_age: "number",
      affected_area: "right_side/left_side/lower_body/full_body",
      paralysis_duration: "months/years"
    },
    care_needs: {
      mobility: "bedridden/wheelchair/partial_movement",
      care_hours: "12_hours/24_hours",
      therapy_needed: "yes/no"
    }
  },

  "PATHOLOGY_CARE": {
    test_details: {
      patient_age: "number",
      test_type: "routine_checkup/specific_tests/full_body_checkup",
      prescription_available: "yes/no"
    },
    collection_preference: {
      preferred_time: "early_morning/morning/afternoon/evening",
      report_delivery: "email/whatsapp/hard_copy",
      urgency: "routine/urgent"
    }
  },

  "DIABETES_MANAGEMENT": {
    patient_info: {
      patient_age: "number",
      diabetes_type: "type_1/type_2/gestational",
      years_diagnosed: "number"
    },
    care_requirements: {
      insulin_dependent: "yes/no",
      monitoring_frequency: "daily/twice_daily/weekly",
      diet_plan_needed: "yes/no"
    }
  },

  "HEALTH_CHECK_UP_SERVICE": {
    patient_details: {
      patient_age: "number",
      patient_gender: "male/female",
      lifestyle: "sedentary/moderately_active/active"
    },
    checkup_type: {
      package: "basic/comprehensive/senior_citizen/executive",
      specific_concern: "general/cardiac/diabetes/cancer_screening",
      preferred_time: "morning/afternoon"
    }
  },

  "POST_SURGERY_CARE": {
    surgery_info: {
      patient_age: "number",
      surgery_type: "text",
      days_since_surgery: "number"
    },
    care_requirements: {
      mobility_status: "bedridden/limited_movement/walking_with_support",
      care_duration: "days/weeks/months",
      wound_care_needed: "yes/no"
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
