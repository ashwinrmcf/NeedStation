/**
 * NeedBot Knowledge Base
 * Comprehensive information about NeedStation platform
 * This serves as the "brain" of NeedBot for intelligent responses
 */

export const NeedBotKnowledgeBase = {
  // ==================== PLATFORM INFORMATION ====================
  platform: {
    name: "NeedStation",
    tagline: "Professional Healthcare Solutions at Home",
    description: "NeedStation is a comprehensive healthcare platform connecting you with verified, skilled caregivers and medical professionals for home-based care services.",
    mission: "To make quality healthcare and caregiving services accessible, affordable, and reliable for everyone at home.",
    vision: "To become India's most trusted platform for home healthcare and caregiving services.",
    
    features: [
      "Verified service providers with background checks",
      "Real-time booking and scheduling",
      "Transparent pricing with no hidden charges",
      "Multiple payment options",
      "24/7 customer support",
      "Service quality guarantee",
      "Easy cancellation and rescheduling",
      "Multi-language support"
    ],
    
    benefits: {
      forCustomers: [
        "Save time with instant booking",
        "Get trusted and verified professionals",
        "Compare prices and reviews",
        "Flexible scheduling",
        "Secure payment options",
        "Quality assurance"
      ],
      forHelpers: [
        "Flexible working hours",
        "Steady income opportunities",
        "No commission on first 10 bookings",
        "Training and skill development",
        "Insurance coverage",
        "Direct customer connection"
      ]
    }
  },

  // ==================== SERVICES CATALOG ====================
  services: {
    securityGuard: {
      name: "Home Security Guard",
      description: "Professional security personnel to protect your home and family with 24/7 vigilance",
      route: "/services/security-guard",
      subcategories: [
        "Perimeter monitoring",
        "Access control",
        "Emergency response",
        "Regular patrol duties",
        "Visitor management"
      ],
      pricing: {
        starting: "₹800/day",
        average: "₹800-1200/day",
        factors: ["Duration (8-24 hours)", "Number of guards", "Location", "Special requirements"]
      },
      duration: "8-24 hours",
      availability: "24/7",
      keywords: ["security", "guard", "protection", "safety", "watchman", "surveillance"]
    },

    parkinsonsCare: {
      name: "Parkinsons Care",
      description: "Specialized care and support for patients with Parkinson's disease",
      route: "/services/parkinsons-care",
      subcategories: [
        "Medication management",
        "Mobility assistance",
        "Speech therapy support",
        "Specialized exercises",
        "Family training"
      ],
      pricing: {
        starting: "₹1500/day",
        average: "₹1500-2500/day",
        factors: ["Care duration", "Level of assistance", "Specialized needs"]
      },
      duration: "4-12 hours",
      availability: "Daily",
      keywords: ["parkinsons", "parkinson", "tremor", "movement disorder", "neurological"]
    },

    bedriddenCare: {
      name: "Bedridden Patient Care",
      description: "Comprehensive bedridden care with daily assistance and medical support",
      route: "/services/bedridden-patient-care",
      subcategories: [
        "Personal hygiene",
        "Positioning care",
        "Wound care",
        "Medication administration",
        "Emotional support"
      ],
      pricing: {
        starting: "₹1200/day",
        average: "₹1200-2000/day",
        factors: ["Care hours", "Medical complexity", "Equipment needs"]
      },
      duration: "8-24 hours",
      availability: "24/7",
      keywords: ["bedridden", "bed", "patient", "immobile", "confined"]
    },

    motherBabyCare: {
      name: "Mother and Baby Care",
      description: "Postnatal care for mothers and comprehensive newborn care services",
      route: "/services/mother-baby-care",
      subcategories: [
        "Breastfeeding support",
        "Newborn care",
        "Recovery assistance",
        "Sleep training",
        "Nutritional guidance"
      ],
      pricing: {
        starting: "₹1000/day",
        average: "₹1000-1800/day",
        factors: ["Care duration", "Specialized needs", "Number of babies"]
      },
      duration: "8-24 hours",
      availability: "24/7",
      keywords: ["mother", "baby", "newborn", "postnatal", "maternity", "infant", "pregnancy"]
    },

    paralysisCare: {
      name: "Paralysis Care",
      description: "Specialized care and rehabilitation services for patients with paralysis",
      route: "/services/paralysis-care",
      subcategories: [
        "Physiotherapy assistance",
        "Mobility support",
        "Daily living activities",
        "Pressure sore prevention",
        "Rehabilitation exercises"
      ],
      pricing: {
        starting: "₹1400/day",
        average: "₹1400-2200/day",
        factors: ["Type of paralysis", "Care duration", "Rehabilitation needs"]
      },
      duration: "6-12 hours",
      availability: "Daily",
      keywords: ["paralysis", "stroke", "hemiplegia", "paraplegia", "disability"]
    },

    elderlyCare: {
      name: "Elderly Care",
      description: "Compassionate and professional care tailored to meet the needs of seniors",
      route: "/services/elderly-care",
      subcategories: [
        "Companionship",
        "Medication reminders",
        "Meal preparation",
        "Mobility support",
        "Health monitoring"
      ],
      pricing: {
        starting: "₹900/day",
        average: "₹900-1600/day",
        factors: ["Care hours", "Level of assistance", "Medical needs"]
      },
      duration: "4-24 hours",
      availability: "24/7",
      keywords: ["elderly", "senior", "old age", "geriatric", "aged"]
    },

    nursingCare: {
      name: "Nursing Care",
      description: "Professional nursing services with qualified nurses for medical care at home",
      route: "/services/nursing-care",
      subcategories: [
        "Medication administration",
        "Wound dressing",
        "IV therapy",
        "Catheter care",
        "Vital sign monitoring"
      ],
      pricing: {
        starting: "₹2000/day",
        average: "₹2000-3500/day",
        factors: ["Nurse qualification", "Care complexity", "Duration"]
      },
      duration: "8-24 hours",
      availability: "24/7",
      keywords: ["nurse", "nursing", "medical", "healthcare", "RN", "LPN"]
    },

    pathologyCare: {
      name: "Pathology Care",
      description: "Home-based pathology services including sample collection and diagnostic tests",
      route: "/services/pathology-care",
      subcategories: [
        "Blood collection",
        "Urine tests",
        "ECG services",
        "Lab transportation",
        "Digital reports"
      ],
      pricing: {
        starting: "₹300/visit",
        average: "₹300-800/visit",
        factors: ["Type of tests", "Number of tests", "Location"]
      },
      duration: "30-60 minutes",
      availability: "7 AM - 7 PM",
      keywords: ["pathology", "lab", "test", "blood", "diagnostic", "sample"]
    },

    diabetesManagement: {
      name: "Diabetes Management",
      description: "Comprehensive diabetes care including monitoring, medication management, and lifestyle guidance",
      route: "/services/diabetes-management",
      subcategories: [
        "Blood sugar monitoring",
        "Insulin administration",
        "Diet planning",
        "Exercise guidance",
        "Foot care"
      ],
      pricing: {
        starting: "₹800/day",
        average: "₹800-1400/day",
        factors: ["Monitoring frequency", "Care duration", "Complexity"]
      },
      duration: "2-8 hours",
      availability: "Daily",
      keywords: ["diabetes", "sugar", "insulin", "diabetic", "glucose"]
    },

    healthCheckup: {
      name: "Health Check Up Services",
      description: "Regular health screenings and comprehensive medical check-ups at your convenience",
      route: "/services/health-check-up-services",
      subcategories: [
        "Vital signs check",
        "Basic tests",
        "Health assessment",
        "Preventive guidance",
        "Provider coordination"
      ],
      pricing: {
        starting: "₹500/visit",
        average: "₹500-1200/visit",
        factors: ["Type of checkup", "Tests included", "Location"]
      },
      duration: "1-2 hours",
      availability: "9 AM - 6 PM",
      keywords: ["health", "checkup", "screening", "examination", "preventive"]
    },

    physiotherapy: {
      name: "Physiotherapy",
      description: "Professional physiotherapy services for rehabilitation and pain management at home",
      route: "/services/physiotherapy",
      subcategories: [
        "Movement therapy",
        "Pain management",
        "Post-surgery rehabilitation",
        "Strength training",
        "Mobility improvement"
      ],
      pricing: {
        starting: "₹600/session",
        average: "₹600-1000/session",
        factors: ["Session duration", "Treatment type", "Therapist experience"]
      },
      duration: "45-90 minutes",
      availability: "9 AM - 7 PM",
      keywords: ["physiotherapy", "physio", "therapy", "rehabilitation", "exercise"]
    },

    postSurgeryCare: {
      name: "Post Surgery Care",
      description: "Specialized post-operative care and recovery support in the comfort of your home",
      route: "/services/post-surgery-care",
      subcategories: [
        "Wound management",
        "Medication support",
        "Mobility assistance",
        "Recovery monitoring",
        "Team coordination"
      ],
      pricing: {
        starting: "₹1500/day",
        average: "₹1500-2800/day",
        factors: ["Surgery type", "Care complexity", "Duration"]
      },
      duration: "8-24 hours",
      availability: "24/7",
      keywords: ["surgery", "post-surgery", "post-operative", "recovery", "surgical"]
    },

    caretakerHome: {
      name: "Caretaker at Home",
      description: "Dedicated caretakers providing personalized assistance and companionship at home",
      route: "/services/caretaker-at-home",
      subcategories: [
        "Personal care",
        "Companionship",
        "Light housekeeping",
        "Meal preparation",
        "Emotional support"
      ],
      pricing: {
        starting: "₹700/day",
        average: "₹700-1300/day",
        factors: ["Care hours", "Services required", "Location"]
      },
      duration: "4-24 hours",
      availability: "24/7",
      keywords: ["caretaker", "caregiver", "attendant", "helper", "companion"]
    }
  },

  // ==================== HOW IT WORKS ====================
  howItWorks: {
    forCustomers: [
      {
        step: 1,
        title: "Browse Services",
        description: "Explore our wide range of home services and select what you need"
      },
      {
        step: 2,
        title: "Book Online",
        description: "Choose your preferred date, time, and service provider"
      },
      {
        step: 3,
        title: "Get Service",
        description: "Our verified professional arrives at your doorstep"
      },
      {
        step: 4,
        title: "Pay & Review",
        description: "Pay securely and rate your experience"
      }
    ],
    forHelpers: [
      {
        step: 1,
        title: "Register",
        description: "Sign up with your details and upload required documents"
      },
      {
        step: 2,
        title: "Verification",
        description: "Complete background check and skill verification"
      },
      {
        step: 3,
        title: "Get Bookings",
        description: "Receive job requests from nearby customers"
      },
      {
        step: 4,
        title: "Earn Money",
        description: "Complete jobs and receive payments directly"
      }
    ]
  },

  // ==================== PRICING & PAYMENTS ====================
  pricing: {
    model: "Transparent pricing with no hidden charges",
    paymentMethods: [
      "Credit/Debit Cards",
      "UPI (Google Pay, PhonePe, Paytm)",
      "Net Banking",
      "Cash on Service",
      "Wallets"
    ],
    refundPolicy: "100% refund if service provider doesn't show up",
    cancellation: {
      free: "Free cancellation up to 2 hours before service",
      charges: "50% charge if cancelled within 2 hours",
      noShow: "Full refund if provider doesn't arrive"
    }
  },

  // ==================== SAFETY & TRUST ====================
  safety: {
    verification: [
      "Government ID verification",
      "Police background check",
      "Address verification",
      "Skill assessment",
      "Reference checks"
    ],
    insurance: "All service providers are insured for customer safety",
    support: "24/7 customer support for any issues",
    ratings: "Transparent rating and review system"
  },

  // ==================== COMMON QUESTIONS & ANSWERS ====================
  faq: {
    booking: {
      "How do I book a service?": "Simply browse services, select what you need, choose date/time, and confirm booking. You can book through our website or app.",
      "Can I book for same day?": "Yes, subject to availability. We recommend booking at least 2 hours in advance.",
      "How do I cancel a booking?": "Go to 'My Bookings', select the booking, and click 'Cancel'. Free cancellation available up to 2 hours before service.",
      "Can I reschedule?": "Yes, you can reschedule up to 2 hours before the service time at no extra cost."
    },
    payment: {
      "What payment methods do you accept?": "We accept cards, UPI, net banking, wallets, and cash on service completion.",
      "Is advance payment required?": "No, you can pay after service completion. However, online payment gets you better deals.",
      "Are there any hidden charges?": "No, all charges are displayed upfront. What you see is what you pay.",
      "Do you provide invoices?": "Yes, digital invoices are sent via email and available in your account."
    },
    service: {
      "Are service providers verified?": "Yes, all providers undergo background checks, ID verification, and skill assessment.",
      "What if I'm not satisfied?": "Contact our support within 24 hours. We'll either send another provider or provide a refund.",
      "Do providers bring their own tools?": "Yes, providers come with basic tools. Any special equipment or materials are discussed beforehand.",
      "Can I request the same provider again?": "Yes, you can favorite providers and request them for future bookings."
    },
    account: {
      "How do I create an account?": "Click 'Sign Up', enter your details, verify your phone/email, and you're ready to go.",
      "Is registration free?": "Yes, registration is completely free for customers.",
      "Can I use without registration?": "You need to register to book services, but you can browse without an account.",
      "How do I reset my password?": "Click 'Forgot Password' on the login page and follow the instructions sent to your email."
    },
    helper: {
      "How do I become a helper?": "Visit 'Become a Helper' page, fill the registration form, submit documents, and complete verification.",
      "Is there any registration fee?": "No, registration is free. We don't charge any joining fee.",
      "How much can I earn?": "Earnings depend on services provided, hours worked, and ratings. Top helpers earn ₹20,000-50,000/month.",
      "When do I get paid?": "Payments are processed within 24-48 hours of service completion."
    }
  },

  // ==================== TROUBLESHOOTING ====================
  troubleshooting: {
    "Service provider didn't arrive": "Contact support immediately. We'll send another provider or provide full refund.",
    "Payment failed": "Check your internet connection and payment details. Try again or use a different payment method.",
    "Can't find my booking": "Check 'My Bookings' in your account. If still not visible, contact support with booking details.",
    "App not working": "Clear cache, update to latest version, or try using the website instead.",
    "Wrong service booked": "Cancel the booking (if within time limit) and book the correct service, or contact support for help."
  },

  // ==================== CONTACT INFORMATION ====================
  contact: {
    support: {
      phone: "1800-XXX-XXXX",
      email: "support@needstation.com",
      hours: "24/7 availability",
      responseTime: "Within 30 minutes"
    },
    emergency: {
      phone: "Emergency hotline available",
      description: "For urgent service issues or safety concerns"
    },
    social: {
      facebook: "facebook.com/needstation",
      twitter: "@needstation",
      instagram: "@needstation",
      linkedin: "linkedin.com/company/needstation"
    }
  },

  // ==================== LOCATIONS ====================
  serviceAreas: {
    currentCities: [
      "Bangalore",
      "Mumbai",
      "Delhi NCR",
      "Hyderabad",
      "Chennai",
      "Pune",
      "Kolkata"
    ],
    comingSoon: [
      "Ahmedabad",
      "Jaipur",
      "Lucknow",
      "Kochi"
    ],
    coverage: "Expanding to 50+ cities by 2026"
  },

  // ==================== SPECIAL OFFERS ====================
  offers: {
    firstTime: "Get 20% off on your first booking",
    referral: "Refer a friend and both get ₹100 credit",
    subscription: "Subscribe for monthly services and save up to 30%",
    seasonal: "Check our app for seasonal discounts and festival offers"
  }
};

export default NeedBotKnowledgeBase;
