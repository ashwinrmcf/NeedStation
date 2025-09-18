import React from 'react';
import { NavLink } from 'react-router-dom';
import motherBabyImage from '../../assets/images/services/motherAndBaby.png';

const MotherBabyOptions = () => {
  const motherBabyOptions = [
    {
      title: "Postnatal Mother Care",
      description: "Rest support, post-delivery massage, perineal care",
      price: "₹2,500",
      imgUrl: motherBabyImage,
      pageName: "/user-details"
    },
    {
      title: "Newborn Baby Care",
      description: "Bathing, feeding, sleep routines, nappy changes",
      price: "₹2,200",
      imgUrl: motherBabyImage,
      pageName: "/user-details"
    },
    {
      title: "Lactation & Breastfeeding Support",
      description: "Nurse assistance with feeding technique",
      price: "₹1,800",
      imgUrl: motherBabyImage,
      pageName: "/user-details"
    },
    {
      title: "Pediatric Check-ups & Immunization",
      description: "Scheduling vaccinations, doctor calls",
      price: "₹1,500",
      imgUrl: motherBabyImage,
      pageName: "/user-details"
    },
    {
      title: "Emotional Support & Counseling",
      description: "Postpartum counseling, support groups",
      price: "₹2,000",
      imgUrl: motherBabyImage,
      pageName: "/user-details"
    },
    {
      title: "Baby Grooming & Massage",
      description: "Mild massage exercises, cord care, nursery setup",
      price: "₹1,200",
      imgUrl: motherBabyImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {motherBabyOptions.map((option, index) => (
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

export default MotherBabyOptions;
