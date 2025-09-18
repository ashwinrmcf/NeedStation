import React from 'react';
import { NavLink } from 'react-router-dom';
import diabetesImage from '../../assets/images/services/diabetesManagement.png';

const DiabetesOptions = () => {
  const diabetesOptions = [
    {
      title: "Blood Glucose Monitoring",
      description: "Glucometer kits and test strips",
      price: "₹1,200",
      imgUrl: diabetesImage,
      pageName: "/user-details"
    },
    {
      title: "Personalized Diet & Nutrition Counseling",
      description: "Meal planning, glycemic diets",
      price: "₹1,800",
      imgUrl: diabetesImage,
      pageName: "/user-details"
    },
    {
      title: "Exercise & Lifestyle Coaching",
      description: "Health coach for weight management",
      price: "₹2,000",
      imgUrl: diabetesImage,
      pageName: "/user-details"
    },
    {
      title: "Medication/Insulin Management",
      description: "Injection training, adherence support",
      price: "₹2,500",
      imgUrl: diabetesImage,
      pageName: "/user-details"
    },
    {
      title: "Diabetic Foot Care",
      description: "Wound care, circulation monitoring",
      price: "₹1,500",
      imgUrl: diabetesImage,
      pageName: "/user-details"
    },
    {
      title: "Regular Complication Screening",
      description: "Retinopathy, nephropathy checks",
      price: "₹2,200",
      imgUrl: diabetesImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {diabetesOptions.map((option, index) => (
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

export default DiabetesOptions;
