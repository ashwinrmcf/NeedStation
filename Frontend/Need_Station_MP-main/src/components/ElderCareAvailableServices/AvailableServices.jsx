import React from 'react';
import ServiceCard from './ServiceCard.jsx';
import ServicesData from '../../data/Services/Services.js';

const AvailableServices = ({ currentServiceId = null }) => {
  let services = [];

  if (currentServiceId) {
    // Find the current service and display its sub-categories
    const currentService = ServicesData.find(service => service.id === currentServiceId);
    if (currentService && currentService.subCategories) {
      services = currentService.subCategories.map((subCategory, index) => ({
        title: subCategory.split(' (')[0], // Extract main title before parentheses
        price: '₹5k', // Default price for now
        imgUrl: currentService.image[0], // Use the same image for all sub-categories
        pageName: '#' // Placeholder for now
      }));
    }
  } else {
    // Default behavior: Get 6 services from ServicesData (excluding current service)
    const availableServices = ServicesData.filter(service => service.id !== currentServiceId).slice(0, 6);
    
    services = availableServices.map(service => ({
      title: service.heading,
      price: '₹5k', // Default price for now
      imgUrl: service.image[0],
      pageName: `/services/${service.heading.toLowerCase().replace(/\s+/g, '-')}`
    }));
  }

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Related Services</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {services.map((service, index) => (
          <ServiceCard key={index} title={service.title} price={service.price} imgUrl={service.imgUrl} pageName={service.pageName}/>
        ))}
      </div>
    </section>
  );
};

export default AvailableServices;



