import elderlyCareImage from '../../assets/images/services/realservices/eldercare.jpg';
import elderEmojiImage from '../../assets/images/services/emojis/elder.png';
import elderEmoji from '../../assets/images/services/emojis/elder.png';
import companionImage from '../../assets/images/services/minicards/elder care/ec1 companion.jpg';
import personalCareImage from '../../assets/images/services/minicards/elder care/ec2 personal.jpg';
import dementiaImage from '../../assets/images/services/minicards/elder care/ec3 dementia.jpg';
import respiteImage from '../../assets/images/services/minicards/elder care/ec4 respite.jpg';
import caregiverImage from '../../assets/images/services/realservices/caregiver.jpg';
import nurseImage from '../../assets/images/services/realservices/nurse].jpg';

export const elderCareData = {
  serviceName: "Elderly Care",
  serviceDescription: "👨‍⚕️ Compassionate and professional care tailored to meet the needs of seniors.",
  serviceHighlight: "Complete elderly care with dignity and respect.",
  
  trustIndicators: [
    { key: 'families', value: 10000, suffix: '+', label: 'Families Served', icon: '🏆' },
    { key: 'caregivers', value: 200, suffix: '+', label: 'Caregivers', icon: '👨‍⚕️' },
    { key: 'rating', value: 48, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Companion Care",
      subtitle: "Daily companionship and social interaction",
      description: "Friendly companionship and social interaction for elderly individuals who need emotional support and daily engagement",
      price: "₹800",
      originalPrice: "₹1,000",
      duration: "/day",
      discount: "20% OFF",
      urgency: "👥 Most Popular",
      features: ["Social interaction", "Light activities", "Meal assistance", "Medication reminders"],
      imgUrl: companionImage,
      rating: 4.8,
      bookings: "5,234+",
      testimonial: "Wonderful companionship!",
      icon: "👥",
      gradient: "from-blue-500 to-cyan-500",
      availability: "Available today",
      guarantee: "Trained Companions"
    },
    {
      id: 2,
      title: "Personal Care",
      subtitle: "Assistance with daily personal activities",
      description: "Professional assistance with bathing, dressing, grooming and other personal care needs for elderly individuals",
      price: "₹1,200",
      originalPrice: "₹1,500",
      duration: "/day",
      discount: "20% OFF",
      urgency: "🛁 Premium Care",
      features: ["Bathing assistance", "Dressing help", "Grooming", "Mobility support"],
      imgUrl: personalCareImage,
      rating: 4.9,
      bookings: "4,567+",
      testimonial: "Very caring staff!",
      icon: "🛁",
      gradient: "from-green-500 to-teal-500",
      availability: "Available today",
      guarantee: "Certified Caregivers"
    },
    {
      id: 3,
      title: "Dementia Care",
      subtitle: "Specialized care for dementia patients",
      description: "Expert care for elderly individuals with dementia, Alzheimer's and memory-related conditions with compassionate support",
      price: "₹1,800",
      originalPrice: "₹2,200",
      duration: "/day",
      discount: "18% OFF",
      urgency: "🧠 Specialized",
      features: ["Memory care", "Safety monitoring", "Cognitive activities", "24/7 supervision"],
      imgUrl: dementiaImage,
      rating: 4.9,
      bookings: "2,345+",
      testimonial: "Excellent dementia care!",
      icon: "🧠",
      gradient: "from-purple-500 to-pink-500",
      availability: "Schedule required",
      guarantee: "Dementia Specialists"
    },
    {
      id: 4,
      title: "Respite Care",
      subtitle: "Short-term relief for family caregivers",
      description: "Temporary care services that provide family caregivers with much-needed breaks while ensuring quality care for loved ones",
      price: "₹1,000",
      originalPrice: "₹1,300",
      duration: "/day",
      discount: "23% OFF",
      urgency: "⏰ Flexible",
      features: ["Temporary relief", "Flexible scheduling", "Trained caregivers", "Peace of mind"],
      imgUrl: respiteImage,
      rating: 4.7,
      bookings: "3,890+",
      testimonial: "Great relief service!",
      icon: "⏰",
      gradient: "from-orange-500 to-red-500",
      availability: "Same day available",
      guarantee: "Flexible Hours"
    }
  ],

  detailedInfo: {
    title: "Elderly Care Service",
    description: "Comprehensive elderly care services providing compassionate support, personal assistance, and specialized care for seniors with trained caregivers and medical professionals.",
    image: elderlyCareImage,
    keyFeatures: [
      "Compassionate companionship and social engagement",
      "Personal care and daily living assistance",
      "Specialized dementia and memory care",
      "Flexible respite care for family caregivers"
    ],
    servicesInclude: [
      "Daily companionship and social interaction",
      "Personal hygiene and grooming assistance",
      "Medication reminders and health monitoring",
      "Meal preparation and feeding support",
      "Mobility assistance and fall prevention",
      "Dementia and Alzheimer's care"
    ]
  }
};
