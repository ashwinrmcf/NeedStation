
import React from 'react';
import { CheckCircle, MessageCircle, Calendar } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <MessageCircle size={28} className="text-cyan-400" />,
      number: 1,
      title: "Describe Your Task",
      description: "Tell us what you need done, when and where it works for you."
    },
    {
      icon: <CheckCircle size={28} className="text-cyan-300" />,
      number: 2,
      title: "Choose Your Helper",
      description: "Browse trusted Helper by skills, reviews, and price. Chat with them to confirm details."
    },
    {
      icon: <Calendar size={28} className="text-cyan-300" />,
      number: 3,
      title: "Get It Done!",
      description: "Your Helper arrives and gets the job done. Pay securely and leave a review, all through NeedStation."
    }
  ];

  return (
    <div className=" text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-4xl font-bold text-center mb-16 text-white">
          How it <span className='text-cyan-300'>works</span> 
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-gray-800 rounded-full p-6 mb-6 relative">
                {step.icon}
                <div className="absolute -top-2 -left-2 bg-cyan-400 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          {/* <button className="bg-cyan-300 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-8 rounded-md transition-colors">
            Get Started
          </button> */}
        </div>
      </div>
    </div>
  );
}