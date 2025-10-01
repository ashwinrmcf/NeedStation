import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { elderCareData } from '../../data/ServiceData/ElderCareData';

const ElderlyCareOptions = () => {
  // Create mock data for missing properties
  const mockTrustIndicators = [
    {
      icon: "👨‍👩‍👧‍👦",
      key: "families",
      value: 15000,
      suffix: "+",
      label: "Families"
    },
    {
      icon: "👩‍⚕️",
      key: "caregivers",
      value: 500,
      suffix: "+",
      label: "Caregivers"
    },
    {
      icon: "⭐",
      key: "rating",
      value: 4.8,
      suffix: "/5",
      label: "Rating"
    },
    {
      icon: "📝",
      key: "reviews",
      value: 2500,
      suffix: "+",
      label: "Reviews"
    }
  ];

  const mockDetailedInfo = {
    description: "Our elderly care services provide comprehensive support for seniors, ensuring their comfort, safety, and well-being in the familiar environment of their own homes.",
    keyFeatures: [
      "24/7 availability",
      "Trained and certified caregivers",
      "Personalized care plans",
      "Regular health monitoring",
      "Family communication and updates"
    ],
    servicesInclude: [
      "Companion care and social interaction",
      "Personal care assistance (bathing, dressing)",
      "Medication management and reminders",
      "Light housekeeping and meal preparation",
      "Transportation to appointments",
      "Emergency response and safety monitoring"
    ]
  };

  return (
    <GenericServiceOptions 
      serviceName={elderCareData.serviceName}
      serviceDescription={elderCareData.serviceDescription}
      serviceHighlight={elderCareData.serviceHighlight}
      services={elderCareData.serviceOptions} // Use serviceOptions instead of services
      trustIndicators={mockTrustIndicators}
      detailedInfo={mockDetailedInfo}
    />
  );
};

export default ElderlyCareOptions;
