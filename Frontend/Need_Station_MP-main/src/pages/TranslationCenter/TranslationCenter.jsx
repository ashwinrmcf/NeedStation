import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./TranslationCenter.module.css";
import translationService from "../../services/TranslationService";

// We'll use image backgrounds for better visual appeal and language representation

export default function TranslationCenter() {
  const location = useLocation();
  const isHindiRoute = location.pathname.startsWith('/hi');
  
  // Initialize with translation service language preference
  const [targetLang, setTargetLang] = useState(() => {
    return translationService.getCurrentLanguage();
  });
  const [translating, setTranslating] = useState(false);

  // Languages available for translation
  const languagesEn = [
    { code: "en", name: "English", flag: "🇺🇸", description: "United States", bgClass: "englishBg" },
    { code: "hi", name: "Hindi", flag: "🇮🇳", description: "India", bgClass: "hindiBg" },
    { code: "ta", name: "Tamil", flag: "🇮🇳", description: "India", bgClass: "tamilBg" },
    { code: "bn", name: "Bengali", flag: "🇮🇳", description: "India", bgClass: "bengaliBg" },
    { code: "ml", name: "Malayalam", flag: "🇮🇳", description: "India", bgClass: "malayalamBg" },
    { code: "te", name: "Telugu", flag: "🇮🇳", description: "India", bgClass: "teluguBg" },
    { code: "kn", name: "Kannada", flag: "🇮🇳", description: "India", bgClass: "kannadaBg" },
    { code: "gu", name: "Gujarati", flag: "🇮🇳", description: "India", bgClass: "gujaratiBg" },
  ];

  const languagesHi = [
    { code: "en", name: "अंग्रेजी", flag: "🇺🇸", description: "संयुक्त राज्य अमेरिका", bgClass: "englishBg" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳", description: "भारत", bgClass: "hindiBg" },
    { code: "ta", name: "तमिल", flag: "🇮🇳", description: "भारत", bgClass: "tamilBg" },
    { code: "bn", name: "बंगाली", flag: "🇮🇳", description: "भारत", bgClass: "bengaliBg" },
    { code: "ml", name: "मलयालम", flag: "🇮🇳", description: "भारत", bgClass: "malayalamBg" },
    { code: "te", name: "तेलुगु", flag: "🇮🇳", description: "भारत", bgClass: "teluguBg" },
    { code: "kn", name: "कन्नड़", flag: "🇮🇳", description: "भारत", bgClass: "kannadaBg" },
    { code: "gu", name: "गुजराती", flag: "🇮🇳", description: "भारत", bgClass: "gujaratiBg" },
  ];

  const languages = isHindiRoute ? languagesHi : languagesEn;

  // Content translations
  const content = {
    en: {
      title: "Language Settings",
      subtitle: "Select your preferred language to translate our entire website.",
      translating: "Translating content to",
      waitMessage: "This may take a moment. Please wait...",
      selected: "Selected",
      select: "Select",
      whyTranslateTitle: "Why Translate?",
      whyTranslateText: "We believe in making our services accessible to everyone. Our translation feature allows you to view our entire website in your preferred language, making it easier to navigate and understand our offerings.",
      noteTitle: "Please Note",
      noteText: "Our translation service uses Google Translate API. While we strive for accuracy, some translations may not be perfect."
    },
    hi: {
      title: "भाषा सेटिंग्स",
      subtitle: "हमारी पूरी वेबसाइट का अनुवाद करने के लिए अपनी पसंदीदा भाषा चुनें।",
      translating: "सामग्री का अनुवाद किया जा रहा है",
      waitMessage: "इसमें कुछ समय लग सकता है। कृपया प्रतीक्षा करें...",
      selected: "चयनित",
      select: "चुनें",
      whyTranslateTitle: "अनुवाद क्यों करें?",
      whyTranslateText: "हम अपनी सेवाओं को सभी के लिए सुलभ बनाने में विश्वास करते हैं। हमारी अनुवाद सुविधा आपको अपनी पसंदीदा भाषा में हमारी पूरी वेबसाइट देखने की अनुमति देती है, जिससे हमारी पेशकशों को नेविगेट करना और समझना आसान हो जाता है।",
      noteTitle: "कृपया ध्यान दें",
      noteText: "हमारी अनुवाद सेवा Google Translate API का उपयोग करती है। जबकि हम सटीकता के लिए प्रयास करते हैं, कुछ अनुवाद पूर्ण नहीं हो सकते हैं।"
    }
  };

  const currentContent = isHindiRoute ? content.hi : content.en;

  // Use translation service on component mount
  useEffect(() => {
    // Highlight the currently selected language
    setTargetLang(translationService.getCurrentLanguage());
  }, []);

  // Function to clean language prefixes from text before translation
  const cleanLanguagePrefixes = (text) => {
    if (!text) return '';
    // Remove language tag prefixes like [hi], [en], etc.
    return text.replace(/\[\w{2}\]\s*/g, '');
  };

  // Use Google Translate API directly for translations
  const translateTextDirectly = async (text, targetLang) => {
    try {
      // Clean the text first to remove any language prefixes
      const cleanedText = cleanLanguagePrefixes(text);
      
      // Using Google Translate API with your existing API key from the backend
      const API_KEY = "AIzaSyDaEJ4vo3cRDG90bsEVw2C98QNQlP5Ai6o";
      const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: cleanedText,
          target: targetLang,
        }),
      });
      
      const data = await response.json();
      if (data.data && data.data.translations && data.data.translations[0]) {
        return data.data.translations[0].translatedText;
      } else {
        throw new Error('Invalid translation response');
      }
    } catch (error) {
      console.error('Translation API error:', error);
      // Fallback to original text without language prefixes
      return cleanLanguagePrefixes(text);
    }
  };
  
  const handleTranslate = async (langCode) => {
    console.log('Language card clicked:', langCode);
    setTranslating(true);
    setTargetLang(langCode);
    
    try {
      // Store language preference in localStorage
      localStorage.setItem('needstation-language', langCode);
      sessionStorage.setItem('needstation-auto-translate', 'true');
      
      // Set the HTML lang attribute for proper language styling
      document.documentElement.lang = langCode;
      
      // For Hindi, use the dedicated Hindi frontend (more reliable)
      if (langCode === 'hi') {
        // Redirect to Hindi version of the site
        window.location.href = '/hi';
        return;
      }
      
      // For other languages, continue with dynamic translation
      const langFonts = {
        'hi': 'Noto+Sans+Devanagari:400,500,700',
        'ta': 'Noto+Sans+Tamil:400,500,700',
        'bn': 'Noto+Sans+Bengali:400,500,700',
        'ml': 'Noto+Sans+Malayalam:400,500,700',
        'te': 'Noto+Sans+Telugu:400,500,700',
        'kn': 'Noto+Sans+Kannada:400,500,700',
        'gu': 'Noto+Sans+Gujarati:400,500,700'
      };
      
      // Remove any existing language font links
      document.querySelectorAll('link[data-lang-font]').forEach(link => link.remove());
      
      // Add the appropriate font for this language
      if (langFonts[langCode]) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = `https://fonts.googleapis.com/css2?family=${langFonts[langCode]}&display=swap`;
        fontLink.setAttribute('data-lang-font', langCode);
        document.head.appendChild(fontLink);
      }
      
      if (langCode === 'en') {
        // For English, refresh the page to reset translations
        window.location.href = '/';
        return;
      }
      
      // First, remove any existing translations
      const allTranslatedElements = document.querySelectorAll('[data-translated="true"]');
      allTranslatedElements.forEach(el => {
        if (el.getAttribute('data-original')) {
          el.textContent = el.getAttribute('data-original');
          el.removeAttribute('data-translated');
        }
      });
      
      // Collect all text elements that need translation
      const elementsToTranslate = [];
      const textsToTranslate = [];
      
      document.querySelectorAll('p, h1, h2, h3, h4, h5, a, button, span').forEach(el => {
        if (el.textContent && el.textContent.trim() && 
            !el.getAttribute('data-translated') && 
            !el.getAttribute('data-no-translate')) {
          // Skip elements with language tags or special content
          if (el.textContent.includes('NeedStation') || 
              el.textContent === 'Need' || 
              el.textContent === 'Station') {
            return;
          }
          
          // Store original text and add to translation queue
          const originalText = el.textContent.trim();
          el.setAttribute('data-original', originalText);
          el.setAttribute('data-translated', 'true');
          
          elementsToTranslate.push(el);
          textsToTranslate.push(originalText);
        }
      });
      
      // Translate in batches to avoid API limits
      const batchSize = 10;
      for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
        const batch = textsToTranslate.slice(i, i + batchSize);
        const batchTranslations = await Promise.all(
          batch.map(text => translateTextDirectly(text, langCode))
        );
        
        // Apply translations to elements
        for (let j = 0; j < batchTranslations.length; j++) {
          const element = elementsToTranslate[i + j];
          const translation = batchTranslations[j];
          element.textContent = translation;
        }
      }
      
      // Apply to the current page
      console.log(`Applied real translations for ${langCode}`);
      
    } catch (error) {
      console.error("Translation failed:", error);
      // Notify user of error but keep the app running
      console.log("Translation service unavailable, please try again later");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className={`container page-content-spacing ${styles.translationContainer}`}>
      <div className={styles.translationHeader}>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{isHindiRoute ? 'भाषा' : 'Language'} <span className="text-teal-400">{isHindiRoute ? 'सेटिंग्स' : 'Settings'}</span></h1>
        <p className="text-lg mb-5" style={{ color: 'var(--text-secondary)' }}>{currentContent.subtitle}</p>
        <div className={styles.headerAccent}></div>
      </div>

      {translating && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>{currentContent.translating} {languages.find(l => l.code === targetLang)?.name}...</p>
          <p className={styles.smallNote}>{currentContent.waitMessage}</p>
        </div>
      )}

      <div className={styles.languageSection}>
        <div className={styles.gridContainer}>
          <div className={styles.languageGrid}>
            {languages.map((lang) => (
            <div 
              key={lang.code} 
              className={`${styles.languageCard} ${styles[lang.bgClass]} ${targetLang === lang.code ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Card clicked for', lang.code);
                handleTranslate(lang.code);
              }}
              style={{ 
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {targetLang === lang.code && (
                <div className={styles.statusBadge}>{currentContent.selected}</div>
              )}
              {/* No overlay - using clear cards with high visibility */}
              
              <div className={styles.cardContent}>
                <div className={styles.flag}>{lang.flag}</div>
                <h3>{lang.name}</h3>
                <p className={styles.countryName}>{lang.description}</p>
                <p className={styles.code}>{lang.code.toUpperCase()}</p>
              </div>
              
              <button 
                className={styles.selectButton} 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Select button clicked for', lang.code);
                  handleTranslate(lang.code);
                }}
              >
                {targetLang === lang.code ? currentContent.selected : currentContent.select}
              </button>
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoHeader}>
          <h2 className="font-bold">{isHindiRoute ? 'अनुवाद' : 'Why'} <span className="text-teal-400">{isHindiRoute ? 'क्यों करें?' : 'Translate?'}</span></h2>
        </div>
        <p className={styles.infoParagraph}>{currentContent.whyTranslateText}</p>
        
        <div className={styles.note}>
          <div className={styles.noteIcon}>ℹ️</div>
          <div>
            <h3 className="font-bold text-lg">{currentContent.noteTitle}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{currentContent.noteText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
