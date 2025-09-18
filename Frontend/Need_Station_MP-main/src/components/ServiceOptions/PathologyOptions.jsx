import React from 'react';
import { NavLink } from 'react-router-dom';
import pathologyImage from '../../assets/images/services/pathologyCare.png';

const PathologyOptions = () => {
  const pathologyOptions = [
    {
      title: "Routine Blood Tests",
      description: "CBC, glucose, lipids, kidney/liver panels",
      price: "₹800",
      imgUrl: pathologyImage,
      pageName: "/user-details"
    },
    {
      title: "Urine & Stool Analysis",
      description: "Kidney function, infections, GI disorders",
      price: "₹600",
      imgUrl: pathologyImage,
      pageName: "/user-details"
    },
    {
      title: "Imaging Diagnostics",
      description: "X-ray, ECG, ultrasound scans",
      price: "₹1,500",
      imgUrl: pathologyImage,
      pageName: "/user-details"
    },
    {
      title: "Specialized Test Panels",
      description: "Hormones, cardiac markers, cancer markers",
      price: "₹2,200",
      imgUrl: pathologyImage,
      pageName: "/user-details"
    },
    {
      title: "Genetic & Biopsy Services",
      description: "Chromosomal tests, pathology reports",
      price: "₹3,500",
      imgUrl: pathologyImage,
      pageName: "/user-details"
    },
    {
      title: "Preventive Health Checkup Packages",
      description: "Bundled lab tests for screening",
      price: "₹1,200",
      imgUrl: pathologyImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {pathologyOptions.map((option, index) => (
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

export default PathologyOptions;
