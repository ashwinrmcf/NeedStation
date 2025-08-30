import React from 'react';
import styles from '../PrivacyPolicy/PrivacyPolicy.module.css';

const HindiPrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>गोपनीयता <span className={styles.highlight}>नीति</span></h1>
          <div className={styles.headerAccent}></div>
          <p className={styles.subtitle}>
            आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। जानें कि हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>1. हम जो जानकारी एकत्र करते हैं</h2>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>व्यक्तिगत जानकारी</h3>
            <p className={styles.text}>
              जब आप NeedStation के साथ खाता बनाते हैं, तो हम निम्नलिखित व्यक्तिगत जानकारी एकत्र करते हैं:
            </p>
            <ul className={styles.list}>
              <li>पूरा नाम और संपर्क जानकारी</li>
              <li>ईमेल पता और फोन नंबर</li>
              <li>स्थान और पता विवरण</li>
              <li>प्रोफाइल चित्र और पहचान दस्तावेज</li>
              <li>भुगतान जानकारी और बिलिंग विवरण</li>
            </ul>
          </div>
          
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>सेवा जानकारी</h3>
            <p className={styles.text}>
              हम आपके द्वारा अनुरोधित या प्रदान की जाने वाली सेवाओं से संबंधित जानकारी एकत्र करते हैं:
            </p>
            <ul className={styles.list}>
              <li>सेवा प्राथमिकताएं और आवश्यकताएं</li>
              <li>बुकिंग इतिहास और लेनदेन रिकॉर्ड</li>
              <li>समीक्षा और रेटिंग</li>
              <li>उपयोगकर्ताओं और सेवा प्रदाताओं के बीच संचार</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>तकनीकी जानकारी</h3>
            <p className={styles.text}>
              जब आप हमारे प्लेटफॉर्म का उपयोग करते हैं तो हम स्वचालित रूप से कुछ तकनीकी जानकारी एकत्र करते हैं:
            </p>
            <ul className={styles.list}>
              <li>डिवाइस जानकारी और ब्राउज़र प्रकार</li>
              <li>IP पता और स्थान डेटा</li>
              <li>उपयोग पैटर्न और ऐप इंटरैक्शन</li>
              <li>कुकीज़ और समान ट्रैकिंग तकनीकें</li>
            </ul>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>2. हम आपकी जानकारी का उपयोग कैसे करते हैं</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔧</div>
              <h3 className={styles.cardTitle}>सेवा वितरण</h3>
              <p className={styles.cardText}>
                आपको योग्य सेवा प्रदाताओं से जोड़ने और निर्बाध सेवा वितरण की सुविधा के लिए।
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🛡️</div>
              <h3 className={styles.cardTitle}>सुरक्षा और संरक्षा</h3>
              <p className={styles.cardText}>
                पहचान सत्यापित करने, बैकग्राउंड चेक करने, और सभी उपयोगकर्ताओं की सुरक्षा सुनिश्चित करने के लिए।
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>💬</div>
              <h3 className={styles.cardTitle}>संचार</h3>
              <p className={styles.cardText}>
                महत्वपूर्ण अपडेट, सूचनाएं भेजने और उपयोगकर्ताओं के बीच संचार की सुविधा के लिए।
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📊</div>
              <h3 className={styles.cardTitle}>प्लेटफॉर्म सुधार</h3>
              <p className={styles.cardText}>
                उपयोग पैटर्न का विश्लेषण करने और हमारी सेवाओं, सुविधाओं और उपयोगकर्ता अनुभव में सुधार के लिए।
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>3. जानकारी साझाकरण</h2>
          <div className={styles.highlightBox}>
            <h3 className={styles.highlightTitle}>हम आपका डेटा कभी नहीं बेचते</h3>
            <p className={styles.highlightText}>
              NeedStation मार्केटिंग उद्देश्यों के लिए आपकी व्यक्तिगत जानकारी को तीसरे पक्ष को नहीं बेचता, किराए पर नहीं देता या व्यापार नहीं करता।
            </p>
          </div>
          
          <p className={styles.text}>हम केवल निम्नलिखित परिस्थितियों में आपकी जानकारी साझा कर सकते हैं:</p>
          <div className={styles.sharingGrid}>
            <div className={styles.sharingItem}>
              <h4 className={styles.sharingTitle}>सेवा प्रदाता</h4>
              <p className={styles.sharingText}>
                सेवा वितरण और संचार की सुविधा के लिए हेल्पर्स और सेवा प्रदाताओं के साथ।
              </p>
            </div>
            <div className={styles.sharingItem}>
              <h4 className={styles.sharingTitle}>कानूनी आवश्यकताएं</h4>
              <p className={styles.sharingText}>
                जब कानून, न्यायालय के आदेश, या हमारे उपयोगकर्ताओं के अधिकारों और सुरक्षा की रक्षा के लिए आवश्यक हो।
              </p>
            </div>
            <div className={styles.sharingItem}>
              <h4 className={styles.sharingTitle}>व्यावसायिक साझीदार</h4>
              <p className={styles.sharingText}>
                विश्वसनीय साझीदारों के साथ जो हमारे प्लेटफॉर्म को संचालित करने में मदद करते हैं, कड़े गोपनीयता समझौतों के अधीन।
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>4. डेटा सुरक्षा</h2>
          <p className={styles.text}>
            हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपाय लागू करते हैं:
          </p>
          <div className={styles.securityGrid}>
            <div className={styles.securityItem}>
              <div className={styles.securityIcon}>🔐</div>
              <h4 className={styles.securityTitle}>एन्क्रिप्शन</h4>
              <p className={styles.securityText}>सभी डेटा उन्नत एन्क्रिप्शन मानकों का उपयोग करके ट्रांजिट और रेस्ट में एन्क्रिप्ट किया गया है।</p>
            </div>
            <div className={styles.securityItem}>
              <div className={styles.securityIcon}>🏢</div>
              <h4 className={styles.securityTitle}>सुरक्षित सर्वर</h4>
              <p className={styles.securityText}>हमारे सर्वर 24/7 निगरानी और पहुंच नियंत्रण के साथ सुरक्षित डेटा केंद्रों में होस्ट किए गए हैं।</p>
            </div>
            <div className={styles.securityItem}>
              <div className={styles.securityIcon}>👥</div>
              <h4 className={styles.securityTitle}>पहुंच नियंत्रण</h4>
              <p className={styles.securityText}>नियमित सुरक्षा प्रशिक्षण के साथ आवश्यकता-आधारित आधार पर व्यक्तिगत डेटा तक सीमित पहुंच।</p>
            </div>
            <div className={styles.securityItem}>
              <div className={styles.securityIcon}>🔍</div>
              <h4 className={styles.securityTitle}>नियमित ऑडिट</h4>
              <p className={styles.securityText}>उच्च सुरक्षा मानकों को बनाए रखने के लिए नियमित सुरक्षा ऑडिट और भेद्यता मूल्यांकन।</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>5. आपके अधिकार</h2>
          <p className={styles.text}>
            आपकी व्यक्तिगत जानकारी के संबंध में आपके निम्नलिखित अधिकार हैं:
          </p>
          <div className={styles.rightsContainer}>
            <div className={styles.rightItem}>
              <h4 className={styles.rightTitle}>पहुंच</h4>
              <p className={styles.rightText}>हमारे पास आपके बारे में मौजूद व्यक्तिगत जानकारी की प्रति का अनुरोध करें।</p>
            </div>
            <div className={styles.rightItem}>
              <h4 className={styles.rightTitle}>सुधार</h4>
              <p className={styles.rightText}>किसी भी गलत या अधूरी जानकारी को अपडेट या सही करें।</p>
            </div>
            <div className={styles.rightItem}>
              <h4 className={styles.rightTitle}>हटाना</h4>
              <p className={styles.rightText}>कानूनी आवश्यकताओं के अधीन, अपनी व्यक्तिगत जानकारी को हटाने का अनुरोध करें।</p>
            </div>
            <div className={styles.rightItem}>
              <h4 className={styles.rightTitle}>पोर्टेबिलिटी</h4>
              <p className={styles.rightText}>अपना डेटा संरचित, मशीन-पठनीय प्रारूप में प्राप्त करें।</p>
            </div>
            <div className={styles.rightItem}>
              <h4 className={styles.rightTitle}>आपत्ति</h4>
              <p className={styles.rightText}>अपनी व्यक्तिगत जानकारी के कुछ प्रकार की प्रसंस्करण पर आपत्ति करें।</p>
            </div>
            <div className={styles.rightItem}>
              <h4 className={styles.rightTitle}>प्रतिबंध</h4>
              <p className={styles.rightText}>कुछ परिस्थितियों में प्रसंस्करण के प्रतिबंध का अनुरोध करें।</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>6. कुकीज़ और ट्रैकिंग</h2>
          <p className={styles.text}>
            हम आपके हमारे प्लेटफॉर्म पर अनुभव को बेहतर बनाने के लिए कुकीज़ और समान तकनीकों का उपयोग करते हैं:
          </p>
          <div className={styles.cookieTypes}>
            <div className={styles.cookieType}>
              <h4 className={styles.cookieTitle}>आवश्यक कुकीज़</h4>
              <p className={styles.cookieText}>बुनियादी प्लेटफॉर्म कार्यक्षमता और सुरक्षा के लिए आवश्यक।</p>
            </div>
            <div className={styles.cookieType}>
              <h4 className={styles.cookieTitle}>प्रदर्शन कुकीज़</h4>
              <p className={styles.cookieText}>प्रदर्शन सुधारने के लिए समझने में मदद करती हैं कि आप हमारे प्लेटफॉर्म के साथ कैसे इंटरैक्ट करते हैं।</p>
            </div>
            <div className={styles.cookieType}>
              <h4 className={styles.cookieTitle}>कार्यात्मक कुकीज़</h4>
              <p className={styles.cookieText}>आपकी प्राथमिकताओं को याद रखती हैं और व्यक्तिगत सुविधाएं प्रदान करती हैं।</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>7. डेटा प्रतिधारण</h2>
          <p className={styles.text}>
            हम आपकी व्यक्तिगत जानकारी को केवल इस नीति में उल्लिखित उद्देश्यों के लिए आवश्यक समय तक ही रखते हैं:
          </p>
          <ul className={styles.list}>
            <li>खाता जानकारी: आपका खाता सक्रिय रहने तक और खाता बंद होने के 3 साल बाद तक रखी जाती है</li>
            <li>लेनदेन रिकॉर्ड: कानूनी और लेखांकन उद्देश्यों के लिए 7 साल तक रखे जाते हैं</li>
            <li>संचार लॉग: गुणवत्ता आश्वासन और विवाद समाधान के लिए 2 साल तक रखे जाते हैं</li>
            <li>मार्केटिंग डेटा: जब तक आप ऑप्ट आउट नहीं करते या 3 साल की निष्क्रियता तक रखा जाता है</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>8. बच्चों की गोपनीयता</h2>
          <div className={styles.warningBox}>
            <h3 className={styles.warningTitle}>आयु प्रतिबंध</h3>
            <p className={styles.warningText}>
              NeedStation 18 वर्ष से कम आयु के बच्चों के लिए नहीं है। हम जानबूझकर 18 वर्ष से कम 
              बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते। यदि आपको लगता है कि हमने 18 वर्ष से कम 
              बच्चे से जानकारी एकत्र की है, तो कृपया तुरंत हमसे संपर्क करें।
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>9. अंतर्राष्ट्रीय डेटा स्थानांतरण</h2>
          <p className={styles.text}>
            आपकी जानकारी को आपके अपने देश के अलावा अन्य देशों में स्थानांतरित और प्रसंस्करण किया जा सकता है। 
            हम यह सुनिश्चित करते हैं कि लागू डेटा सुरक्षा कानूनों के अनुसार आपके डेटा की सुरक्षा के लिए 
            उचित सुरक्षा उपाय मौजूद हैं।
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>10. इस नीति में परिवर्तन</h2>
          <p className={styles.text}>
            हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। हम किसी भी महत्वपूर्ण परिवर्तन की 
            सूचना हमारे प्लेटफॉर्म पर नई नीति पोस्ट करके और "अंतिम अपडेट" तारीख अपडेट करके देंगे। 
            ऐसे परिवर्तनों के बाद हमारी सेवाओं का आपका निरंतर उपयोग अपडेटेड नीति की स्वीकृति का गठन करता है।
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>हमसे संपर्क करें</h2>
          <p className={styles.text}>
            यदि आपके पास इस गोपनीयता नीति या हमारी डेटा प्रथाओं के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <strong>ईमेल:</strong> privacy@needstation.com
            </div>
            <div className={styles.contactItem}>
              <strong>फोन:</strong> +11 222 3333
            </div>
            <div className={styles.contactItem}>
              <strong>पता:</strong> 2972 Westheimer Rd, Santa Ana, Illinois 85486
            </div>
          </div>
        </div>
        
        <div className={styles.lastUpdated}>
          <p>अंतिम अपडेट: जनवरी 2024</p>
        </div>
      </div>
    </div>
  );
};

export default HindiPrivacyPolicy;
