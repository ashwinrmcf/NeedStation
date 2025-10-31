import React, { useState } from 'react';
import styles from "../../HowItWorks/HowItWorks.module.css";
import ScrollToTop from "../../../hooks/ScrollToTop.jsx";

const HindiHowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "सेवाएं ब्राउज़ करें",
      description: "सफाई से लेकर मरम्मत तक, सभी घरेलू सेवाओं की हमारी व्यापक श्रृंखला को एक ही प्लेटफॉर्म पर देखें।",
      icon: "🔍",
      details: "सफाई, प्लंबिंग, इलेक्ट्रिकल कार्य, उपकरण मरम्मत और अधिक जैसी श्रेणियों के माध्यम से ब्राउज़ करें। प्रत्येक सेवा विस्तृत विवरण, मूल्य निर्धारण और प्रदाता रेटिंग के साथ आती है।"
    },
    {
      id: 2,
      title: "प्रदाता चुनें",
      description: "रेटिंग, समीक्षाओं और उपलब्धता के आधार पर सत्यापित पेशेवरों में से चुनें।",
      icon: "👥",
      details: "सेवा प्रदाताओं के विस्तृत प्रोफाइल देखें जिसमें उनका अनुभव, प्रमाणपत्र, ग्राहक समीक्षाएं और रीयल-टाइम उपलब्धता शामिल है। कीमतों और सेवाओं की आसानी से तुलना करें।"
    },
    {
      id: 3,
      title: "बुक करें और शेड्यूल करें",
      description: "अपनी पसंदीदा तारीख और समय चुनें, फिर तुरंत अपनी बुकिंग की पुष्टि करें।",
      icon: "📅",
      details: "एक सुविधाजनक समय स्लॉट चुनें जो आपके लिए काम करे। हमारी स्मार्ट शेड्यूलिंग प्रणाली आपके और सेवा प्रदाता दोनों के लिए इष्टतम समय सुनिश्चित करती है।"
    },
    {
      id: 4,
      title: "सेवा वितरण",
      description: "रीयल-टाइम ट्रैकिंग और अपडेट के साथ अपने दरवाजे पर पेशेवर सेवा का आनंद लें।",
      icon: "🏠",
      details: "अपने सेवा प्रदाता के आगमन को रीयल-टाइम में ट्रैक करें। पूरी सेवा प्रक्रिया के दौरान अपडेट प्राप्त करें और हमारे प्लेटफॉर्म के माध्यम से सीधे संवाद करें।"
    },
    {
      id: 5,
      title: "भुगतान और समीक्षा",
      description: "सुरक्षित भुगतान प्रसंस्करण और अपने अनुभव को रेट करने का अवसर।",
      icon: "⭐",
      details: "कई भुगतान विकल्पों के माध्यम से सुरक्षित रूप से भुगतान करें। अन्य ग्राहकों की मदद करने और हमारी सेवा गुणवत्ता में सुधार करने के लिए अपने अनुभव को रेट और समीक्षा करें।"
    }
  ];

  const features = [
    {
      title: "सत्यापित पेशेवर",
      description: "सभी सेवा प्रदाता गहन पृष्ठभूमि जांच और कौशल सत्यापन से गुजरते हैं",
      icon: "✅"
    },
    {
      title: "रीयल-टाइम ट्रैकिंग",
      description: "अपने सेवा प्रदाता के स्थान को ट्रैक करें और सेवा प्रगति पर लाइव अपडेट प्राप्त करें",
      icon: "📍"
    },
    {
      title: "सुरक्षित भुगतान",
      description: "बैंक-स्तरीय सुरक्षा और धोखाधड़ी सुरक्षा के साथ कई भुगतान विकल्प",
      icon: "🔒"
    },
    {
      title: "24/7 सहायता",
      description: "किसी भी प्रश्न या समस्या में आपकी सहायता के लिए चौबीसों घंटे ग्राहक सहायता",
      icon: "🎧"
    },
    {
      title: "गुणवत्ता गारंटी",
      description: "यदि आप पूरी तरह से संतुष्ट नहीं हैं तो मुफ्त पुन: सेवा के साथ 100% संतुष्टि गारंटी",
      icon: "🛡️"
    },
    {
      title: "लचीली शेड्यूलिंग",
      description: "उसी दिन और आपातकालीन सेवा विकल्पों के साथ अपनी सुविधा पर सेवाएं बुक करें",
      icon: "⏰"
    }
  ];

  return (
    <div className={styles.howItWorksContainer}>
      <ScrollToTop />
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.highlight}>NeedStation</span> कैसे काम करता है
          </h1>
          <p className={styles.heroSubtitle}>
            सभी घरेलू सेवाओं के लिए आपका विश्वसनीय साथी - सरल, विश्वसनीय और पेशेवर
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>खुश ग्राहक</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>सत्यापित पेशेवर</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>सेवा श्रेणियां</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className={styles.stepsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>शुरू करने के लिए सरल कदम</h2>
          <div className={styles.stepsContainer}>
            <div className={styles.stepsTimeline}>
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`${styles.stepItem} ${activeStep === index ? styles.active : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={styles.stepNumber}>
                    <span className={styles.stepIcon}>{step.icon}</span>
                    <span className={styles.stepCount}>{step.id}</span>
                  </div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.stepDetails}>
              <div className={styles.stepDetailCard}>
                <div className={styles.stepDetailIcon}>
                  {steps[activeStep].icon}
                </div>
                <h3 className={styles.stepDetailTitle}>
                  {steps[activeStep].title}
                </h3>
                <p className={styles.stepDetailDescription}>
                  {steps[activeStep].details}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>NeedStation क्यों चुनें?</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>अंतर का अनुभव करने के लिए तैयार हैं?</h2>
            <p className={styles.ctaDescription}>
              हजारों संतुष्ट ग्राहकों में शामिल हों जो अपनी घरेलू सेवा आवश्यकताओं के लिए NeedStation पर भरोसा करते हैं
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryBtn}>सेवा बुक करें</button>
              <button className={styles.secondaryBtn}>प्रदाता बनें</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HindiHowItWorks;
