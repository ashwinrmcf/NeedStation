import React from 'react';
import { NavLink } from 'react-router-dom';
import paralysisImage from '../../assets/images/services/paralysisCare.png';

const ParalysisOptions = () => {
  const paralysisOptions = [
    {
      title: "Daily Living Assistance",
      description: "Bathing, grooming, feeding",
      price: "₹2,000",
      imgUrl: paralysisImage,
      pageName: "/user-details"
    },
    {
      title: "Physical Therapy & Mobility Training",
      description: "To regain strength and prevent contractures",
      price: "₹3,000",
      imgUrl: paralysisImage,
      pageName: "/user-details"
    },
    {
      title: "Medication Management & Nursing Care",
      description: "Medication reminders, catheter care",
      price: "₹2,500",
      imgUrl: paralysisImage,
      pageName: "/user-details"
    },
    {
      title: "Pressure Sore Prevention & Skin Care",
      description: "Skin checks, turning schedule",
      price: "₹2,200",
      imgUrl: paralysisImage,
      pageName: "/user-details"
    },
    {
      title: "Nutritional Support",
      description: "Feeding assistance and dietary guidance",
      price: "₹1,800",
      imgUrl: paralysisImage,
      pageName: "/user-details"
    },
    {
      title: "Emotional & Rehabilitative Support",
      description: "Counseling, family education",
      price: "₹2,300",
      imgUrl: paralysisImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {paralysisOptions.map((option, index) => (
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

export default ParalysisOptions;
