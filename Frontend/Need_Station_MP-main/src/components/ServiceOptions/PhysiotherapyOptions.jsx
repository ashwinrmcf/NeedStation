import React from 'react';
import { NavLink } from 'react-router-dom';
import physiotherapyImage from '../../assets/images/services/physiotherapy.png';

const PhysiotherapyOptions = () => {
  const physiotherapyOptions = [
    {
      title: "Orthopaedic Rehabilitation",
      description: "Joint pain, arthritis, post-surgical rehab",
      price: "₹2,500",
      imgUrl: physiotherapyImage,
      pageName: "/user-details"
    },
    {
      title: "Neurological Rehabilitation",
      description: "Stroke, paralysis, cerebral palsy",
      price: "₹3,200",
      imgUrl: physiotherapyImage,
      pageName: "/user-details"
    },
    {
      title: "Sports Injury Therapy",
      description: "Muscle strains, ligament injuries",
      price: "₹2,800",
      imgUrl: physiotherapyImage,
      pageName: "/user-details"
    },
    {
      title: "Chest/Respiratory Physiotherapy",
      description: "Post-COVID rehab, COPD care",
      price: "₹2,200",
      imgUrl: physiotherapyImage,
      pageName: "/user-details"
    },
    {
      title: "Spinal/Disc Therapy",
      description: "Back pain, slipped disc rehab",
      price: "₹2,600",
      imgUrl: physiotherapyImage,
      pageName: "/user-details"
    },
    {
      title: "Geriatric Physiotherapy",
      description: "Balance, fall-prevention exercises",
      price: "₹2,000",
      imgUrl: physiotherapyImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {physiotherapyOptions.map((option, index) => (
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

export default PhysiotherapyOptions;
