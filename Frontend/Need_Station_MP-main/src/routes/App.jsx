import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css';
import '../styles/CommonSpacing.css';
import '../styles/LanguageStyles.css'; // Import language-specific styles

import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import ScrollToTop from "../hooks/ScrollToTop.jsx";
import { ToastContainer } from "react-toastify";
import translationService from "../services/TranslationService";
import NeedBot from "../components/NeedBot.jsx";
import { BookingModalProvider } from "../components/BookingModal/BookingModalProvider.jsx";

import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from '@cloudinary/react';
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

function App() {
  const location = useLocation();

  // Cloudinary image setup (optional visual, can be removed if unused)
  const cld = new Cloudinary({ cloud: { cloudName: 'dchmvabfy' } });
  const img = cld
    .image('') // Add your image public ID here
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(500).height(500));

  // Common helper to clean text of language tags before translation
  const cleanTextForTranslation = (text) => {
    // Remove language tag prefixes like [hi], [en], etc.
    return text.replace(/\[\w{2}\]\s*/g, '');
  };

  // Common helper to directly translate text via Google API
  const translateTextDirectly = async (text, targetLang) => {
    try {
      // Clean the text first to remove any language prefixes
      const cleanedText = cleanTextForTranslation(text);
      
      // Using Google Translate API directly
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
      // Return the original text without language tags as fallback
      return cleanTextForTranslation(text);
    }
  };

  // Apply direct translations to the entire page
  const applyGlobalTranslations = async () => {
    const storedLang = localStorage.getItem('needstation-language');
    if (!storedLang || storedLang === 'en') return;
    
    console.log('Applying global translations for:', storedLang);
    document.body.classList.add('translating');
    
    try {
      // First, find and protect all elements that shouldn't be translated
      const protectElements = () => {
        // Protect NeedStation logo and branding
        document.querySelectorAll('.logo, .needText, .stationText, [class*="logo"]').forEach(el => {
          el.setAttribute('data-no-translate', 'true');
        });
        
        // Protect elements with NeedStation text
        document.querySelectorAll('*').forEach(el => {
          if (el.textContent && (
              el.textContent.includes('NeedStation') ||
              el.textContent === 'Need' ||
              el.textContent === 'Station'
            )) {
            el.setAttribute('data-no-translate', 'true');
          }
        });
      };
      
      protectElements();
      
      // Function to collect text nodes (not just elements)
      const collectTextNodes = () => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              // Skip empty nodes
              if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
              
              // Skip nodes that are part of protected elements
              let parent = node.parentNode;
              while (parent) {
                if (parent.getAttribute && parent.getAttribute('data-no-translate') === 'true') {
                  return NodeFilter.FILTER_REJECT;
                }
                parent = parent.parentNode;
              }
              
              // Skip if already translated
              if (node.parentNode?.getAttribute('data-translated') === 'true') {
                return NodeFilter.FILTER_REJECT;
              }
              
              // Skip script and style tags
              const parentTagName = node.parentNode?.tagName?.toLowerCase();
              if (parentTagName === 'script' || parentTagName === 'style') {
                return NodeFilter.FILTER_REJECT;
              }
              
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );
        
        const nodes = [];
        const texts = [];
        let node;
        
        while (node = walker.nextNode()) {
          const text = node.nodeValue.trim();
          // Skip very short texts and special characters
          if (text.length < 2) continue;
          nodes.push(node);
          texts.push(text);
        }
        
        return { nodes, texts };
      };
      
      // Collect all text nodes
      const { nodes, texts } = collectTextNodes();
      console.log(`Found ${texts.length} text nodes to translate`);
      
      // Translate in batches
      const batchSize = 15;
      for (let i = 0; i < texts.length; i += batchSize) {
        const batchTexts = texts.slice(i, i + batchSize);
        const batchNodes = nodes.slice(i, i + batchSize);
        
        try {
          // Call Google Translate API
          const translations = await Promise.all(
            batchTexts.map(text => translateTextDirectly(text, storedLang))
          );
          
          // Apply translations to nodes
          for (let j = 0; j < translations.length; j++) {
            const node = batchNodes[j];
            const originalText = batchTexts[j];
            const translation = translations[j];
            
            if (node && translation) {
              // Store original text on the parent element for future reference
              if (node.parentNode) {
                node.parentNode.setAttribute('data-original', originalText);
                node.parentNode.setAttribute('data-translated', 'true');
              }
              
              // Replace the text
              node.nodeValue = node.nodeValue.replace(originalText, translation);
            }
          }
        } catch (error) {
          console.error('Batch translation failed:', error);
          // Continue with next batch anyway
        }
        
        // Add a small delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Set up observer for future content
      setupDynamicContentObserver(storedLang);
      
    } catch (error) {
      console.error('Global translation error:', error);
    } finally {
      document.body.classList.remove('translating');
    }
  };
  
  // Observer for dynamically added content
  let contentObserver = null;
  const setupDynamicContentObserver = (targetLang) => {
    if (contentObserver) {
      contentObserver.disconnect();
    }
    
    contentObserver = new MutationObserver((mutations) => {
      const newNodes = [];
      const newTexts = [];
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            // Only process element nodes
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            if (node.getAttribute?.('data-translated') === 'true') return;
            if (node.getAttribute?.('data-no-translate') === 'true') return;
            
            // Get all text nodes within this element
            const walker = document.createTreeWalker(
              node,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );
            
            let textNode;
            while (textNode = walker.nextNode()) {
              const text = textNode.nodeValue?.trim();
              if (text && text.length > 1) {
                newNodes.push(textNode);
                newTexts.push(text);
              }
            }
          });
        }
      });
      
      // If we found new text nodes, translate them
      if (newNodes.length > 0) {
        console.log(`Translating ${newNodes.length} new text nodes`);
        Promise.all(newTexts.map(text => translateTextDirectly(text, targetLang)))
          .then(translations => {
            translations.forEach((translation, idx) => {
              const node = newNodes[idx];
              const originalText = newTexts[idx];
              
              if (node && translation) {
                // Store original text on the parent
                if (node.parentNode) {
                  node.parentNode.setAttribute('data-original', originalText);
                  node.parentNode.setAttribute('data-translated', 'true');
                }
                
                // Replace the text
                node.nodeValue = node.nodeValue.replace(originalText, translation);
              }
            });
          })
          .catch(err => console.error('Dynamic translation error:', err));
      }
    });
    
    // Start observing
    contentObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  // Initialize and load translation system on app mount
  useEffect(() => {
    const storedLang = localStorage.getItem('needstation-language') || 'en';
    
    // Set the HTML lang attribute for proper language styling
    document.documentElement.lang = storedLang;
    
    if (storedLang && storedLang !== 'en') {
      // Initialize translation service for backward compatibility
      translationService.currentLang = storedLang;
      
      // Add Google Fonts for the specific language
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      
      // Map of language codes to appropriate Google Font families
      const langFonts = {
        'hi': 'Noto+Sans+Devanagari:400,500,700',
        'ta': 'Noto+Sans+Tamil:400,500,700',
        'bn': 'Noto+Sans+Bengali:400,500,700',
        'ml': 'Noto+Sans+Malayalam:400,500,700',
        'te': 'Noto+Sans+Telugu:400,500,700',
        'kn': 'Noto+Sans+Kannada:400,500,700',
        'gu': 'Noto+Sans+Gujarati:400,500,700'
      };
      
      if (langFonts[storedLang]) {
        fontLink.href = `https://fonts.googleapis.com/css2?family=${langFonts[storedLang]}&display=swap`;
        document.head.appendChild(fontLink);
      }
    } else {
      // Default to English
      document.documentElement.lang = 'en';
    }
  }, []);

  // Apply translations on route changes for consistent experience across all pages
  useEffect(() => {
    // Apply translations whenever route changes
    const delay = setTimeout(() => {
      applyGlobalTranslations();
    }, 800); // Allow time for page to render 
    
    return () => clearTimeout(delay);
  }, [location.pathname]);

  return (
    <BookingModalProvider>
      <ScrollToTop />
      <Header />
      <div className="container my-4">
        <AdvancedImage cldImg={img} />
      </div>
      <Outlet />
      <Footer />
      <NeedBot />
      <ToastContainer />
    </BookingModalProvider>
  );
}

export default App;
