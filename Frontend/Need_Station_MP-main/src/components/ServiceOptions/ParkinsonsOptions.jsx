import React from 'react';
import { NavLink } from 'react-router-dom';
import parkinsonsImage from '../../assets/images/services/parkinsonsCare.png';

const ParkinsonsOptions = () => {
  const parkinsonsOptions = [
    {
      title: "Mobility Support & Physiotherapy",
      description: "Exercise programs to improve gait and balance",
      price: "₹2,800",
      imgUrl: parkinsonsImage,
      pageName: "/user-details"
    },
    {
      title: "Medication & Symptom Management",
      description: "Med schedule adherence, side-effect monitoring",
      price: "₹2,200",
      imgUrl: parkinsonsImage,
      pageName: "/user-details"
    },
    {
      title: "Speech & Swallowing Therapy",
      description: "To maintain communication and safe eating",
      price: "₹3,500",
      imgUrl: parkinsonsImage,
      pageName: "/user-details"
    },
    {
      title: "Daily Living Assistance",
      description: "Help with dressing, transfers, using adaptive devices",
      price: "₹2,000",
      imgUrl: parkinsonsImage,
      pageName: "/user-details"
    },
    {
      title: "Nutritional & Diet Support",
      description: "Managing diet for digestive/mobility issues",
      price: "₹1,800",
      imgUrl: parkinsonsImage,
      pageName: "/user-details"
    },
    {
      title: "Psychosocial Support",
      description: "Counseling for depression/anxiety and family education",
      price: "₹2,500",
      imgUrl: parkinsonsImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {parkinsonsOptions.map((option, index) => (
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

export default ParkinsonsOptions;
