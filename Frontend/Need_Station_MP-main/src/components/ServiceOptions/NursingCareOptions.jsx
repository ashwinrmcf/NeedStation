import React from 'react';
import { NavLink } from 'react-router-dom';
import nursingCareImage from '../../assets/images/services/nursingCare.png';

const NursingCareOptions = () => {
  const nursingCareOptions = [
    {
      title: "IV Therapy & Medication Administration",
      description: "Injections, infusions, drug management",
      price: "₹3,500",
      imgUrl: nursingCareImage,
      pageName: "/user-details"
    },
    {
      title: "Tube Feeding",
      description: "Nasogastric/Ryles feeding setup and care",
      price: "₹2,800",
      imgUrl: nursingCareImage,
      pageName: "/user-details"
    },
    {
      title: "Wound Dressing & Ostomy Care",
      description: "Dressing changes, colostomy bag management",
      price: "₹2,500",
      imgUrl: nursingCareImage,
      pageName: "/user-details"
    },
    {
      title: "Vital Sign Monitoring",
      description: "Temperature, blood pressure, oxygen levels",
      price: "₹2,000",
      imgUrl: nursingCareImage,
      pageName: "/user-details"
    },
    {
      title: "Diet Planning & Nutrition Support",
      description: "Special diets, feeding schedules",
      price: "₹1,800",
      imgUrl: nursingCareImage,
      pageName: "/user-details"
    },
    {
      title: "Respiratory Therapies",
      description: "Nebulization, suctioning, oxygen support",
      price: "₹3,200",
      imgUrl: nursingCareImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {nursingCareOptions.map((option, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg text-center">
            <NavLink to={option.pageName}>
              <img
                src={option.imgUrl}
                alt={option.title}
                className="h-80 w-full object-cover"
              />
            </NavLink>
            <div className="p-6">
              <h3 className="text-xl font-medium text-white mb-2">{option.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{option.description}</p>
              <p className="text-gray-400">{`Project starting at ${option.price}`}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NursingCareOptions;
