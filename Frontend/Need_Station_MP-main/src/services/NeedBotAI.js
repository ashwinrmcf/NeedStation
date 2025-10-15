/**
 * NeedBot AI Service
 * Intelligent response system that processes user queries
 * and provides contextual, helpful answers
 */

import { NeedBotKnowledgeBase } from '../config/NeedBotKnowledgeBase';

export class NeedBotAI {
  constructor() {
    this.kb = NeedBotKnowledgeBase;
    this.conversationContext = [];
    this.userPreferences = {
      language: 'en',
      lastService: null,
      bookingHistory: []
    };
  }

  /**
   * Main processing function - analyzes user input and generates response
   */
  async processQuery(userInput, context = {}) {
    const query = userInput.toLowerCase().trim();
    
    // Update conversation context
    this.conversationContext.push({
      query: userInput,
      timestamp: new Date()
    });

    // Keep only last 5 interactions for context
    if (this.conversationContext.length > 5) {
      this.conversationContext.shift();
    }

    // Analyze query intent
    const intent = this.detectIntent(query);
    
    // Generate response based on intent
    const response = await this.generateResponse(intent, query, context);
    
    return response;
  }

  /**
   * Detect user intent from query
   */
  detectIntent(query) {
    const intents = {
      greeting: /^(hi|hello|hey|good morning|good afternoon|good evening|namaste|namaskar)/i,
      farewell: /^(bye|goodbye|see you|thanks|thank you|that's all|ok bye)/i,
      serviceInfo: /(what|tell me|show me|info|information|about|details).*(service|services|offer|provide)/i,
      specificService: /(electrician|plumber|maid|babysitter|caretaker|nurse|cleaning)/i,
      pricing: /(price|cost|charge|fee|how much|rate|expensive|cheap|afford)/i,
      booking: /(book|schedule|appointment|reserve|hire|need|want).*(service|electrician|plumber|maid)/i,
      howToBook: /(how to book|how do i book|booking process|how can i book)/i,
      payment: /(payment|pay|card|upi|cash|wallet|transaction|refund)/i,
      account: /(account|profile|register|signup|login|sign up|sign in|password|reset)/i,
      becomeHelper: /(become helper|work|job|earn|income|join as|work with you)/i,
      help: /(help|support|assist|problem|issue|complaint|contact|call|email)/i,
      location: /(area|city|location|available in|service in|cover)/i,
      safety: /(safe|trust|verify|verified|background check|reliable|secure)/i,
      navigation: /(go to|take me to|show me|navigate|open|page)/i,
      language: /(language|translate|hindi|tamil|bengali|change language)/i,
      offers: /(offer|discount|deal|promo|coupon|save money)/i,
      emergency: /(urgent|emergency|asap|immediately|right now|quick)/i,
      cancellation: /(cancel|cancellation|refund|reschedule|change booking)/i
    };

    for (const [intentName, pattern] of Object.entries(intents)) {
      if (pattern.test(query)) {
        return { type: intentName, confidence: 0.9, query: query };
      }
    }

    return { type: 'unknown', confidence: 0.3, query: query };
  }

  /**
   * Generate intelligent response based on intent
   */
  async generateResponse(intent, query, context) {
    switch (intent.type) {
      case 'greeting':
        return this.handleGreeting();
      case 'farewell':
        return this.handleFarewell();
      case 'serviceInfo':
        return this.handleServiceInfo(query);
      case 'specificService':
        return this.handleSpecificService(query);
      case 'pricing':
        return this.handlePricing(query);
      case 'booking':
      case 'howToBook':
        return this.handleBooking(query);
      case 'payment':
        return this.handlePayment(query);
      case 'account':
        return this.handleAccount(query);
      case 'becomeHelper':
        return this.handleBecomeHelper();
      case 'help':
        return this.handleHelp(query);
      case 'location':
        return this.handleLocation(query);
      case 'safety':
        return this.handleSafety();
      case 'offers':
        return this.handleOffers();
      case 'emergency':
        return this.handleEmergency(query);
      case 'cancellation':
        return this.handleCancellation();
      default:
        return this.handleUnknown(query);
    }
  }

  // Response Handlers
  handleGreeting() {
    const greetings = [
      "Hello! I'm NeedBot, your smart assistant. How can I help you today?",
      "Hi there! Welcome to NeedStation. What service do you need?",
      "Namaste! I'm here to help you find the perfect service!"
    ];
    
    return {
      type: 'text',
      message: greetings[Math.floor(Math.random() * greetings.length)],
      suggestions: ["Show services", "I need electrician", "How does it work?"]
    };
  }

  handleFarewell() {
    return {
      type: 'text',
      message: "Thank you for using NeedStation! Have a great day!",
      suggestions: []
    };
  }

  handleServiceInfo(query) {
    const services = Object.values(this.kb.services);
    const serviceList = services.map((s, idx) => `${idx + 1}. ${s.name} - ${s.description}`).join('\n\n');
    
    return {
      type: 'text',
      message: `NeedStation offers ${services.length} professional healthcare services:\n\n${serviceList}\n\nWhich service would you like to know more about?`,
      suggestions: ["Elderly Care", "Nursing Care", "Mother Baby Care", "Show all services"]
    };
  }

  handleSpecificService(query) {
    const service = Object.values(this.kb.services).find(s => 
      s.keywords.some(keyword => query.includes(keyword))
    );

    if (service) {
      const subcategories = service.subcategories.slice(0, 5).map(sub => `• ${sub}`).join('\n');
      const info = `${service.name}\n\n${service.description}\n\nServices Include:\n${subcategories}\n\nStarting Price: ${service.pricing.starting}\nDuration: ${service.duration}\nAvailability: ${service.availability}`;
      
      return {
        type: 'navigation',
        message: info,
        route: service.route,
        buttonText: `Book ${service.name}`,
        suggestions: ["See pricing details", "How to book?", "Show other services"]
      };
    }

    return this.handleServiceInfo(query);
  }

  handlePricing(query) {
    const service = Object.values(this.kb.services).find(s => 
      s.keywords.some(keyword => query.includes(keyword))
    );

    if (service) {
      const factors = service.pricing.factors.map(f => `• ${f}`).join('\n');
      return {
        type: 'text',
        message: `${service.name} Pricing\n\nStarting from: ${service.pricing.starting}\nAverage cost: ${service.pricing.average}\n\nPricing depends on:\n${factors}\n\nTransparent pricing with no hidden charges!`,
        suggestions: [`Book ${service.name}`, "Payment methods", "Show other services"]
      };
    }

    return {
      type: 'text',
      message: "We offer transparent pricing with no hidden charges for all our healthcare services. Which service pricing would you like to know about?",
      suggestions: ["Elderly Care", "Nursing Care", "Physiotherapy", "Show all services"]
    };
  }

  handleBooking(query) {
    return {
      type: 'text',
      message: "Booking is easy!\n\n1. Browse Services - Explore our healthcare services\n2. Select Date & Time - Choose convenient slot\n3. Get Service - Our professional arrives at your home\n4. Pay & Review - Secure payment and rate your experience\n\nWhich service would you like to book?",
      suggestions: ["Elderly Care", "Nursing Care", "Physiotherapy", "Show all services"]
    };
  }

  handlePayment(query) {
    const methods = this.kb.pricing.paymentMethods.map(m => `• ${m}`).join('\n');
    return {
      type: 'text',
      message: `Payment Information\n\nAccepted Methods:\n${methods}\n\nRefund Policy: ${this.kb.pricing.refundPolicy}\n\nCancellation: Free cancellation up to 2 hours before service`,
      suggestions: ["How to book?", "Show services", "Contact support"]
    };
  }

  handleAccount(query) {
    if (query.includes('register') || query.includes('signup')) {
      return {
        type: 'navigation',
        message: "I'll take you to registration!",
        route: '/signup',
        buttonText: "Sign Up Now"
      };
    }

    if (query.includes('login')) {
      return {
        type: 'navigation',
        message: "Let me take you to login!",
        route: '/login',
        buttonText: "Login"
      };
    }

    return {
      type: 'text',
      message: "Account Help: Free registration, easy login, password reset available",
      suggestions: ["Sign up", "Login"]
    };
  }

  handleBecomeHelper() {
    return {
      type: 'navigation',
      message: "Become a helper and earn! Flexible hours, steady income, no commission on first 10 bookings!",
      route: '/why-become-helper',
      buttonText: "Register as Helper",
      suggestions: ["How much can I earn?", "Registration process"]
    };
  }

  handleHelp(query) {
    return {
      type: 'text',
      message: `24/7 Support Available\n\nContact Us:\n• Email: support@needstation.com\n• Phone: 1800-XXX-XXXX\n• Response Time: Within 30 minutes\n\nHow can I assist you?`,
      suggestions: ["Contact support", "Common questions", "Book service"]
    };
  }

  handleLocation(query) {
    const cities = this.kb.serviceAreas.currentCities.join(', ');
    return {
      type: 'text',
      message: `Service Areas\n\nWe currently serve:\n${cities}\n\nExpanding to 50+ cities by 2026!\n\nIs your city listed?`,
      suggestions: ["Show services", "Book now", "Contact support"]
    };
  }

  handleSafety() {
    const verification = this.kb.safety.verification.map(v => `• ${v}`).join('\n');
    return {
      type: 'text',
      message: `Safety & Trust\n\nAll our caregivers undergo:\n${verification}\n\n• ${this.kb.safety.insurance}\n• ${this.kb.safety.support}\n• ${this.kb.safety.ratings}`,
      suggestions: ["How to book?", "Show services", "Contact support"]
    };
  }

  handleOffers() {
    return {
      type: 'text',
      message: `Current Offers\n\n• ${this.kb.offers.firstTime}\n• ${this.kb.offers.referral}\n• ${this.kb.offers.subscription}\n• ${this.kb.offers.seasonal}\n\nBook now to save!`,
      suggestions: ["Book service", "Show all services", "How to book?"]
    };
  }

  handleEmergency(query) {
    const service = Object.values(this.kb.services).find(s => 
      s.keywords.some(keyword => query.includes(keyword))
    );

    if (service) {
      return {
        type: 'navigation',
        message: `Emergency ${service.name} available! Book now for immediate service.`,
        route: service.route,
        buttonText: `Book Emergency ${service.name}`,
        suggestions: ["Contact support"]
      };
    }

    return {
      type: 'text',
      message: "For emergencies, we offer same-day service! Which healthcare service do you need urgently?",
      suggestions: ["Nursing Care", "Elderly Care", "Contact support"]
    };
  }

  handleCancellation() {
    return {
      type: 'text',
      message: `Cancellation Policy\n\n• ${this.kb.pricing.cancellation.free}\n• ${this.kb.pricing.cancellation.charges}\n• ${this.kb.pricing.cancellation.noShow}\n\nNeed help with cancellation?`,
      suggestions: ["Contact support", "How to book?", "Show services"]
    };
  }

  handleUnknown(query) {
    return {
      type: 'text',
      message: "I can help you with:\n\n• Finding healthcare services\n• Booking appointments\n• Pricing information\n• Account assistance\n• Support and queries\n\nWhat would you like to know?",
      suggestions: ["Show services", "How to book?", "Pricing", "Contact support"]
    };
  }
}

export default new NeedBotAI();
