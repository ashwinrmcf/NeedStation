import React from 'react';
import { NavLink } from 'react-router-dom';
import caretakerImage from '../../assets/images/services/homeHealthCare.png';

const CaretakerOptions = () => {
  const caretakerOptions = [
    {
      title: "Assistance with Daily Living",
      description: "Bathing, dressing, toileting",
      price: "₹1,800",
      imgUrl: caretakerImage,
      pageName: "/user-details"
    },
    {
      title: "Companion Care & Emotional Support",
      description: "Conversation, activities",
      price: "₹1,500",
      imgUrl: caretakerImage,
      pageName: "/user-details"
    },
    {
      title: "Dementia/Alzheimer's Care",
      description: "Memory aid, safe environment",
      price: "₹3,000",
      imgUrl: caretakerImage,
      pageName: "/user-details"
    },
    {
      title: "Post-operative/Short-term Care",
      description: "Support during recovery at home",
      price: "₹2,500",
      imgUrl: caretakerImage,
      pageName: "/user-details"
    },
    {
      title: "Physiotherapy/Mobility Assistance",
      description: "Help with prescribed exercises",
      price: "₹2,200",
      imgUrl: caretakerImage,
      pageName: "/user-details"
    },
    {
      title: "Live-in or 24×7 Caregiving",
      description: "Overnight supervision, extended support",
      price: "₹4,500",
      imgUrl: caretakerImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {caretakerOptions.map((option, index) => (
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

export default CaretakerOptions;
