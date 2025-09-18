import React from 'react';
import { NavLink } from 'react-router-dom';
import elderlyCareImage from '../../assets/images/services/elderlyCare.png';

const ElderlyCareOptions = () => {
  const elderlyCareOptions = [
    {
      title: "Skilled Geriatric Nursing",
      description: "Medication management, wound care",
      price: "₹3,000",
      imgUrl: elderlyCareImage,
      pageName: "/user-details"
    },
    {
      title: "Companion & Social Support",
      description: "Conversation, activities to reduce isolation",
      price: "₹1,500",
      imgUrl: elderlyCareImage,
      pageName: "/user-details"
    },
    {
      title: "Dementia/Alzheimer's Care",
      description: "Memory exercises, safe routines",
      price: "₹3,500",
      imgUrl: elderlyCareImage,
      pageName: "/user-details"
    },
    {
      title: "Physiotherapy & Mobility Exercises",
      description: "Fall prevention, strengthening",
      price: "₹2,500",
      imgUrl: elderlyCareImage,
      pageName: "/user-details"
    },
    {
      title: "Post-hospital Recovery",
      description: "Medication reminders, mobility support after discharge",
      price: "₹2,800",
      imgUrl: elderlyCareImage,
      pageName: "/user-details"
    },
    {
      title: "Palliative/Chronic Disease Care",
      description: "Pain management, comfort in long-term illness",
      price: "₹3,200",
      imgUrl: elderlyCareImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {elderlyCareOptions.map((option, index) => (
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

export default ElderlyCareOptions;
