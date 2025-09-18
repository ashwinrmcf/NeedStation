import image1 from '../../assets/images/services/security/securityGuard.png';
import image2 from '../../assets/images/services/parkinsonsCare.png';
import image3 from '../../assets/images/services/bedriddenPatient.png';
import image4 from '../../assets/images/services/motherAndBaby.png';
import image5 from '../../assets/images/services/paralysisCare.png';
import image6 from '../../assets/images/services/elderlyCare.png';
import image7 from '../../assets/images/services/nursingCare.png';
import image8 from '../../assets/images/services/pathologyCare.png';
import image9 from '../../assets/images/services/diabetesManagement.png';
import image10 from '../../assets/images/services/healthCheckUp.png';
import image11 from '../../assets/images/services/physiotherapy.png';
import image12 from '../../assets/images/services/medicalCare.png';
import image13 from '../../assets/images/services/homeHealthCare.png';

const ServicesData = [
  {
    id: 1,
    heading: "Home Security Guard",
    description: "Professional security personnel providing comprehensive protection for your home and family with round-the-clock vigilance and safety monitoring.",
    highlights: [
      "24/7 security monitoring and surveillance",
      "Trained professionals with security expertise",
      "Emergency response and incident management",
      "Access control and visitor management"
    ],
    offeredServices: [
      "24-hour residential security monitoring",
      "Perimeter patrol and surveillance",
      "Access control and gate management",
      "Emergency response coordination",
      "Incident reporting and documentation",
      "Visitor screening and management"
    ],
    subCategories: [
      "Unarmed residential guard (manned guarding for houses/gated communities)",
      "Armed security guard (for high-risk homes or valuables)",
      "Bodyguard/personal protection (close protection for individuals/VIPs)",
      "CCTV surveillance operator (video monitoring and alarm response)",
      "Mobile patrol unit (vehicle-based patrols day/night)",
      "Event & crowd security (private event or community security)"
    ],
    image: [image1],
  },
  {
    id: 2,
    heading: "Parkinsons Care",
    description: "Specialized care services for individuals with Parkinson's disease, providing comprehensive support for daily activities and symptom management.",
    highlights: [
      "Specialized Parkinson's disease expertise",
      "Movement and mobility assistance",
      "Medication management and monitoring",
      "Emotional support and companionship"
    ],
    offeredServices: [
      "Daily living assistance and personal care",
      "Medication reminders and management",
      "Physical therapy and exercise support",
      "Speech and swallowing assistance",
      "Fall prevention and safety measures",
      "Emotional support and counseling"
    ],
    subCategories: [
      "Mobility support & physiotherapy (exercise programs to improve gait and balance)",
      "Medication and symptom management (med schedule adherence, side-effect monitoring)",
      "Speech and swallowing therapy (to maintain communication and safe eating)",
      "Daily living assistance (help with dressing, transfers, using adaptive devices)",
      "Nutritional and diet support (managing diet for digestive/mobility issues)",
      "Psychosocial support (counseling for depression/anxiety and family education)"
    ],
    image: [image2],
  },
  {
    id: 3,
    heading: "Bedridden Patient Care",
    description: "Comprehensive care services for bedridden patients, ensuring comfort, medical support, and quality of life in the home environment.",
    highlights: [
      "Round-the-clock patient monitoring",
      "Medical equipment management",
      "Pressure sore prevention and care",
      "Nutritional support and feeding assistance"
    ],
    offeredServices: [
      "Personal hygiene and bathing assistance",
      "Positioning and turning to prevent bed sores",
      "Medication administration and monitoring",
      "Wound care and medical equipment management",
      "Nutritional support and feeding assistance",
      "Physical therapy and range of motion exercises"
    ],
    subCategories: [
      "Post-operative recovery & wound care (dressing changes, drain care)",
      "Chronic disease management (e.g. diabetes monitoring, respiratory support)",
      "Palliative and end-of-life support (comfort measures, pain relief)",
      "Medication and IV therapy (injections, infusions, medication reminders)",
      "Personal hygiene, feeding & toileting assistance (bathing, feeding, diapering)",
      "Pressure sore prevention & mobility exercises (regular repositioning, bed exercises)"
    ],
    image: [image3],
  },
  {
    id: 4,
    heading: "Mother and Baby Care",
    description: "Specialized postnatal care services for new mothers and comprehensive newborn care, supporting the transition into parenthood.",
    highlights: [
      "Expert newborn care and development support",
      "Postpartum recovery assistance",
      "Breastfeeding support and guidance",
      "24-hour mother and baby monitoring"
    ],
    offeredServices: [
      "Newborn feeding, bathing, and diaper care",
      "Postpartum recovery support and wound care",
      "Breastfeeding assistance and lactation support",
      "Sleep training and routine establishment",
      "Maternal emotional support and counseling",
      "Baby development monitoring and guidance"
    ],
    subCategories: [
      "Postnatal mother care (rest support, post-delivery massage, perineal care)",
      "Newborn baby care (bathing, feeding, sleep routines, nappy changes)",
      "Lactation & breastfeeding support (nurse assistance with feeding technique)",
      "Pediatric check-ups & immunization guidance (scheduling vaccinations, doctor calls)",
      "Emotional support & counseling for mother (postpartum counseling, support groups)",
      "Baby grooming & massage (mild massage exercises, cord care, nursery setup guidance)"
    ],
    image: [image4],
  },
  {
    id: 5,
    heading: "Paralysis Care",
    description: "Specialized rehabilitation and care services for individuals with paralysis, focusing on maximizing independence and quality of life.",
    highlights: [
      "Specialized paralysis care expertise",
      "Mobility and transfer assistance",
      "Rehabilitation therapy support",
      "Adaptive equipment training"
    ],
    offeredServices: [
      "Personal care and hygiene assistance",
      "Transfer and mobility support",
      "Physical therapy and rehabilitation exercises",
      "Bowel and bladder management",
      "Skin care and pressure sore prevention",
      "Adaptive equipment training and support"
    ],
    subCategories: [
      "Daily living assistance (bathing, grooming, feeding)",
      "Physical therapy & mobility training (to regain strength and prevent contractures)",
      "Medication management and nursing care (medication reminders, catheter care)",
      "Pressure sore prevention & skin care (skin checks, turning schedule)",
      "Nutritional support (feeding assistance and dietary guidance)",
      "Emotional and rehabilitative support (counseling, family education)"
    ],
    image: [image5],
  },
  {
    id: 6,
    heading: "Elderly Care",
    description: "Compassionate and professional care services tailored to meet the unique needs of seniors, promoting independence and well-being.",
    highlights: [
      "Personalized senior care plans",
      "Companionship and social engagement",
      "Safety monitoring and fall prevention",
      "Medication management and health monitoring"
    ],
    offeredServices: [
      "Personal care and daily living assistance",
      "Companionship and social interaction",
      "Medication reminders and health monitoring",
      "Light housekeeping and meal preparation",
      "Transportation and errand assistance",
      "Safety monitoring and emergency response"
    ],
    subCategories: [
      "Skilled geriatric nursing (medication management, wound care)",
      "Companion and social support (conversation, activities to reduce isolation)",
      "Dementia/Alzheimer's care (memory exercises, safe routines)",
      "Physiotherapy and mobility exercises (fall prevention, strengthening)",
      "Post-hospital recovery (medication reminders, mobility support after discharge)",
      "Palliative/chronic disease care (pain management, comfort in long-term illness)"
    ],
    image: [image6],
  },
  {
    id: 7,
    heading: "Nursing Care",
    description: "Professional nursing services provided by qualified registered nurses, delivering medical care and health monitoring in the comfort of your home.",
    highlights: [
      "Registered nurse expertise",
      "Medical care and treatment administration",
      "Health monitoring and assessment",
      "Coordination with healthcare providers"
    ],
    offeredServices: [
      "Medication administration and IV therapy",
      "Wound care and dressing changes",
      "Vital signs monitoring and health assessment",
      "Chronic disease management",
      "Post-surgical care and recovery support",
      "Health education and family training"
    ],
    subCategories: [
      "IV therapy & medication administration (injections, infusions, drug management)",
      "Tube feeding (nasogastric/Ryles feeding setup and care)",
      "Wound dressing and ostomy care (dressing changes, colostomy bag management)",
      "Vital sign monitoring (temperature, blood pressure, oxygen levels)",
      "Diet planning & nutrition support (special diets, feeding schedules)",
      "Respiratory therapies (nebulization, suctioning, oxygen support)"
    ],
    image: [image7],
  },
  {
    id: 8,
    heading: "Pathology Care",
    description: "Convenient home-based pathology services including sample collection, diagnostic tests, and health screenings with professional medical staff.",
    highlights: [
      "Home sample collection convenience",
      "Comprehensive diagnostic testing",
      "Quick and accurate results",
      "Professional medical technicians"
    ],
    offeredServices: [
      "Blood sample collection and testing",
      "Urine and stool sample analysis",
      "Diagnostic imaging coordination",
      "Health screening packages",
      "Report delivery and consultation",
      "Follow-up testing and monitoring"
    ],
    subCategories: [
      "Routine blood tests (CBC, glucose, lipids, kidney/liver panels)",
      "Urine and stool analysis (kidney function, infections, GI disorders)",
      "Imaging diagnostics (X-ray, ECG, ultrasound scans)",
      "Specialized test panels (hormones, cardiac markers, cancer markers)",
      "Genetic and biopsy services (chromosomal tests, pathology reports)",
      "Preventive health checkup packages (bundled lab tests for screening)"
    ],
    image: [image8],
  },
  {
    id: 9,
    heading: "Diabetes Management",
    description: "Comprehensive diabetes care including monitoring, medication management, lifestyle guidance, and education for optimal blood sugar control.",
    highlights: [
      "Blood sugar monitoring and tracking",
      "Personalized diabetes management plans",
      "Nutritional counseling and diet planning",
      "Medication management and insulin support"
    ],
    offeredServices: [
      "Blood glucose monitoring and tracking",
      "Insulin administration and management",
      "Diabetic diet planning and nutrition counseling",
      "Foot care and complication prevention",
      "Exercise planning and lifestyle modification",
      "Emergency response for diabetic complications"
    ],
    subCategories: [
      "Blood glucose monitoring (glucometer kits and test strips)",
      "Personalized diet & nutrition counseling (meal planning, glycemic diets)",
      "Exercise and lifestyle coaching (health coach for weight management)",
      "Medication/insulin management (injection training, adherence support)",
      "Diabetic foot care (wound care, circulation monitoring)",
      "Regular complication screening (retinopathy, nephropathy checks)"
    ],
    image: [image9],
  },
  {
    id: 10,
    heading: "Health Check Up Services",
    description: "Regular comprehensive health screenings and medical check-ups conducted at your convenience to monitor and maintain optimal health.",
    highlights: [
      "Comprehensive health assessments",
      "Preventive screening and early detection",
      "Convenient home-based examinations",
      "Personalized health recommendations"
    ],
    offeredServices: [
      "Complete physical examinations",
      "Vital signs monitoring and assessment",
      "Blood tests and laboratory screenings",
      "Cardiac health evaluation",
      "Vision and hearing assessments",
      "Preventive health counseling"
    ],
    subCategories: [
      "Basic/full-body checkup packages (CBC, sugar, lipid, liver, kidney profiles)",
      "Executive/comprehensive checkups (adds cardiac markers, vitamins, hormones)",
      "Women's health packages (PCOD, prenatal tests, thyroid panels)",
      "Corporate/occupational health screenings (health camps and mass check-ups)",
      "Disease-specific panels (heart risk profile, cancer screening)",
      "Wellness profiles (immunity panel, sexual health, vitamin profile)"
    ],
    image: [image10],
  },
  {
    id: 11,
    heading: "Physiotherapy",
    description: "Professional physiotherapy services for rehabilitation, pain management, and mobility improvement delivered by licensed physiotherapists at home.",
    highlights: [
      "Licensed physiotherapist expertise",
      "Personalized rehabilitation programs",
      "Pain management and mobility improvement",
      "Post-injury and post-surgical recovery"
    ],
    offeredServices: [
      "Physical assessment and treatment planning",
      "Therapeutic exercises and mobility training",
      "Pain management and relief techniques",
      "Post-surgical rehabilitation",
      "Sports injury recovery and prevention",
      "Assistive device training and support"
    ],
    subCategories: [
      "Orthopaedic rehabilitation (joint pain, arthritis, post-surgical rehab)",
      "Neurological rehabilitation (stroke, paralysis, cerebral palsy)",
      "Sports injury therapy (muscle strains, ligament injuries)",
      "Chest/respiratory physiotherapy (post-COVID rehab, COPD care)",
      "Spinal/disc therapy (back pain, slipped disc rehab)",
      "Geriatric physiotherapy (balance, fall-prevention exercises)"
    ],
    image: [image11],
  },
  {
    id: 12,
    heading: "Post Surgery Care",
    description: "Specialized post-operative care and recovery support provided in the comfort of your home by trained medical professionals.",
    highlights: [
      "Post-surgical recovery expertise",
      "Wound care and healing monitoring",
      "Pain management and medication support",
      "Rehabilitation and mobility assistance"
    ],
    offeredServices: [
      "Surgical wound care and dressing changes",
      "Pain management and medication administration",
      "Mobility assistance and physical therapy",
      "Infection prevention and monitoring",
      "Recovery progress tracking and reporting",
      "Coordination with surgical team"
    ],
    subCategories: [
      "Surgical wound care & dressing changes",
      "Medication and IV fluid management",
      "Pain management (analgesia scheduling, alternative therapy)",
      "Nutritional support & enteral feeding (tube feeding if needed)",
      "Catheter and drain care (urinary catheter changes, drain tube monitoring)",
      "Mobility exercises & physiotherapy (early ambulation, breathing exercises)"
    ],
    image: [image12],
  },
  {
    id: 13,
    heading: "Caretaker at Home",
    description: "Dedicated professional caretakers providing personalized assistance, companionship, and support for daily living activities in your home.",
    highlights: [
      "Personalized care and assistance",
      "Companionship and emotional support",
      "Daily living activity support",
      "Flexible care scheduling"
    ],
    offeredServices: [
      "Personal care and hygiene assistance",
      "Meal preparation and feeding support",
      "Light housekeeping and organization",
      "Companionship and social interaction",
      "Transportation and errand assistance",
      "Safety monitoring and emergency response"
    ],
    subCategories: [
      "Assistance with daily living (bathing, dressing, toileting)",
      "Companion care and emotional support (conversation, activities)",
      "Dementia/Alzheimer's care (memory aid, safe environment)",
      "Post-operative/short-term care (support during recovery at home)",
      "Physiotherapy/mobility assistance (help with prescribed exercises)",
      "Live-in or 24×7 caregiving (overnight supervision, extended support)"
    ],
    image: [image13],
  }
];

export default ServicesData;