import React from 'react';
import { NavLink } from 'react-router-dom';
import securityGuardImage from '../../assets/images/services/securityGuard.png';
import image1 from '../../assets/images/services/security/UnarmedResidentialGuard.png';


const SecurityGuardOptions = () => {
  const securityGuardOptions = [
    {
      title: "Unarmed Residential Guard",
      description: "Manned guarding for houses/gated communities",
      price: "₹3,500",
      imgUrl: image1,
      pageName: "/user-details"
    },
    {
      title: "Armed Security Guard",
      description: "For high-risk homes or valuables",
      price: "₹5,000",
      imgUrl: securityGuardImage,
      pageName: "/user-details"
    },
    {
      title: "Bodyguard/Personal Protection",
      description: "Close protection for individuals/VIPs",
      price: "₹8,000",
      imgUrl: securityGuardImage,
      pageName: "/user-details"
    },
    {
      title: "CCTV Surveillance Operator",
      description: "Video monitoring and alarm response",
      price: "₹2,500",
      imgUrl: securityGuardImage,
      pageName: "/user-details"
    },
    {
      title: "Mobile Patrol Unit",
      description: "Vehicle-based patrols day/night",
      price: "₹4,200",
      imgUrl: securityGuardImage,
      pageName: "/user-details"
    },
    {
      title: "Event & Crowd Security",
      description: "Private event or community security",
      price: "₹6,500",
      imgUrl: securityGuardImage,
      pageName: "/user-details"
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-6xl font-semibold text-white mb-4">Service Options</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 px-4">
        {securityGuardOptions.map((option, index) => (
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

export default SecurityGuardOptions;