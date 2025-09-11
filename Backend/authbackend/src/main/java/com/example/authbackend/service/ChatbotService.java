package com.example.authbackend.service;

import com.example.authbackend.dto.ChatbotResponse;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.logging.Logger;

@Service
public class ChatbotService {

    private static final Logger logger = Logger.getLogger(ChatbotService.class.getName());
    
    private final Map<Pattern, Map<String, String>> navigationIntents;
    private String projectContext;

    public ChatbotService() {
        this.navigationIntents = initializeNavigationIntents();
        this.projectContext = initializeProjectContext();
    }

    private Map<Pattern, Map<String, String>> initializeNavigationIntents() {
        Map<Pattern, Map<String, String>> intents = new HashMap<>();
        
        // Home navigation
        Map<String, String> homeIntent = new HashMap<>();
        homeIntent.put("message", "Taking you to our home page!");
        homeIntent.put("url", "/");
        homeIntent.put("buttonText", "Go to Home");
        intents.put(Pattern.compile("(?i).*(home|main page|homepage).*"), homeIntent);
        
        // Services navigation
        Map<String, String> servicesIntent = new HashMap<>();
        servicesIntent.put("message", "Let me show you our services!");
        servicesIntent.put("url", "/services");
        servicesIntent.put("buttonText", "View Services");
        intents.put(Pattern.compile("(?i).*(services|what do you offer|what services).*"), servicesIntent);
        
        // Contact navigation
        Map<String, String> contactIntent = new HashMap<>();
        contactIntent.put("message", "Here's how you can contact us!");
        contactIntent.put("url", "/contact-us");
        contactIntent.put("buttonText", "Contact Us");
        intents.put(Pattern.compile("(?i).*(contact|get in touch|reach you|call you).*"), contactIntent);
        
        // About navigation
        Map<String, String> aboutIntent = new HashMap<>();
        aboutIntent.put("message", "Learn more about NeedStation!");
        aboutIntent.put("url", "/about-us");
        aboutIntent.put("buttonText", "About Us");
        intents.put(Pattern.compile("(?i).*(about|who are you|about us|company info|our company).*"), aboutIntent);
        
        return intents;
    }

    private String initializeProjectContext() {
        return "NeedStation is a comprehensive home services platform offering:\n" +
               "- Plumbing services: pipe repairs, leak fixing, tap installation\n" +
               "- Electrical services: wiring, power installations, repairs\n" +
               "- Cleaning services: house cleaning, deep cleaning, housekeeping\n" +
               "- Water supply services: tank cleaning, purifier installation\n" +
               "- Emergency 24/7 support for urgent issues\n" +
               "- Professional, certified service providers\n" +
               "- Competitive pricing and reliable service";
    }

    public ChatbotResponse processQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ChatbotResponse("How can I help you with NeedStation services today?");
        }

        query = query.trim().toLowerCase();
        logger.info("Processing chatbot query: " + query);

        // Check for navigation intents first
        for (Map.Entry<Pattern, Map<String, String>> entry : navigationIntents.entrySet()) {
            Pattern pattern = entry.getKey();
            Map<String, String> intentDetails = entry.getValue();
            Matcher matcher = pattern.matcher(query);
            if (matcher.find()) {
                logger.info("Navigation intent recognized for query: '" + query + "' -> " + intentDetails.get("url"));
                return new ChatbotResponse(intentDetails.get("message"), intentDetails.get("url"), intentDetails.get("buttonText"));
            }
        }

        logger.info("No navigation intent. Using rule-based response for: '" + query + "'");

        // Rule-based responses for common queries
        return generateRuleBasedResponse(query);
    }
    
    private ChatbotResponse generateRuleBasedResponse(String query) {
        String lowerQuery = query.toLowerCase().trim();
        
        // Service-related queries
        if (lowerQuery.contains("plumber") || lowerQuery.contains("plumbing") || 
            lowerQuery.contains("pipe") || lowerQuery.contains("leak") || lowerQuery.contains("tap")) {
            return new ChatbotResponse("I can help you find plumbing services! We offer pipe repairs, leak fixing, tap installation, and general plumbing maintenance. Would you like me to connect you with our plumbing services?");
        }
        
        if (lowerQuery.contains("electrician") || lowerQuery.contains("electrical") || 
            lowerQuery.contains("wiring") || lowerQuery.contains("power")) {
            return new ChatbotResponse("We provide electrical services including wiring, power installations, and electrical repairs. Our certified electricians are ready to help. Shall I direct you to our electrical services?");
        }
        
        if (lowerQuery.contains("cleaning") || lowerQuery.contains("housekeeping") || 
            lowerQuery.contains("maid")) {
            return new ChatbotResponse("Our cleaning services include house cleaning, deep cleaning, and regular housekeeping. We have trained professionals for all your cleaning needs. Would you like to book a cleaning service?");
        }
        
        if (lowerQuery.contains("water") || lowerQuery.contains("supply") || 
            lowerQuery.contains("tank") || lowerQuery.contains("purifier")) {
            return new ChatbotResponse("We offer water supply services, tank cleaning, water purifier installation and maintenance. Clean water is essential! How can I help you with water-related services?");
        }
        
        // Pricing queries
        if (lowerQuery.contains("price") || lowerQuery.contains("cost") || 
            lowerQuery.contains("charge") || lowerQuery.contains("rate")) {
            return new ChatbotResponse("Our pricing varies based on the service and requirements. For accurate pricing, please contact us directly or visit our services page. We offer competitive rates for all our services!");
        }
        
        // Booking queries
        if (lowerQuery.contains("book") || lowerQuery.contains("appointment") || 
            lowerQuery.contains("schedule")) {
            return new ChatbotResponse("To book a service, you can contact us directly or use our booking system. We're available 24/7 to schedule appointments at your convenience. What service would you like to book?");
        }
        
        // Contact queries
        if (lowerQuery.contains("contact") || lowerQuery.contains("phone") || 
            lowerQuery.contains("call") || lowerQuery.contains("reach")) {
            return new ChatbotResponse("You can reach us through our contact form or call us directly. We're here to help with all your service needs. Visit our contact page for more details!");
        }
        
        // Emergency queries
        if (lowerQuery.contains("emergency") || lowerQuery.contains("urgent") || 
            lowerQuery.contains("immediate")) {
            return new ChatbotResponse("For emergency services, please contact us immediately! We provide 24/7 emergency support for urgent plumbing, electrical, and other critical issues. Your safety is our priority!");
        }
        
        // Default response
        return new ChatbotResponse("I'm here to help you with NeedStation services! We offer plumbing, electrical, cleaning, water supply, and many other home services. How can I assist you today?");
    }
}
