/**
 * Service ID Mapping
 * Maps service names to their actual database IDs
 * Update this file when service IDs change in the database
 */

export const SERVICE_ID_MAP = {
  // Elder Care (IDs: 23-26)
  'Personal Care': 23,
  'Companion Care': 24,
  'Respite Care': 25,
  'Dementia Care': 26,
  
  // Bedridden Patient Care (IDs: 27-30)
  'Complete Bed Care': 27,
  'Stroke Patient Care': 28,
  'Coma Care': 29,
  'Palliative Care': 30,
  
  // Caretaker at Home (IDs: 31-34)
  'Live-in Caretaker': 31,
  'Part-time Caretaker': 32,
  'Cook': 33,
  'Nanny': 34,
  
  // Diabetes Care (IDs: 35-38)
  'Type 1 Diabetes': 35,
  'Type 2 Diabetes': 36,
  'Gestational Diabetes': 37,
  'Diabetes Complication': 38,
  
  // Health Checkup (IDs: 39-42)
  'Basic Health Checkup': 39,
  'Comprehensive Health Checkup': 40,
  'Senior Citizen Health Checkup': 41,
  'Women Health Checkup': 42,
  
  // Mother and Baby Care (IDs: 43-46)
  'Newborn Care': 43,
  'Postnatal Care': 44,
  'Baby Massage and Care': 45,
  'Twins Baby Care': 46,
  
  // Nursing Care (IDs: 47-50)
  'General Nursing': 47,
  'ICU Trained Nurse': 48,
  'Wound Care': 49,
  'Pediatric Nursing': 50,
  
  // Paralysis Care (IDs: 51-54)
  'Hemiplegia Care': 51,
  'Paraphlegia Care': 52,
  'Quadriplegia Care': 53,
  'Facial Paralysis Care': 54,
  
  // Parkinsons Care (IDs: 55-57, 74)
  'Early Stage Parkinsons': 55,
  'Advanced Stage Parkinsons': 56,
  'Parkinsons Therapy Support': 57,
  'Family Support Care': 74,
  
  // Pathology Care (IDs: 58-61)
  'Home Sample Collection': 58,
  'Diagnostic Services': 59,
  'Regular Monitoring': 60,
  'Corporate Health Package': 61,
  
  // Physiotherapy (IDs: 62-65)
  'Orthopedic Physiotherapy': 62,
  'Neurological Physiotherapy': 63,
  'Pediatric Physiotherapy': 64,
  'Geriatric Physiotherapy': 65,
  
  // Post Surgery Care (IDs: 66-69)
  'Cardiac Surgery Care': 66,
  'Orthopedic Surgery Care': 67,
  'Abdominal Surgery Care': 68,
  'Neuro Surgery Care': 69,
  
  // Security Guard (IDs: 70-73)
  'Home Security': 70,
  'Corporate Security': 71,
  'Event Security': 72,
  'Night Watchman': 73
};

/**
 * Get database service ID from service name
 * @param {string} serviceName - The name of the service
 * @returns {number|null} - The database ID or null if not found
 */
export const getServiceId = (serviceName) => {
  return SERVICE_ID_MAP[serviceName] || null;
};

/**
 * Get service name from database ID
 * @param {number} serviceId - The database ID
 * @returns {string|null} - The service name or null if not found
 */
export const getServiceName = (serviceId) => {
  const entry = Object.entries(SERVICE_ID_MAP).find(([_, id]) => id === serviceId);
  return entry ? entry[0] : null;
};
