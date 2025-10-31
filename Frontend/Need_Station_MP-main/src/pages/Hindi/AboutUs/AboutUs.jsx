import styles from "../../AboutUs/AboutUs.module.css";
import ScrollToTop from "../../../hooks/ScrollToTop.jsx";
import ashwin from "../../../assets/images/AboutUs/ashwin.jpg";
import ajitesh from "../../../assets/images/AboutUs/ajitesh.jpg";
import abhishek from "../../../assets/images/AboutUs/abhishek.jpg";
import zainab from "../../../assets/images/AboutUs/zainab.jpg";
import yash from "../../../assets/images/AboutUs/yash.png";
import navneet from "../../../assets/images/AboutUs/navneet.jpeg";
import bairagi from "../../../assets/images/AboutUs/bairagi.jpeg";
import siddharth from "../../../assets/images/AboutUs/siddharth.jpg";
import divyaraj from "../../../assets/images/AboutUs/divyaraj.png";
import logo from "../../../assets/images/AboutUs/logo.jpeg";

const HindiAboutUs = () => {
  const teamMembers = [
    {
      name: "Ashwin Soni",
      role: "वित्तीय संचालन",
      image: ashwin,
      description: "वित्तीय संरचना, व्यवसाय प्रबंधन और राजस्व वृद्धि का नेतृत्व करते हैं, साथ ही समग्र विकास के लिए कानूनी, ग्राहक, उत्पाद और सुरक्षा पहलों की देखरेख करते हैं।",
    },
    {
      name: "Zainab Ansari",
      role: "ग्राहक अनुभव",
      image: zainab,
      description: "ग्राहक जुड़ाव की रणनीतिक दिशा का नेतृत्व करती हैं, यह सुनिश्चित करते हुए कि प्रत्येक बातचीत गुणवत्ता, देखभाल और विश्वास को दर्शाती है।",
    },
    {
      name: "Abhishek Gupta",
      role: "प्रौद्योगिकी अवसंरचना",
      image: abhishek,
      description: "तकनीकी बुनियादी ढांचे और प्लेटफॉर्म विकास का प्रबंधन करते हैं, सुरक्षा, स्केलेबिलिटी और निर्बाध उपयोगकर्ता अनुभव सुनिश्चित करते हैं।",
    },
    {
      name: "Ajitesh Tripathi",
      role: "संचालन प्रबंधक",
      image: ajitesh,
      description: "ग्राहक संबंधों को आंतरिक निष्पादन के साथ जोड़ते हैं, टीम कार्यों की देखरेख करते हैं और समय पर, उच्च गुणवत्ता वाली डिलीवरी सुनिश्चित करते हैं जो विश्वास और दक्षता को मजबूत करती है।",
    },
    {
      name: "Navneet Chauhan",
      role: "डेटा और मार्केटिंग",
      image: navneet,
      description: "डेटाबेस संचालन की देखरेख करते हैं और सोशल मीडिया मार्केटिंग को चलाते हैं, कुशल और प्रभावशाली पहुंच के लिए विश्लेषण को रचनात्मकता के साथ मिलाते हैं।",
    },
    {
      name: "Aman Bairagi",
      role: "व्यवसाय विकास",
      image: bairagi,
      description: "रणनीतियों को लागू करके व्यवसाय वृद्धि को बढ़ावा देते हैं जो हमारी पहुंच का विस्तार करती हैं और हमारी सेवाओं के प्रभाव को उजागर करती हैं।",
    },
    {
      name: "Yash Sharma",
      role: "उत्पाद विकास",
      image: yash,
      description: "NeedStation की सेवाओं और डिजिटल प्लेटफॉर्म को डिजाइन, परिष्कृत और बढ़ाकर नवाचार को बढ़ावा देते हैं, उपयोगकर्ता की जरूरतों और बाजार के रुझानों के साथ संरेखण सुनिश्चित करते हैं।",
    },
    {
      name: "Siddharth Singh Rathore",
      role: "व्यवसाय रणनीति",
      image: siddharth, 
      description: "स्थानीय बाजार वार्ता और ब्रांड अभियानों का नेतृत्व करते हैं, रचनात्मक लेखन को रणनीतिक मार्केटिंग और समर्थन के साथ जोड़ते हैं।",
    },
    {
      name: "Divyaraj Singh Panwar",
      role: "मीडिया और साझेदारी",
      image: divyaraj, 
      description: "बड़े ग्राहक पहुंच और डिजिटल वार्ता का प्रबंधन करते हैं जबकि रचनात्मक सामग्री, YouTube रणनीति और ब्रांड साझेदारी का निर्देशन करते हैं।",
    },
  ];

  // Service categories in Hindi
  const serviceCategories = [
    {
      title: "बुजुर्ग देखभाल",
      icon: "",
      services: [
        "देखभालकर्ता",
        "लकवा देखभालकर्ता",
        "प्रसवोत्तर देखभालकर्ता",
        "नर्स",
        "स्वास्थ्य जांच सेवाएं",
        "बेबी सिटर",
      ],
    },
    {
      title: "बुनियादी जरूरतें",
      icon: "",
      services: ["इलेक्ट्रीशियन", "प्लंबर", "जल आपूर्ति"],
    },
    {
      title: "मेड सेवाएं",
      icon: "",
      services: ["खाना पकाना", "सफाई", "कपड़े धोना"],
    },
  ];

  return (
    <>
      <ScrollToTop />
      <main className={`${styles["about-main"]} page-content-spacing`}>
        <div className={styles["container"]}>
          {/* Vision & Mission Section */}
          <section className={styles["vision-section"]}>
            <h2>NeedStation के बारे में</h2>
            <div className={styles["vision-content"]}>
              <div className={styles["vision-text"]}>
                <h3>हमारा विजन</h3>
                <p>
                  एक ऐसा प्लेटफॉर्म बनाना जो घरों को विश्वसनीय और सत्यापित सेवा 
                  प्रदाताओं से जोड़ता है, जिससे सभी के लिए दैनिक जीवन अधिक सुविधाजनक 
                  और प्रबंधनीय हो जाए।
                </p>
                
                <h3>हमारा मिशन</h3>
                <p>
                  हमारा लक्ष्य एक सुरक्षित, विश्वसनीय और उपयोगकर्ता के अनुकूल प्लेटफॉर्म 
                  प्रदान करके सेवा चाहने वालों और प्रदाताओं के बीच की खाई को पाटना है जो 
                  आवश्यक घरेलू जरूरतों और बुजुर्ग देखभाल सेवाओं को संबोधित करता है।
                </p>
              </div>
              <div className={styles["vision-image"]}>
                <div className={styles["logo-container"]}>
                  <img 
                    src={logo} 
                    alt="NeedStation Logo" 
                    className={styles["logo-image"]} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className={styles["services-section"]}>
            <h2>हमारी सेवाएं</h2>
            <p className={styles["section-description"]}>
              NeedStation में, हम आपकी रोजमर्रा की जरूरतों को पूरा करने और आपके 
              प्रियजनों के लिए विशेष देखभाल प्रदान करने के लिए डिज़ाइन की गई सेवाओं 
              की एक व्यापक श्रृंखला प्रदान करते हैं।
            </p>
            
            <div className={styles["service-categories"]}>
              {serviceCategories.map((category, index) => (
                <div key={index} className={styles["service-category"]}>
                  <div className={styles["category-header"]}>
                    <span className={styles["category-icon"]}>{category.icon}</span>
                    <h3>{category.title}</h3>
                  </div>
                  <ul className={styles["service-list"]}>
                    {category.services.map((service, sIndex) => (
                      <li key={sIndex}>{service}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className={styles["team-section"]}>
            <h2>हमारी टीम से मिलें</h2>
            <p className={styles["section-description"]}>
              हमारी समर्पित पेशेवरों की टीम यह सुनिश्चित करने के लिए अथक प्रयास 
              करती है कि NeedStation आपकी घरेलू जरूरतों को पूरा करने के लिए उच्चतम 
              गुणवत्ता की सेवाएं प्रदान करे।
            </p>
            
            <div className={styles["team-grid"]}>
              {teamMembers.map((member, index) => (
                <div key={index} className={styles["team-member"]}>
                  <div className={styles["member-image"]}>
                    <div 
                      className={styles["placeholder-member-image"]} 
                      style={{backgroundImage: `url(${member.image})`}}
                    >
                    </div>
                  </div>
                  <div className={styles["member-info"]}>
                    <h3>{member.name}</h3>
                    <h4>{member.role}</h4>
                    <p>{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Values Section */}
          <section className={styles["values-section"]}>
            <h2>हमारे मूल्य</h2>
            <div className={styles["values-grid"]}>
              <div className={styles["value-item"]}>
                <h3>विश्वास</h3>
                <p>
                  हम यह सुनिश्चित करने के लिए सभी सेवा प्रदाताओं को सत्यापित करते हैं 
                  कि वे विश्वसनीय और भरोसेमंद हैं, जिससे आपको मानसिक शांति मिले।
                </p>
              </div>
              <div className={styles["value-item"]}>
                <h3>गुणवत्ता</h3>
                <p>
                  हम निरंतर निगरानी और प्रतिक्रिया के माध्यम से अपनी सभी सेवाओं में 
                  उच्च मानकों को बनाए रखने के लिए प्रतिबद्ध हैं।
                </p>
              </div>
              <div className={styles["value-item"]}>
                <h3>पहुंच</h3>
                <p>
                  हमारा प्लेटफॉर्म आवश्यक सेवाओं को सभी के लिए सुलभ बनाने के लिए 
                  डिज़ाइन किया गया है, जब भी और जहां भी उन्हें इसकी आवश्यकता हो।
                </p>
              </div>
              <div className={styles["value-item"]}>
                <h3>सहानुभूति</h3>
                <p>
                  हम दैनिक जीवन की चुनौतियों को समझते हैं और करुणा के साथ आपकी 
                  जरूरतों को वास्तव में संबोधित करने वाले समाधान बनाने का प्रयास करते हैं।
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default HindiAboutUs;
