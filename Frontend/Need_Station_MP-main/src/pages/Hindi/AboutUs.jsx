import styles from "../AboutUs/AboutUs.module.css";
import ScrollToTop from "../../hooks/ScrollToTop.jsx";
import ashwin from "../../assets/images/AboutUs/ashwin.jpg";
import ajitesh from "../../assets/images/AboutUs/ajitesh.jpg";
import abhishek from "../../assets/images/AboutUs/abhishek.jpg";
import zainab from "../../assets/images/AboutUs/zainab.jpg";
import yash from "../../assets/images/AboutUs/yash.png";
import navneet from "../../assets/images/AboutUs/navneet.jpeg";
import bairagi from "../../assets/images/AboutUs/bairagi.jpeg";
import logo from "../../assets/images/AboutUs/logo.jpeg";

const HindiAboutUs = () => {
  const teamMembers = [
    {
      name: "अश्विन सोनी",
      role: "वित्तीय संचालन",
      image: ashwin,
      description: "स्थायी विकास और संसाधन अनुकूलन सुनिश्चित करने के लिए वित्तीय योजना, बजट और परिचालन दक्षता की देखरेख करते हैं।",
    },
    {
      name: "ज़ैनब अंसारी",
      role: "ग्राहक अनुभव",
      image: zainab,
      description: "ग्राहक सहभागिता की रणनीतिक दिशा का नेतृत्व करती हैं, यह सुनिश्चित करती हैं कि हर बातचीत गुणवत्ता, देखभाल और विश्वास को दर्शाती है।",
    },
    {
      name: "अभिषेक गुप्ता",
      role: "प्रौद्योगिकी अवसंरचना",
      image: abhishek,
      description: "तकनीकी अवसंरचना और प्लेटफॉर्म विकास का प्रबंधन करते हैं, सुरक्षा, स्केलेबिलिटी और निर्बाध उपयोगकर्ता अनुभव सुनिश्चित करते हैं।",
    },
    {
      name: "अजितेश त्रिपाठी",
      role: "संचालन प्रबंधक",
      image: ajitesh,
      description: "निरंतर सेवा उत्कृष्टता बनाए रखने के लिए सेवा प्रदाताओं की भर्ती, प्रशिक्षण और प्रदर्शन की देखरेख करते हैं।",
    },
    {
      name: "नवनीत चौहान",
      role: "रणनीतिक साझेदारी",
      image: navneet,
      description: "सेवा प्रदाताओं के साथ मजबूत सहयोग बनाते और बनाए रखते हैं, विश्वसनीय और उच्च गुणवत्ता वाली सेवा प्रदान करना सुनिश्चित करते हैं।",
    },
    {
      name: "अमन बैरागी",
      role: "व्यापार विकास",
      image: bairagi,
      description: "ऐसी रणनीतियों को लागू करके व्यापारिक विकास को बढ़ावा देते हैं जो हमारी पहुंच का विस्तार करती हैं और हमारी सेवाओं के प्रभाव को उजागर करती हैं।",
    },
    {
      name: "यश शर्मा",
      role: "उत्पाद विकास",
      image: yash,
      description: "NeedStation की सेवाओं और डिजिटल प्लेटफॉर्म को डिजाइन, परिष्कृत और बेहतर बनाकर नवाचार को बढ़ावा देते हैं, उपयोगकर्ता की जरूरतों और बाजार के रुझानों के साथ तालमेल सुनिश्चित करते हैं।",
    },
  ];

  // Service categories in Hindi
  const serviceCategories = [
    {
      title: "बुजुर्गों की देखभाल",
      icon: "",
      services: [
        "देखभालकर्ता",
        "पैरालिसिस केयरगिवर",
        "प्रसवोत्तर देखभालकर्ता",
        "नर्स",
        "स्वास्थ्य जांच सेवाएं",
        "बेबी सिटर",
      ],
    },
    {
      title: "बुनियादी जरूरतें",
      icon: "",
      services: ["इलेक्ट्रीशियन", "प्लंबर", "पानी की आपूर्ति"],
    },
    {
      title: "घरेलू सेवाएं",
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
                <h3>हमारा दृष्टिकोण</h3>
                <p>
                  एक ऐसा प्लेटफॉर्म बनाना जो घरों को विश्वसनीय और सत्यापित 
                  सेवा प्रदाताओं से जोड़े, जिससे सभी के लिए दैनिक जीवन अधिक 
                  सुविधाजनक और प्रबंधनीय हो जाए।
                </p>
                
                <h3>हमारा मिशन</h3>
                <p>
                  हमारा लक्ष्य सेवा चाहने वालों और प्रदाताओं के बीच की खाई को 
                  पाटना है, एक सुरक्षित, विश्वसनीय और उपयोगकर्ता-अनुकूल प्लेटफॉर्म 
                  प्रदान करके जो आवश्यक घरेलू जरूरतों और बुजुर्गों की देखभाल 
                  सेवाओं को संबोधित करता है।
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
              NeedStation में, हम आपकी रोजमर्रा की जरूरतों को पूरा करने और 
              आपके प्रियजनों के लिए विशेष देखभाल प्रदान करने के लिए डिज़ाइन 
              की गई सेवाओं की एक व्यापक श्रृंखला प्रदान करते हैं।
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
              हमारी समर्पित पेशेवरों की टीम यह सुनिश्चित करने के लिए अथक 
              परिश्रम करती है कि NeedStation आपकी घरेलू जरूरतों को पूरा करने 
              के लिए उच्चतम गुणवत्ता की सेवाएं प्रदान करे।
            </p>
            
            <div className={styles["team-grid"]}>
              {teamMembers.map((member, index) => (
                <div key={index} className={styles["team-member"]}>
                  <div className={styles["member-image"]}>
                    <div 
                      className={styles["placeholder-member-image"]} 
                      style={{backgroundImage: `url(${member.image})`}}
                    >
                      {/* <span>{member.name.charAt(0)}</span> */}
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
                  हम सभी सेवा प्रदाताओं को सत्यापित करते हैं ताकि यह सुनिश्चित 
                  हो सके कि वे विश्वसनीय और भरोसेमंद हैं, जिससे आपको मानसिक 
                  शांति मिले।
                </p>
              </div>
              <div className={styles["value-item"]}>
                <h3>गुणवत्ता</h3>
                <p>
                  हम निरंतर निगरानी और फीडबैक के माध्यम से अपनी सभी सेवाओं 
                  में उच्च मानकों को बनाए रखने के लिए प्रतिबद्ध हैं।
                </p>
              </div>
              <div className={styles["value-item"]}>
                <h3>पहुंच</h3>
                <p>
                  हमारा प्लेटफॉर्म आवश्यक सेवाओं को सभी के लिए सुलभ बनाने के 
                  लिए डिज़ाइन किया गया है, जब भी और जहां भी उन्हें इसकी 
                  आवश्यकता हो।
                </p>
              </div>
              <div className={styles["value-item"]}>
                <h3>सहानुभूति</h3>
                <p>
                  हम दैनिक जीवन की चुनौतियों को समझते हैं और ऐसे समाधान बनाने 
                  का प्रयास करते हैं जो वास्तव में आपकी जरूरतों को करुणा के 
                  साथ संबोधित करते हैं।
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
