import React, { useState } from 'react';
import styles from "../FAQ/FAQ.module.css";
import ScrollToTop from "../../hooks/ScrollToTop.jsx";

const HindiFAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    { id: 'general', name: 'सामान्य', icon: '❓' },
    { id: 'booking', name: 'बुकिंग', icon: '📅' },
    { id: 'payment', name: 'भुगतान', icon: '💳' },
    { id: 'providers', name: 'सेवा प्रदाता', icon: '👥' },
    { id: 'support', name: 'सहायता', icon: '🎧' }
  ];

  const faqData = {
    general: [
      {
        question: "NeedStation क्या है?",
        answer: "NeedStation एक व्यापक घरेलू सेवा प्लेटफॉर्म है जो सफाई, मरम्मत, रखरखाव, और अन्य विभिन्न घरेलू आवश्यकताओं के लिए ग्राहकों को सत्यापित पेशेवरों से जोड़ता है। हम अपनी कठोर जांच प्रक्रिया और ग्राहक संतुष्टि गारंटी के माध्यम से गुणवत्तापूर्ण सेवा वितरण सुनिश्चित करते हैं।"
      },
      {
        question: "NeedStation सेवा गुणवत्ता कैसे सुनिश्चित करता है?",
        answer: "हम कई उपायों के माध्यम से उच्च सेवा मानकों को बनाए रखते हैं: सभी सेवा प्रदाताओं की पूरी तरह से बैकग्राउंड जांच, कौशल सत्यापन परीक्षण, ग्राहक रेटिंग सिस्टम, नियमित गुणवत्ता ऑडिट, और आवश्यकता पड़ने पर मुफ्त पुन: सेवा के साथ 100% संतुष्टि गारंटी।"
      },
      {
        question: "आप किन क्षेत्रों में सेवा करते हैं?",
        answer: "NeedStation वर्तमान में प्रमुख महानगरीय क्षेत्रों में काम करता है और तेजी से विस्तार कर रहा है। यह देखने के लिए कि क्या हम आपके स्थान पर सेवा करते हैं, होमपेज पर हमारा सेवा क्षेत्र मानचित्र देखें या हमसे संपर्क करें। हम लगातार अपने नेटवर्क में नए शहर जोड़ रहे हैं।"
      },
      {
        question: "क्या आपके सेवा प्रदाता बीमाकृत हैं?",
        answer: "हां, हमारे सभी सेवा प्रदाता देयता और श्रमिक मुआवजा सहित व्यापक बीमा कवरेज रखते हैं। यह सेवा वितरण के दौरान आपकी और सेवा प्रदाता दोनों की सुरक्षा करता है।"
      }
    ],
    booking: [
      {
        question: "मैं सेवा कैसे बुक करूं?",
        answer: "बुकिंग सरल है: हमारी सेवाओं को ब्राउज़ करें, रेटिंग और उपलब्धता के आधार पर अपने पसंदीदा प्रदाता का चयन करें, अपनी पसंदीदा तारीख और समय चुनें, सेवा विवरण प्रदान करें, और अपनी बुकिंग की पुष्टि करें। आपको प्रदाता विवरण के साथ तत्काल पुष्टि मिलेगी।"
      },
      {
        question: "क्या मैं अपनी बुकिंग को पुनर्निर्धारित या रद्द कर सकता हूं?",
        answer: "हां, आप निर्धारित समय से 4 घंटे पहले तक बिना किसी शुल्क के अपनी बुकिंग को पुनर्निर्धारित या रद्द कर सकते हैं। 4 घंटे के भीतर रद्दीकरण के लिए एक छोटा रद्दीकरण शुल्क लग सकता है। अपनी बुकिंग प्रबंधित करने के लिए हमारे ऐप या वेबसाइट का उपयोग करें।"
      },
      {
        question: "यदि मेरे पसंदीदा समय के लिए कोई प्रदाता उपलब्ध नहीं है तो क्या होगा?",
        answer: "हमारा सिस्टम उपलब्ध प्रदाताओं के साथ वैकल्पिक समय स्लॉट सुझाएगा। आप अपने पसंदीदा समय के लिए हमारी प्रतीक्षा सूची में भी शामिल हो सकते हैं, और यदि कोई स्लॉट खुलता है तो हम आपको सूचित करेंगे। तत्काल आवश्यकताओं के लिए, हम प्रीमियम मूल्य निर्धारण के साथ आपातकालीन सेवाएं प्रदान करते हैं।"
      },
      {
        question: "मैं कितने समय पहले सेवा बुक कर सकता हूं?",
        answer: "आप 30 दिन पहले तक सेवाएं बुक कर सकते हैं। समान दिन की बुकिंग के लिए, सेवाएं प्रदाता उपलब्धता के आधार पर उपलब्ध हैं। हम प्रदाताओं और समय स्लॉट के सर्वोत्तम चयन के लिए कम से कम 24 घंटे पहले बुकिंग करने की सलाह देते हैं।"
      }
    ],
    payment: [
      {
        question: "आप कौन से भुगतान के तरीके स्वीकार करते हैं?",
        answer: "हम सभी प्रमुख क्रेडिट कार्ड (Visa, MasterCard, American Express), डेबिट कार्ड, डिजिटल वॉलेट (PayPal, Apple Pay, Google Pay), और बैंक ट्रांसफर स्वीकार करते हैं। सभी भुगतान बैंक-स्तरीय एन्क्रिप्शन के साथ सुरक्षित रूप से प्रोसेस किए जाते हैं।"
      },
      {
        question: "सेवा के लिए मुझसे कब शुल्क लिया जाता है?",
        answer: "सेवा पूरी होने और आपके संतुष्टि की पुष्टि के बाद भुगतान प्रोसेस किया जाता है। कुछ प्रीमियम सेवाओं के लिए, एक छोटा बुकिंग शुल्क अग्रिम लिया जा सकता है, जो अंतिम बिल के विरुद्ध समायोजित किया जाता है।"
      },
      {
        question: "यदि मैं संतुष्ट नहीं हूं तो क्या मुझे रिफंड मिल सकता है?",
        answer: "बिल्कुल! हम 100% संतुष्टि गारंटी प्रदान करते हैं। यदि आप सेवा से पूरी तरह संतुष्ट नहीं हैं, तो हम या तो मुफ्त पुन: सेवा की व्यवस्था करेंगे या पूरा रिफंड प्रदान करेंगे। सेवा पूरी होने के 24 घंटे के भीतर हमारी सहायता टीम से संपर्क करें।"
      },
      {
        question: "क्या कोई छुपे हुए शुल्क हैं?",
        answer: "नहीं, हम पारदर्शी मूल्य निर्धारण में विश्वास करते हैं। सेवा शुल्क, कर, और कोई भी लागू शुल्क सहित सभी लागतें आपकी बुकिंग की पुष्टि से पहले स्पष्ट रूप से प्रदर्शित की जाती हैं। जो कीमत आप देखते हैं वही आप भुगतान करते हैं।"
      }
    ],
    providers: [
      {
        question: "आप सेवा प्रदाताओं का चयन कैसे करते हैं?",
        answer: "हमारी कठोर चयन प्रक्रिया में बैकग्राउंड सत्यापन, कौशल मूल्यांकन परीक्षण, संदर्भ जांच, बीमा सत्यापन, और पर्यवेक्षित सेवाओं के साथ एक परिवीक्षा अवधि शामिल है। केवल आवेदकों के शीर्ष 10% ही हमारी स्क्रीनिंग प्रक्रिया से गुजरते हैं।"
      },
      {
        question: "क्या मैं भविष्य की सेवाओं के लिए समान प्रदाता का अनुरोध कर सकता हूं?",
        answer: "हां! यदि आप किसी प्रदाता की सेवा से संतुष्ट हैं, तो आप उन्हें अपने पसंदीदा में जोड़ सकते हैं और भविष्य की बुकिंग के लिए उनका अनुरोध कर सकते हैं। हम उनकी उपलब्धता के आधार पर आपको आपके पसंदीदा प्रदाताओं के साथ मैच करने को प्राथमिकता देंगे।"
      },
      {
        question: "यदि मुझे सेवा प्रदाता के साथ समस्या है तो क्या होगा?",
        answer: "तुरंत हमारी सहायता टीम से संपर्क करें। हम सभी शिकायतों को गंभीरता से लेते हैं और तुरंत जांच करेंगे। समस्या के आधार पर, हम एक प्रतिस्थापन प्रदाता की व्यवस्था कर सकते हैं, पुन: सेवा की पेशकश कर सकते हैं, या रिफंड प्रदान कर सकते हैं। प्रदाता रेटिंग और फीडबैक हमें गुणवत्ता मानकों को बनाए रखने में मदद करते हैं।"
      },
      {
        question: "प्रदाताओं को कैसे रेट और समीक्षा किया जाता है?",
        answer: "प्रत्येक सेवा के बाद, ग्राहक 5-स्टार स्केल पर प्रदाताओं को रेट कर सकते हैं और विस्तृत समीक्षा छोड़ सकते हैं। ये रेटिंग समयबद्धता, काम की गुणवत्ता, व्यावसायिकता, और समग्र संतुष्टि जैसे कारकों पर विचार करती हैं। सभी समीक्षाएं सत्यापित हैं और अन्य ग्राहकों को सूचित विकल्प बनाने में मदद करती हैं।"
      }
    ],
    support: [
      {
        question: "मैं ग्राहक सहायता से कैसे संपर्क कर सकता हूं?",
        answer: "हमारी ग्राहक सहायता कई चैनलों के माध्यम से 24/7 उपलब्ध है: इन-ऐप चैट, फोन सहायता, ईमेल, और हमारी वेबसाइट संपर्क फॉर्म। सेवा वितरण के दौरान तत्काल समस्याओं के लिए, तत्काल सहायता के लिए हमारी आपातकालीन हॉटलाइन का उपयोग करें।"
      },
      {
        question: "सेवा के दौरान आपातकाल होने पर क्या होगा?",
        answer: "सेवा वितरण के दौरान किसी भी आपातकाल के लिए, तुरंत हमारी 24/7 आपातकालीन हॉटलाइन से संपर्क करें। हमारे पास विभिन्न आपातकालीन स्थितियों के लिए प्रोटोकॉल हैं और यदि आवश्यक हो तो स्थानीय अधिकारियों के साथ समन्वय करेंगे। आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है।"
      },
      {
        question: "मैं अपने सेवा अनुरोध को कैसे ट्रैक कर सकता हूं?",
        answer: "आप हमारे ऐप या वेबसाइट के माध्यम से अपनी सेवा को रियल-टाइम में ट्रैक कर सकते हैं। जब प्रदाता असाइन किया जाता है, जब वे रास्ते में होते हैं, और पूरी सेवा प्रक्रिया के दौरान आपको अपडेट मिलेंगे। GPS ट्रैकिंग ऑन-साइट सेवाओं के लिए प्रदाता का स्थान दिखाती है।"
      },
      {
        question: "क्या मैं प्लेटफॉर्म के बारे में फीडबैक दे सकता हूं?",
        answer: "हम आपके फीडबैक का स्वागत करते हैं! आप हमारे ऐप, वेबसाइट के माध्यम से या ग्राहक सहायता से संपर्क करके सुझाव साझा कर सकते हैं, समस्याओं की रिपोर्ट कर सकते हैं, या सामान्य फीडबैक प्रदान कर सकते हैं। आपका इनपुट हमें अपने प्लेटफॉर्म और सेवाओं में लगातार सुधार करने में मदद करता है।"
      }
    ]
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <ScrollToTop />
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            अक्सर पूछे जाने वाले <span className={styles.highlight}>प्रश्न</span>
          </h1>
          <p className={styles.heroSubtitle}>
            NeedStation सेवाओं, बुकिंग, और सहायता के बारे में सामान्य प्रश्नों के उत्तर खोजें
          </p>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="उत्तर खोजें..." 
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>🔍</button>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.faqLayout}>
            {/* Category Sidebar */}
            <div className={styles.categorySidebar}>
              <h3 className={styles.sidebarTitle}>श्रेणियां</h3>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`${styles.categoryBtn} ${activeCategory === category.id ? styles.active : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span className={styles.categoryName}>{category.name}</span>
                </button>
              ))}
            </div>

            {/* FAQ Content */}
            <div className={styles.faqContent}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>
                  {categories.find(cat => cat.id === activeCategory)?.icon} {' '}
                  {categories.find(cat => cat.id === activeCategory)?.name} प्रश्न
                </h2>
                <p className={styles.categoryDescription}>
                  इस श्रेणी में {faqData[activeCategory].length} प्रश्न
                </p>
              </div>

              <div className={styles.faqList}>
                {faqData[activeCategory].map((faq, index) => (
                  <div key={index} className={styles.faqItem}>
                    <button
                      className={`${styles.faqQuestion} ${openFAQ === index ? styles.open : ''}`}
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className={styles.questionText}>{faq.question}</span>
                      <span className={styles.toggleIcon}>
                        {openFAQ === index ? '−' : '+'}
                      </span>
                    </button>
                    <div className={`${styles.faqAnswer} ${openFAQ === index ? styles.open : ''}`}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className={styles.supportSection}>
        <div className={styles.container}>
          <div className={styles.supportContent}>
            <h2 className={styles.supportTitle}>अभी भी प्रश्न हैं?</h2>
            <p className={styles.supportDescription}>
              जो आप खोज रहे हैं वो नहीं मिल रहा? हमारी सहायता टीम 24/7 मदद के लिए यहाँ है
            </p>
            <div className={styles.supportOptions}>
              <div className={styles.supportOption}>
                <div className={styles.supportIcon}>💬</div>
                <h3>लाइव चैट</h3>
                <p>हमारी सहायता टीम से तत्काल मदद पाएं</p>
                <button className={styles.supportBtn}>चैट शुरू करें</button>
              </div>
              <div className={styles.supportOption}>
                <div className={styles.supportIcon}>📞</div>
                <h3>फोन सहायता</h3>
                <p>तत्काल सहायता के लिए हमें कॉल करें</p>
                <button className={styles.supportBtn}>अभी कॉल करें</button>
              </div>
              <div className={styles.supportOption}>
                <div className={styles.supportIcon}>✉️</div>
                <h3>ईमेल सहायता</h3>
                <p>ईमेल के माध्यम से अपने प्रश्न भेजें</p>
                <button className={styles.supportBtn}>ईमेल भेजें</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HindiFAQ;
