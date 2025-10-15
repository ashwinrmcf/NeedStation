import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiMessageCircle, FiArrowRight, FiGlobe } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import smartTranslationService from '../services/SmartTranslationService';
import NeedBotAI from '../services/NeedBotAI';
import './NeedBot.css';

const NeedBot = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('needstation-language') || 'en'
  );
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: currentLanguage === 'hi' 
        ? "नमस्ते! मैं नीडबॉट हूं, आपका स्मार्ट सहायक।"
        : "Hello! I'm NeedBot, your smart assistant.", 
      sender: 'bot' 
    }
  ]);


  // Initialize messages based on current language
  useEffect(() => {
    const lang = localStorage.getItem('needstation-language') || 'en';
    setCurrentLanguage(lang);
    setMessages([{
      text: lang === 'hi' 
        ? "नमस्ते! मैं नीडबॉट हूं, आपका स्मार्ट सहायक।"
        : "Hello! I'm NeedBot, your smart assistant.",
      sender: 'bot'
    }]);
  }, []);

  // Rule-based navigation patterns (English and Hindi)
  const navigationPatterns = {
    // Home and main pages
    home: { 
      keywords: ['home', 'main', 'start', 'beginning', 'होम', 'घर', 'मुख्य', 'शुरुआत'], 
      route: '/', 
      description: 'home page',
      hindiDescription: 'होम पेज'
    },
    
    // Services
    electrician: { 
      keywords: ['electrician', 'electrical', 'wiring', 'electricity', 'power', 'इलेक्ट्रीशियन', 'बिजली', 'तार'], 
      route: '/electrician', 
      description: 'electrician services',
      hindiDescription: 'इलेक्ट्रीशियन सेवाएं'
    },
    plumber: { 
      keywords: ['plumber', 'plumbing', 'water', 'pipe', 'leak', 'tap', 'faucet', 'प्लंबर', 'पानी', 'पाइप', 'नल'], 
      route: '/plumber', 
      description: 'plumbing services',
      hindiDescription: 'प्लंबर सेवाएं'
    },
    maid: { 
      keywords: ['maid', 'cleaning', 'housekeeping', 'clean', 'सफाई', 'मेड', 'घर की सफाई'], 
      route: '/maid-services', 
      description: 'maid services',
      hindiDescription: 'सफाई सेवाएं'
    },
    babysitter: { 
      keywords: ['babysitter', 'baby', 'child', 'kids', 'nanny', 'बेबीसिटर', 'बच्चा', 'बच्चे', 'आया'], 
      route: '/babysitter', 
      description: 'babysitting services',
      hindiDescription: 'बेबीसिटिंग सेवाएं'
    },
    caretaker: { 
      keywords: ['caretaker', 'care', 'elderly', 'senior', 'देखभाल', 'बुजुर्ग', 'वृद्ध'], 
      route: '/caretaker', 
      description: 'caretaker services',
      hindiDescription: 'देखभाल सेवाएं'
    },
    nurse: { 
      keywords: ['nurse', 'medical', 'health', 'healthcare', 'नर्स', 'चिकित्सा', 'स्वास्थ्य'], 
      route: '/nurse', 
      description: 'nursing services',
      hindiDescription: 'नर्सिंग सेवाएं'
    },
    
    // Other pages
    login: { 
      keywords: ['login', 'sign in', 'log in', 'लॉगिन', 'साइन इन'], 
      route: '/login', 
      description: 'login page',
      hindiDescription: 'लॉगिन पेज'
    },
    signup: { 
      keywords: ['signup', 'register', 'sign up', 'create account', 'साइन अप', 'रजिस्टर', 'खाता बनाएं'], 
      route: '/signup', 
      description: 'registration page',
      hindiDescription: 'रजिस्ट्रेशन पेज'
    },
    contact: { 
      keywords: ['contact', 'support', 'help', 'reach', 'संपर्क', 'सहायता', 'मदद'], 
      route: '/contact-us', 
      description: 'contact us page',
      hindiDescription: 'संपर्क पेज'
    },
    about: { 
      keywords: ['about', 'info', 'information', 'के बारे में', 'जानकारी'], 
      route: '/about-us', 
      description: 'about us page',
      hindiDescription: 'हमारे बारे में पेज'
    },
    helper: { 
      keywords: ['become helper', 'work', 'job', 'earn', 'हेल्पर बनें', 'काम', 'नौकरी', 'कमाई'], 
      route: '/why-become-helper', 
      description: 'become a helper page',
      hindiDescription: 'हेल्पर बनने का पेज'
    },
    
    // Language settings
    language: { 
      keywords: ['language', 'translate', 'translation', 'hindi', 'tamil', 'bengali', 'भाषा', 'अनुवाद'], 
      route: '/language-settings', 
      description: 'language settings',
      hindiDescription: 'भाषा सेटिंग्स'
    }
  };

  // Language mapping
  const languages = {
    'english': 'en',
    'hindi': 'hi', 
    'tamil': 'ta',
    'bengali': 'bn',
    'malayalam': 'ml',
    'telugu': 'te',
    'kannada': 'kn',
    'gujarati': 'gu'
  };

  // Predefined responses for common queries
  const responses = {
    greeting: [
      "Hello! I'm here to help you navigate NeedStation.",
      "Hi there! What can I help you find today?",
      "Welcome to NeedStation! How can I assist you?"
    ],
    services: "NeedStation offers various services including electrician, plumber, maid services, babysitting, caretaking, and nursing. Which service are you looking for?",
    help: "I can help you with:\n• Navigate to different pages\n• Change language settings\n• Find services\n• Get information about NeedStation\n\nJust tell me what you need!",
    default: "I understand you're looking for something. Could you be more specific? You can ask me to:\n• Take you to a specific page\n• Change the language\n• Find a service\n• Get help with navigation"
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Language change function
  const changeLanguage = async (langCode) => {
    try {
      localStorage.setItem('needstation-language', langCode);
      document.documentElement.lang = langCode;
      setCurrentLanguage(langCode);
      
      if (langCode === 'hi') {
        setMessages(prev => [...prev, { 
          text: "Switching to Hindi version...", 
          sender: 'bot'
        }]);
        setTimeout(() => {
          window.location.href = '/hi';
        }, 1500);
      } else if (langCode === 'en') {
        setMessages(prev => [...prev, { 
          text: "Switching to English...", 
          sender: 'bot'
        }]);
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessages(prev => [...prev, { 
          text: `Switching to ${getLanguageName(langCode)}. The page will refresh...`, 
          sender: 'bot'
        }]);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Language change error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't change the language. Please try again.", 
        sender: 'bot'
      }]);
    }
  };

  const getLanguageName = (code) => {
    const languageNames = {
      'en': 'English',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'bn': 'Bengali',
      'ml': 'Malayalam',
      'te': 'Telugu',
      'kn': 'Kannada',
      'gu': 'Gujarati'
    };
    return languageNames[code] || code;
  };

  // Detect if input is in Hindi
  const isHindiInput = (text) => {
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text);
  };

  // Main processing function
  const processUserInput = (userInput) => {
    const input = userInput.toLowerCase().trim();
    const isHindi = isHindiInput(userInput);
    
    // Check for greetings (English and Hindi)
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|नमस्ते|नमस्कार|हैलो|हाय)/.test(input)) {
      return {
        type: 'response',
        message: isHindi 
          ? "नमस्ते! मैं नीडबॉट हूं, आपका स्मार्ट सहायक। मैं आपकी कैसे मदद कर सकता हूं?"
          : currentLanguage === 'hi'
            ? "नमस्ते! मैं नीडबॉट हूं, आपका स्मार्ट सहायक। मैं आपकी कैसे मदद कर सकता हूं?"
            : responses.greeting[Math.floor(Math.random() * responses.greeting.length)]
      };
    }

    // Check for help requests (English and Hindi)
    if (/help|what can you do|commands|options|मदद|सहायता|क्या कर सकते हो|कैसे मदद/.test(input)) {
      return {
        type: 'response',
        message: isHindi 
          ? "मैं आपको नेविगेट करने, सेवाएं खोजने और भाषा बदलने में मदद कर सकता हूं। आपको क्या चाहिए?"
          : currentLanguage === 'hi'
            ? "मैं आपको नेविगेट करने, सेवाएं खोजने और भाषा बदलने में मदद कर सकता हूं। आपको क्या चाहिए?"
            : "I can help you navigate, find services, and change languages. What do you need?"
      };
    }

    // Check for language change requests - enhanced to handle "translate to" patterns and Hindi
    const languageMatch = input.match(/change language to (\w+)|switch to (\w+)|translate to (\w+)|(\w+) language|हिंदी में बदलें|अंग्रेजी में बदलें|भाषा बदलें/);
    if (languageMatch) {
      const requestedLang = (languageMatch[1] || languageMatch[2] || languageMatch[3] || languageMatch[4]).toLowerCase();
      const langCode = languages[requestedLang];
      
      if (langCode) {
        const languageName = requestedLang.charAt(0).toUpperCase() + requestedLang.slice(1);
        return {
          type: 'language_change_with_button',
          langCode: langCode,
          languageName: languageName,
          message: isHindi 
            ? `जी हां! मैं पूरी वेबसाइट को ${languageName === 'Hindi' ? 'हिंदी' : languageName} में बदल सकता हूं।`
            : currentLanguage === 'hi'
              ? `जी हां! मैं पूरी वेबसाइट को ${languageName === 'Hindi' ? 'हिंदी' : languageName} में बदल सकता हूं।`
              : `Sure! I can switch the entire website to ${languageName} for you.`,
          buttonText: isHindi 
            ? `${languageName === 'Hindi' ? 'हिंदी' : languageName} में बदलें`
            : currentLanguage === 'hi'
              ? `${languageName === 'Hindi' ? 'हिंदी' : languageName} में बदलें`
              : `Switch to ${languageName}`
        };
      }
    }
    
    // Handle Hindi-specific language change requests
    if (/हिंदी में|अंग्रेजी में|भाषा बदल/.test(input)) {
      if (input.includes('हिंदी')) {
        return {
          type: 'language_change_with_button',
          langCode: 'hi',
          languageName: 'Hindi',
          message: "जी हां! मैं पूरी वेबसाइट को हिंदी में बदल सकता हूं।",
          buttonText: "हिंदी में बदलें"
        };
      } else if (input.includes('अंग्रेजी')) {
        return {
          type: 'language_change_with_button',
          langCode: 'en',
          languageName: 'English',
          message: "जी हां! मैं पूरी वेबसाइट को अंग्रेजी में बदल सकता हूं।",
          buttonText: "अंग्रेजी में बदलें"
        };
      }
    }

    // Check for navigation requests
    for (const [key, pattern] of Object.entries(navigationPatterns)) {
      const matchFound = pattern.keywords.some(keyword => {
        return input.includes(keyword) || 
               input.includes(`go to ${keyword}`) ||
               input.includes(`take me to ${keyword}`) ||
               input.includes(`show me ${keyword}`) ||
               input.includes(`find ${keyword}`) ||
               input.includes(`i need ${keyword}`) ||
               input.includes(`looking for ${keyword}`);
      });

      if (matchFound) {
        return {
          type: 'navigation',
          route: pattern.route,
          message: isHindi 
            ? `मैं आपको ${pattern.hindiDescription} पर ले जाऊंगा!`
            : currentLanguage === 'hi'
              ? `मैं आपको ${pattern.hindiDescription} पर ले जाऊंगा!`
              : `I'll take you to the ${pattern.description}!`,
          buttonText: isHindi 
            ? `${pattern.hindiDescription} पर जाएं`
            : currentLanguage === 'hi'
              ? `${pattern.hindiDescription} पर जाएं`
              : `Go to ${pattern.description}`
        };
      }
    }

    // Check for general service inquiry (English and Hindi)
    if (/service|services|what do you offer|available|सेवा|सेवाएं|क्या सेवाएं हैं|उपलब्ध/.test(input)) {
      return {
        type: 'response',
        message: isHindi 
          ? "नीडस्टेशन इलेक्ट्रीशियन, प्लंबर, सफाई, बेबीसिटिंग, देखभाल और नर्सिंग सेवाएं प्रदान करता है। कौन सी सेवा में आपकी रुचि है?"
          : currentLanguage === 'hi'
            ? "नीडस्टेशन इलेक्ट्रीशियन, प्लंबर, सफाई, बेबीसिटिंग, देखभाल और नर्सिंग सेवाएं प्रदान करता है। कौन सी सेवा में आपकी रुचि है?"
            : "NeedStation offers electrician, plumber, maid, babysitting, caretaking, and nursing services. Which service interests you?"
      };
    }

    // Check for specific questions about NeedStation (English and Hindi)
    if (/what is needstation|about needstation|tell me about|नीडस्टेशन क्या है|नीडस्टेशन के बारे में|बताइए/.test(input)) {
      return {
        type: 'navigation',
        route: '/about-us',
        message: isHindi 
          ? "नीडस्टेशन एक प्लेटफॉर्म है जो आपको विश्वसनीय सेवा प्रदाताओं से जोड़ता है। मैं आपको और जानकारी दिखाता हूं!"
          : currentLanguage === 'hi'
            ? "नीडस्टेशन एक प्लेटफॉर्म है जो आपको विश्वसनीय सेवा प्रदाताओं से जोड़ता है। मैं आपको और जानकारी दिखाता हूं!"
            : "NeedStation is a platform connecting you with reliable service providers. Let me show you more information!",
        buttonText: isHindi 
          ? "नीडस्टेशन के बारे में और जानें"
          : currentLanguage === 'hi'
            ? "नीडस्टेशन के बारे में और जानें"
            : "Learn more about NeedStation"
      };
    }

    // Default response with suggestions (English and Hindi)
    return {
      type: 'response',
      message: isHindi 
        ? "मुझे समझ नहीं आया कि आप क्या खोज रहे हैं। कृपया अधिक स्पष्ट रूप से बताएं। आप मुझसे पूछ सकते हैं:\n• किसी विशिष्ट पेज पर जाने के लिए\n• भाषा बदलने के लिए\n• कोई सेवा खोजने के लिए\n• नेवीगेशन में मदद के लिए"
        : currentLanguage === 'hi'
          ? "मुझे समझ नहीं आया कि आप क्या खोज रहे हैं। कृपया अधिक स्पष्ट रूप से बताएं। आप मुझसे पूछ सकते हैं:\n• किसी विशिष्ट पेज पर जाने के लिए\n• भाषा बदलने के लिए\n• कोई सेवा खोजने के लिए\n• नेवीगेशन में मदद के लिए"
          : responses.default
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // First try the old rule-based system for language changes and navigation
      const oldResult = processUserInput(input);
      
      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Handle language changes with old system (it works well)
      if (oldResult.type === 'language_change') {
        setMessages(prev => [...prev, { 
          text: oldResult.message, 
          sender: 'bot'
        }]);
        changeLanguage(oldResult.langCode);
        setIsLoading(false);
        return;
      } else if (oldResult.type === 'language_change_with_button') {
        setMessages(prev => [...prev, { 
          text: oldResult.message, 
          sender: 'bot',
          languageAction: {
            langCode: oldResult.langCode,
            buttonText: oldResult.buttonText,
            languageName: oldResult.languageName
          }
        }]);
        setIsLoading(false);
        return;
      }
      
      // Use AI service for intelligent responses
      const aiResponse = await NeedBotAI.processQuery(input, { language: currentLanguage });
      
      // Handle AI response
      if (aiResponse.type === 'navigation') {
        setMessages(prev => [...prev, { 
          text: aiResponse.message, 
          sender: 'bot',
          redirectUrl: aiResponse.route,
          redirectButtonText: aiResponse.buttonText,
          suggestions: aiResponse.suggestions
        }]);
      } else if (aiResponse.type === 'text') {
        const botMessage = { 
          text: aiResponse.message, 
          sender: 'bot'
        };
        
        // Add suggestions if available
        if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
          botMessage.suggestions = aiResponse.suggestions;
        }
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback to old system
        if (oldResult.type === 'navigation') {
          setMessages(prev => [...prev, { 
            text: oldResult.message, 
            sender: 'bot',
            redirectUrl: oldResult.route,
            redirectButtonText: oldResult.buttonText
          }]);
        } else {
          setMessages(prev => [...prev, { 
            text: oldResult.message, 
            sender: 'bot'
          }]);
        }
      }
    } catch (error) {
      console.error('NeedBot processing error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat button */}
      <button
        className={`chat-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
      >
        {isOpen ? <IoClose size={24} /> : <FiMessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>
              <span className="need-text">Need</span>
              <span className="station-text">Bot</span>
            </h3>
          </div>
          
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? <FiUser /> : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {typeof message.text === 'string' ? message.text : 'Loading...'}
                  </div>
                  
                  {/* Navigation button */}
                  {message.redirectUrl && message.redirectButtonText && (
                    <button 
                      className="redirect-button"
                      onClick={() => {
                        navigate(message.redirectUrl);
                        setIsOpen(false);
                      }}
                    >
                      {message.redirectButtonText} <FiArrowRight />
                    </button>
                  )}
                  
                  {/* Language change button */}
                  {message.languageAction && (
                    <button 
                      className="language-switch-button"
                      onClick={() => {
                        changeLanguage(message.languageAction.langCode);
                      }}
                    >
                      {message.languageAction.buttonText} <FiGlobe />
                    </button>
                  )}
                  
                  {/* Quick suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="suggestion-chips">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="suggestion-chip"
                          onClick={() => {
                            setInput(suggestion);
                            // Auto-submit the suggestion
                            const syntheticEvent = { preventDefault: () => {} };
                            setTimeout(() => {
                              const submitInput = suggestion;
                              setInput('');
                              setMessages(prev => [...prev, { text: submitInput, sender: 'user' }]);
                              setIsLoading(true);
                              
                              NeedBotAI.processQuery(submitInput, { language: currentLanguage })
                                .then(aiResponse => {
                                  if (aiResponse.type === 'navigation') {
                                    setMessages(prev => [...prev, { 
                                      text: aiResponse.message, 
                                      sender: 'bot',
                                      redirectUrl: aiResponse.route,
                                      redirectButtonText: aiResponse.buttonText,
                                      suggestions: aiResponse.suggestions
                                    }]);
                                  } else {
                                    const botMessage = { 
                                      text: aiResponse.message, 
                                      sender: 'bot',
                                      suggestions: aiResponse.suggestions
                                    };
                                    setMessages(prev => [...prev, botMessage]);
                                  }
                                })
                                .catch(error => {
                                  console.error('Suggestion error:', error);
                                  setMessages(prev => [...prev, { 
                                    text: "Sorry, I encountered an error.", 
                                    sender: 'bot' 
                                  }]);
                                })
                                .finally(() => {
                                  setIsLoading(false);
                                });
                            }, 100);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-text typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={currentLanguage === 'en' 
                ? "Type your message... (e.g., 'take me to electrician' or 'change language to hindi')"
                : currentLanguage === 'hi' 
                  ? "अपना संदेश टाइप करें... (जैसे 'मुझे इलेक्ट्रीशियन के पास ले जाएं' या 'भाषा हिंदी में बदलें')"
                  : "Type your message..."
              }
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NeedBot;
