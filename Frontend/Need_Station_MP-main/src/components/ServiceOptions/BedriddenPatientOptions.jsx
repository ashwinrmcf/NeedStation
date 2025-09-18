import React from 'react';
import { NavLink } from 'react-router-dom';
import bedriddenImage from '../../assets/images/services/bedriddenPatient.png';

const BedriddenPatientOptions = () => {
  const bedriddenOptions = [
    {
      title: "Post-operative Recovery & Wound Care",
      description: "Dressing changes, drain care",
      price: "₹3,200",
      imgUrl: bedriddenImage,
      pageName: "/user-details"
    },
    {
      title: "Chronic Disease Management",
      description: "Diabetes monitoring, respiratory support",
      price: "₹2,800",
      imgUrl: bedriddenImage,
      pageName: "/user-details"
    },
    {
      title: "Palliative & End-of-life Support",
      description: "Comfort measures, pain relief",
      price: "₹4,000",
      imgUrl: bedriddenImage,
      pageName: "/user-details"
    },
    {
      title: "Medication & IV Therapy",
      description: "Injections, infusions, medication reminders",
      price: "₹2,500",
      imgUrl: bedriddenImage,
      pageName: "/user-details"
    },
    {
      title: "Personal Hygiene & Feeding Assistance",
      description: "Bathing, feeding, diapering",
      price: "₹2,000",
      imgUrl: bedriddenImage,
      pageName: "/user-details"
    },
    {
      title: "Pressure Sore Prevention & Mobility",
      description: "Regular repositioning, bed exercises",
      price: "₹2,200",
      imgUrl: bedriddenImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {bedriddenOptions.map((option, index) => (
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

export default BedriddenPatientOptions;
