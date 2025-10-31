import { useState } from 'react';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, Send } from 'lucide-react';
import axios from 'axios';
import '../../ContactUs/ContactUs.css';

export default function HindiContactUs() {
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
      setSubmitMessage('कृपया सभी फ़ील्ड भरें');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/contact', formData);
      
      if (response.data.success) {
        setSubmitMessage('संदेश सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitMessage('संदेश भेजने में विफल। कृपया पुनः प्रयास करें।');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      if (error.response?.data?.error) {
        setSubmitMessage(error.response.data.error);
      } else {
        setSubmitMessage('संदेश भेजने में विफल। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है।');
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
      question: "मैं अपने सेवा अनुरोध को कैसे ट्रैक कर सकता हूं?",
      answer: "आप अपने खाते में लॉगिन करके और 'मेरे अनुरोध' अनुभाग पर जाकर अपने सेवा अनुरोध को ट्रैक कर सकते हैं। वहां आपको अपने सभी सबमिट किए गए सेवा अनुरोधों पर रीयल-टाइम अपडेट मिलेंगे।"
    },
    {
      question: "आप कौन से भुगतान विधियां स्वीकार करते हैं?",
      answer: "हम सभी प्रमुख क्रेडिट कार्ड, PayPal, बैंक ट्रांसफर और कुछ क्षेत्रों में मोबाइल भुगतान समाधान स्वीकार करते हैं। सभी भुगतान हमारे एन्क्रिप्टेड भुगतान गेटवे के माध्यम से सुरक्षित रूप से संसाधित किए जाते हैं।"
    },
    {
      question: "मुझे कितनी जल्दी प्रतिक्रिया मिलेगी?",
      answer: "हमारी टीम आमतौर पर व्यावसायिक दिनों के दौरान 24 घंटों के भीतर पूछताछ का जवाब देती है। तत्काल मामलों के लिए, हम अपने अनुरोध को 'तत्काल' के रूप में चिह्नित करके हमारे प्राथमिकता संपर्क विकल्प का उपयोग करने की सलाह देते हैं।"
    },
    {
      question: "क्या मैं अपने सेवा अनुरोध को बदल या रद्द कर सकता हूं?",
      answer: "हां, आप अपने खाता डैशबोर्ड के माध्यम से निर्धारित सेवा समय से 48 घंटे पहले तक बिना किसी जुर्माने के अपने सेवा अनुरोध को संशोधित या रद्द कर सकते हैं।"
    },
    {
      question: "क्या आप अंतर्राष्ट्रीय ग्राहकों की सेवा करते हैं?",
      answer: "बिल्कुल! NeedStation विभिन्न क्षेत्रों के लिए विशेष समर्थन के साथ विश्व स्तर पर सेवाएं प्रदान करता है। हमारी अंतर्राष्ट्रीय टीम समय क्षेत्रों में निर्बाध संचार सुनिश्चित करती है।"
    }
  ];

  return (
    <div className="text-white min-h-screen" style={{ marginTop: '12vh' }}>
      {/* Main container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Page title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-2">संपर्क करें</h1>
          <div className="w-24 h-1 bg-teal-400 mx-auto"></div>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            कोई प्रश्न हैं या सहायता चाहिए? हमारी टीम आपकी जरूरत की हर चीज में मदद करने के लिए यहां है।
          </p>
        </div>

        {/* Contact section with grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          
          {/* Contact cards */}
          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg hover:shadow-teal-500/20 transition duration-300">
            <div className="bg-teal-400 p-4 rounded-full mb-4">
              <Phone className="text-gray-900" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">हमें कॉल करें</h3>
            <p className="text-gray-300">हमारी सहायता टीम 24/7 उपलब्ध है</p>
            <a href="tel:+918357028350" className="text-teal-400 mt-4 font-medium hover:underline">+91 8357028350</a>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg hover:shadow-teal-500/20 transition duration-300">
            <div className="bg-teal-400 p-4 rounded-full mb-4">
              <Mail className="text-gray-900" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">हमें ईमेल करें</h3>
            <p className="text-gray-300">ईमेल के माध्यम से संपर्क करें</p>
            <a href="mailto:support@needstation.in" className="text-teal-400 mt-4 font-medium hover:underline">support@needstation.in</a>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg hover:shadow-teal-500/20 transition duration-300">
            <div className="bg-teal-400 p-4 rounded-full mb-4">
              <MapPin className="text-gray-900" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">हमसे मिलें</h3>
            <p className="text-gray-300">हमारा मुख्यालय स्थान</p>
            <p className="text-teal-400 mt-4 font-medium">
              Scheme 74, Indore<br />
              Madhya Pradesh, 452010
            </p>
          </div>
        </div>

        {/* Contact form and FAQ section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="mr-2">हमें संदेश भेजें</span>
              <div className="h-px bg-teal-400 flex-grow ml-4"></div>
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">आपका नाम</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="नाम"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">ईमेल पता</label>
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
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">विषय</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder='विषय'
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">आपका संदेश</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder='अपना संदेश यहां टाइप करें...'
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white resize-none"
                ></textarea>
              </div>
              
              {submitMessage && (
                <div className={`p-3 rounded-lg text-center ${
                  submitMessage.includes('सफलतापूर्वक') 
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
                {isSubmitting ? 'भेजा जा रहा है...' : 'संदेश भेजें'}
              </button>
            </div>
          </div>
          
          {/* FAQ section with dropdowns */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="mr-2">अक्सर पूछे जाने वाले प्रश्न</span>
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
          <h3 className="text-xl font-semibold mb-6">हमसे जुड़ें</h3>
          <div className="flex justify-center space-x-6">
            <a href="https://x.com/needstation" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-teal-400 hover:text-gray-900 transition duration-300" title="X (Twitter) पर हमें फॉलो करें">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://www.instagram.com/needstation.in" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-teal-400 hover:text-gray-900 transition duration-300" title="Instagram पर हमें फॉलो करें">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/needstation" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-teal-400 hover:text-gray-900 transition duration-300" title="LinkedIn पर हमसे जुड़ें">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="mt-20 bg-gray-800 rounded-lg p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">हमारे न्यूज़लेटर की सदस्यता लें</h3>
            <p className="text-gray-300">हमारी नवीनतम सेवाओं और ऑफ़र के साथ अपडेट रहें</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="अपना ईमेल दर्ज करें"
              className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
            />
            <button className="bg-teal-400 hover:bg-teal-500 text-gray-900 font-medium py-3 px-6 rounded-lg transition duration-300">
              सदस्यता लें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
