import elderlyCareImage from '../../assets/images/services/elderlyCare.png';
import companionImage from '../../assets/images/services/minicards/elder care/ec1 companion.jpg';
import personalImage from '../../assets/images/services/minicards/elder care/ec2 personal.jpg';
import dementiaImage from '../../assets/images/services/minicards/elder care/ec3 dementia.jpg';
import respiteImage from '../../assets/images/services/minicards/elder care/ec4 respite.jpg';

export const elderCareData = {
  serviceName: "Elder Care",
  serviceDescription: "💝 Compassionate, professional care that brings peace of mind to your family.",
  serviceHighlight: "Choose the perfect care solution for your loved one today.",
  
  trustIndicators: [
    { key: 'families', value: 15000, suffix: '+', label: 'Families Trust Us', icon: '🏆' },
    { key: 'caregivers', value: 500, suffix: '+', label: 'Expert Caregivers', icon: '👩‍⚕️' },
    { key: 'rating', value: 48, suffix: '/50', label: 'Rating', icon: '⭐' }
  ],

  services: [
    {
      id: 1,
      title: "Companion Care",
      subtitle: "Never feel alone again",
      description: "Warm companionship that brings joy to everyday moments",
      price: "₹899",
      originalPrice: "₹1,200",
      duration: "/day",
      discount: "25% OFF",
      urgency: "🔥 Most Popular",
      features: ["Daily conversation", "Social activities", "Emotional support", "Meal companionship"],
      imgUrl: companionImage,
      rating: 4.9,
      bookings: "3,247+",
      testimonial: "My mother smiles more now!",
      icon: "💝",
      gradient: "from-pink-500 to-rose-500",
      availability: "Available in 2 hours",
      guarantee: "100% Satisfaction Guaranteed"
    },
    {
      id: 2,
      title: "Personal Care",
      subtitle: "Dignity in daily living",
      description: "Professional assistance with bathing, dressing, and personal hygiene",
      price: "₹1,299",
      originalPrice: "₹1,800",
      duration: "/day",
      discount: "28% OFF",
      urgency: "⚡ High Demand",
      features: ["Bathing assistance", "Dressing help", "Grooming support", "Mobility aid"],
      imgUrl: personalImage,
      rating: 4.8,
      bookings: "2,891+",
      testimonial: "Professional and caring!",
      icon: "🛁",
      gradient: "from-blue-500 to-cyan-500",
      availability: "Available today",
      guarantee: "Trained Professionals"
    },
    {
      id: 3,
      title: "Specialized Care",
      subtitle: "Expert medical attention",
      description: "Specialized care for dementia, Alzheimer's, and complex conditions",
      price: "₹2,999",
      originalPrice: "₹4,200",
      duration: "/day",
      discount: "30% OFF",
      urgency: "🧠 Specialist Care",
      features: ["Memory exercises", "Behavioral management", "Safety supervision", "Family support"],
      imgUrl: dementiaImage,
      rating: 4.9,
      bookings: "1,634+",
      testimonial: "They understand my father!",
      icon: "🧠",
      gradient: "from-purple-500 to-indigo-500",
      availability: "Specialist available",
      guarantee: "Certified Dementia Specialists"
    },
    {
      id: 4,
      title: "Respite Care",
      subtitle: "You deserve a break too",
      description: "Temporary relief care so family caregivers can rest and recharge",
      price: "₹1,799",
      originalPrice: "₹2,400",
      duration: "/day",
      discount: "25% OFF",
      urgency: "⏰ Relief Care",
      features: ["4-12 hour shifts", "Flexible timing", "Peace of mind", "Family support"],
      imgUrl: respiteImage,
      rating: 4.8,
      bookings: "2,634+",
      testimonial: "Finally got some rest!",
      icon: "⏰",
      gradient: "from-green-500 to-emerald-500",
      availability: "24/7 Available",
      guarantee: "Immediate Response Promise"
    }
  ],

  detailedInfo: {
    title: "Elderly Care",
    description: "Compassionate and professional care services tailored to meet the unique needs of seniors, promoting independence and well-being.",
    image: elderlyCareImage,
    keyFeatures: [
      "Personalized senior care plans",
      "Companionship and social engagement",
      "Safety monitoring and fall prevention",
      "Medication management and health monitoring"
    ],
    servicesInclude: [
      "Personal care and daily living assistance",
      "Companionship and social interaction",
      "Medication reminders and health monitoring",
      "Light housekeeping and meal preparation",
      "Transportation and errand assistance",
      "Safety monitoring and emergency response"
    ]
  }
};
