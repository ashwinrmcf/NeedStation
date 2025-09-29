import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useBookingModal } from '../BookingModal/BookingModalProvider';

const GenericServiceOptions = ({ 
  serviceName, 
  serviceDescription, 
  serviceHighlight, 
  services, 
  trustIndicators, 
  detailedInfo 
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({});
  const { openBookingModal } = useBookingModal();

  // Animate numbers when component mounts
  useEffect(() => {
    const animateNumber = (target, key) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 30);
    };

    // Animate trust indicators
    trustIndicators.forEach(indicator => {
      animateNumber(indicator.value, indicator.key);
    });
  }, [trustIndicators]);

  const handleBookNow = (e) => {
    e.preventDefault();
    openBookingModal(serviceName);
  };

  const ServiceCard = ({ service, index }) => (
    <div 
      className={`relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border overflow-hidden group flex flex-col h-full`}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-48">
        <img
          src={service.imgUrl}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          ⭐ {service.rating}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {service.title}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {service.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {service.description}
        </p>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {service.price}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{service.duration}</span>
          </div>
          <div className="text-right">
            <span className="text-sm line-through" style={{ color: 'var(--text-tertiary)' }}>{service.originalPrice}</span>
          </div>
        </div>

        {/* Push button to bottom with margin-top auto */}
        <div className="mt-auto">
          {/* CTA Button */}
          <button 
            onClick={handleBookNow}
            className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-2xl text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Book Now
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>

        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
            <span style={{ background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{serviceName}</span> Services
          </h2>
          <p className="text-xl max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {serviceDescription}
            <br />
            <span className="font-semibold" style={{ color: 'var(--accent-secondary)' }}>{serviceHighlight}</span>
          </p>
          
          {/* Animated Trust Indicators */}
          <div className="flex justify-center items-center gap-8 mt-8 flex-wrap">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2 rounded-full px-4 py-2 shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <span className="text-2xl">{indicator.icon}</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {animatedStats[indicator.key] || 0}{indicator.suffix} {indicator.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Services Grid - 4 Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Service Description Block */}
        <div className="mt-20 rounded-3xl p-8 shadow-2xl" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-6">
              <h3 className="text-4xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
                {detailedInfo.title}
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {detailedInfo.description}
              </p>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Key Features:</h4>
                <ul className="space-y-3">
                  {detailedInfo.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-secondary)' }}></span>
                      <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Services Include:</h4>
                <ul className="space-y-3">
                  {detailedInfo.servicesInclude.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-tertiary)' }}></span>
                      <span style={{ color: 'var(--text-secondary)' }}>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={handleBookNow}
                className="px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Book Now
              </button>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={detailedInfo.image}
                  alt={detailedInfo.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-4">Still Not Sure Which Service to Choose?</h3>
            <p className="text-xl mb-8 opacity-90">
              Our care experts are here to help you find the perfect solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-teal-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                📞 Get Free Consultation
              </button>
              <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-teal-600 transition-all duration-300 transform hover:scale-105">
                💬 Chat with Expert
              </button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              ⚡ Response within 5 minutes • 🛡️ 100% Free consultation
            </p>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="rounded-2xl p-6 shadow-lg border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <div className="text-4xl mb-4">💬</div>
            <p className="italic mb-4" style={{ color: 'var(--text-secondary)' }}>"The service was amazing. Highly professional and caring!"</p>
            <div className="flex justify-center text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>- Priya S., Mumbai</p>
          </div>
          <div className="rounded-2xl p-6 shadow-lg border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <div className="text-4xl mb-4">🏥</div>
            <p className="italic mb-4" style={{ color: 'var(--text-secondary)' }}>"Professional care that gave our family peace of mind."</p>
            <div className="flex justify-center text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>- Rajesh K., Delhi</p>
          </div>
          <div className="rounded-2xl p-6 shadow-lg border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <div className="text-4xl mb-4">❤️</div>
            <p className="italic mb-4" style={{ color: 'var(--text-secondary)' }}>"Finally found reliable care. Highly recommend!"</p>
            <div className="flex justify-center text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>- Meera T., Bangalore</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenericServiceOptions;
