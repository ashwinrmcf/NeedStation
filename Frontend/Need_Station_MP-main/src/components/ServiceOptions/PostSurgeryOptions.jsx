import React from 'react';
import { NavLink } from 'react-router-dom';
import postSurgeryImage from '../../assets/images/services/medicalCare.png';

const PostSurgeryOptions = () => {
  const postSurgeryOptions = [
    {
      title: "Surgical Wound Care & Dressing Changes",
      description: "Professional wound care and healing monitoring",
      price: "₹2,800",
      imgUrl: postSurgeryImage,
      pageName: "/user-details"
    },
    {
      title: "Medication & IV Fluid Management",
      description: "Post-operative medication administration",
      price: "₹2,500",
      imgUrl: postSurgeryImage,
      pageName: "/user-details"
    },
    {
      title: "Pain Management",
      description: "Analgesia scheduling, alternative therapy",
      price: "₹2,200",
      imgUrl: postSurgeryImage,
      pageName: "/user-details"
    },
    {
      title: "Nutritional Support & Enteral Feeding",
      description: "Tube feeding if needed",
      price: "₹2,000",
      imgUrl: postSurgeryImage,
      pageName: "/user-details"
    },
    {
      title: "Catheter & Drain Care",
      description: "Urinary catheter changes, drain tube monitoring",
      price: "₹1,800",
      imgUrl: postSurgeryImage,
      pageName: "/user-details"
    },
    {
      title: "Mobility Exercises & Physiotherapy",
      description: "Early ambulation, breathing exercises",
      price: "₹2,600",
      imgUrl: postSurgeryImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {postSurgeryOptions.map((option, index) => (
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

export default PostSurgeryOptions;
