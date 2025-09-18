import React from 'react';
import { NavLink } from 'react-router-dom';
import healthCheckupImage from '../../assets/images/services/healthCheckUp.png';

const HealthCheckupOptions = () => {
  const healthCheckupOptions = [
    {
      title: "Basic/Full-body Checkup Packages",
      description: "CBC, sugar, lipid, liver, kidney profiles",
      price: "₹1,500",
      imgUrl: healthCheckupImage,
      pageName: "/user-details"
    },
    {
      title: "Executive/Comprehensive Checkups",
      description: "Adds cardiac markers, vitamins, hormones",
      price: "₹3,500",
      imgUrl: healthCheckupImage,
      pageName: "/user-details"
    },
    {
      title: "Women's Health Packages",
      description: "PCOD, prenatal tests, thyroid panels",
      price: "₹2,800",
      imgUrl: healthCheckupImage,
      pageName: "/user-details"
    },
    {
      title: "Corporate/Occupational Health Screenings",
      description: "Health camps and mass check-ups",
      price: "₹1,200",
      imgUrl: healthCheckupImage,
      pageName: "/user-details"
    },
    {
      title: "Disease-specific Panels",
      description: "Heart risk profile, cancer screening",
      price: "₹2,500",
      imgUrl: healthCheckupImage,
      pageName: "/user-details"
    },
    {
      title: "Wellness Profiles",
      description: "Immunity panel, sexual health, vitamin profile",
      price: "₹2,000",
      imgUrl: healthCheckupImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {healthCheckupOptions.map((option, index) => (
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

export default HealthCheckupOptions;
