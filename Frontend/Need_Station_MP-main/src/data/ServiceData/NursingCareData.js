import nursingCareImage from '../../assets/images/services/nursingCare.png';
import generalNursingImage from '../../assets/images/services/minicards/nursing care/nc1 general nursing.jpg';
import icuTrainedImage from '../../assets/images/services/minicards/nursing care/nc2 icu trained.jpeg';
import woundCareImage from '../../assets/images/services/minicards/nursing care/nc3 wound care.jpg';
import pediatricImage from '../../assets/images/services/minicards/nursing care/nc4 pediatric.jpg';

export const nursingCareData = {
  serviceName: "Nursing Care",
  serviceDescription: "Professional medical care delivered by certified nurses in the comfort of your home.",
  serviceHighlight: "Expert healthcare when you need it most.",
  
  trustIndicators: [
    { key: 'families', value: 12000, suffix: '+', label: 'Families Served', icon: 'Trophy' },
    { key: 'nurses', value: 400, suffix: '+', label: 'Certified Nurses', icon: 'Stethoscope' },
    { key: 'rating', value: 47, suffix: '/50', label: 'Rating', icon: 'Star' }
  ],

  services: [
    {
      id: 1,
      title: "General Nursing",
      subtitle: "Professional medical care",
      description: "Comprehensive nursing care with vital monitoring and medication management",
      price: "₹1,599",
      originalPrice: "₹2,100",
      duration: "/day",
      discount: "24% OFF",
      urgency: "Most Trusted",
      features: ["Vital monitoring", "Medication administration", "Basic medical procedures", "Health assessment"],
      imgUrl: generalNursingImage,
      rating: 4.8,
      bookings: "2,847+",
      testimonial: "Professional and caring!",
      icon: "Stethoscope",
      gradient: "from-blue-500 to-indigo-500",
      availability: "Available today",
      guarantee: "Certified Nurses Only"
    },
    {
      id: 2,
      title: "ICU Trained Nursing",
      subtitle: "Critical care expertise",
      description: "Intensive care trained nurses for critical conditions and advanced monitoring",
      price: "₹2,999",
      originalPrice: "₹3,800",
      duration: "/day",
      discount: "21% OFF",
      urgency: "Critical Care",
      features: ["Critical care", "Ventilator management", "Advanced monitoring", "Emergency response"],
      imgUrl: icuTrainedImage,
      rating: 4.9,
      bookings: "1,923+",
      testimonial: "Life-saving expertise!",
      icon: "AlertCircle",
      gradient: "from-red-500 to-pink-500",
      availability: "24/7 Available",
      guarantee: "ICU Certified Staff"
    },
    {
      id: 3,
      title: "Wound Care Nursing",
      subtitle: "Specialized wound management",
      description: "Expert wound care with dressing changes and infection prevention",
      price: "₹1,999",
      originalPrice: "₹2,600",
      duration: "/visit",
      discount: "23% OFF",
      urgency: "Wound Specialist",
      features: ["Dressing changes", "Wound assessment", "Infection prevention", "Post-surgical care"],
      imgUrl: woundCareImage,
      rating: 4.7,
      bookings: "1,456+",
      testimonial: "Healed perfectly!",
      icon: "Bandage",
      gradient: "from-green-500 to-teal-500",
      availability: "Same day service",
      guarantee: "Sterile Procedures"
    },
    {
      id: 4,
      title: "Pediatric Nursing",
      subtitle: "Child healthcare specialist",
      description: "Specialized nursing care for children with health monitoring and vaccination support",
      price: "₹1,799",
      originalPrice: "₹2,300",
      duration: "/day",
      discount: "22% OFF",
      urgency: "Child Specialist",
      features: ["Child health monitoring", "Vaccination support", "Growth tracking", "Pediatric medication"],
      imgUrl: pediatricImage,
      rating: 4.9,
      bookings: "2,134+",
      testimonial: "My baby loves the nurse!",
      icon: "Baby",
      gradient: "from-purple-500 to-violet-500",
      availability: "Available in 3 hours",
      guarantee: "Child Care Certified"
    }
  ],

  detailedInfo: {
    title: "Nursing Care",
    description: "Professional nursing services delivered by certified healthcare professionals, ensuring medical excellence and compassionate care in your home environment.",
    image: nursingCareImage,
    keyFeatures: [
      "24/7 medical monitoring and care",
      "Certified and experienced nursing staff",
      "Advanced medical equipment handling",
      "Emergency response capabilities"
    ],
    servicesInclude: [
      "Vital sign monitoring and documentation",
      "Medication administration and management",
      "Wound care and dressing changes",
      "IV therapy and injections",
      "Patient education and family training",
      "Coordination with doctors and specialists"
    ]
  }
};
