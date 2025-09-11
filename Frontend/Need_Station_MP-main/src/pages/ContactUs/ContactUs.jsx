import { useState } from 'react';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, Send } from 'lucide-react';
import axios from 'axios';

export default function ContactUs() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/contact', formData);
      
      if (response.data.success) {
        setSubmitMessage('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      if (error.response?.data?.error) {
        setSubmitMessage(error.response.data.error);
      } else {
        setSubmitMessage('Failed to send message. Please make sure the backend server is running.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I track my service request?",
      answer: "You can track your service request by logging into your account and visiting the 'My Requests' section. There you'll find real-time updates on all your submitted service requests."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and in some regions, mobile payment solutions. All payments are processed securely through our encrypted payment gateway."
    },
    {
      question: "How quickly will I receive a response?",
      answer: "Our team typically responds to inquiries within 24 hours during business days. For urgent matters, we recommend using our priority contact option by marking your request as 'Urgent'."
    },
    {
      question: "Can I change or cancel my service request?",
      answer: "Yes, you can modify or cancel your service request up to 48 hours before the scheduled service time through your account dashboard without any penalty."
    },
    {
      question: "Do you serve international clients?",
      answer: "Absolutely! Needstation provides services globally with specialized support for different regions. Our international team ensures seamless communication across time zones."
    }
  ];

  return (
    <div className=" text-white min-h-screen">
      {/* Main container */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Page title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <div className="w-24 h-1 bg-teal-400 mx-auto"></div>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help you with anything you need.
          </p>
        </div>

        {/* Contact section with grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          
          {/* Contact cards */}
          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg hover:shadow-teal-500/20 transition duration-300">
            <div className="bg-teal-400 p-4 rounded-full mb-4">
              <Phone className="text-gray-900" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-gray-300">Our support team is available 24/7</p>
            <a href="tel:+11234567890" className="text-teal-400 mt-4 font-medium hover:underline">+91 8357028350</a>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg hover:shadow-teal-500/20 transition duration-300">
            <div className="bg-teal-400 p-4 rounded-full mb-4">
              <Mail className="text-gray-900" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-gray-300">Get in touch via email</p>
            <a href="mailto:support@needstation.com" className="text-teal-400 mt-4 font-medium hover:underline">support@needstation.in</a>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg hover:shadow-teal-500/20 transition duration-300">
            <div className="bg-teal-400 p-4 rounded-full mb-4">
              <MapPin className="text-gray-900" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-gray-300">Our headquarters location</p>
            <p className="text-teal-400 mt-4 font-medium">
              123 Tech Boulevard<br />
              San Francisco, CA 94107
            </p>
          </div>
        </div>

        {/* Contact form and FAQ section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="mr-2">Send Us a Message</span>
              <div className="h-px bg-teal-400 flex-grow ml-4"></div>
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name"  className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder='example@gmail.com'
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder='Subject'
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder='Type your message here...'
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white resize-none"
                ></textarea>
              </div>
              
              {submitMessage && (
                <div className={`p-3 rounded-lg text-center ${
                  submitMessage.includes('successfully') 
                    ? 'bg-green-800 text-green-200' 
                    : 'bg-red-800 text-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center w-full md:w-auto ${
                  isSubmitting 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-teal-400 hover:bg-teal-500 text-gray-900'
                }`}
              >
                <Send size={18} className="mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
          
          {/* FAQ section with dropdowns */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="mr-2">Frequently Asked Questions</span>
              <div className="h-px bg-teal-400 flex-grow ml-4"></div>
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800 transition duration-200"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {activeFaq === index ? (
                      <ChevronUp size={20} className="text-teal-400" />
                    ) : (
                      <ChevronDown size={20} className="text-teal-400" />
                    )}
                  </button>
                  
                  <div 
                    className={`bg-gray-800 px-4 transition-all duration-300 overflow-hidden ${
                      activeFaq === index 
                        ? 'max-h-48 py-4 opacity-100' 
                        : 'max-h-0 py-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Social media section */}
        <div className="mt-20 text-center">
          <h3 className="text-xl font-semibold mb-6">Connect With Us</h3>
          <div className="flex justify-center space-x-6">
            <a href="https://x.com/needstation" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-teal-400 hover:text-gray-900 transition duration-300" title="Follow us on X (Twitter)">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://www.instagram.com/needstation.in" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-teal-400 hover:text-gray-900 transition duration-300" title="Follow us on Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/needstation" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-teal-400 hover:text-gray-900 transition duration-300" title="Connect with us on LinkedIn">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="mt-20 bg-gray-800 rounded-lg p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-300">Stay updated with our latest services and offers</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
            />
            <button className="bg-teal-400 hover:bg-teal-500 text-gray-900 font-medium py-3 px-6 rounded-lg transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}