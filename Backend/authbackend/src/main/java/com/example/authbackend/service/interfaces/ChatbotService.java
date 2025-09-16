package com.example.authbackend.service.interfaces;

import com.example.authbackend.dto.ChatbotResponse;

/**
 * Interface for chatbot services
 * Abstracts different chatbot implementations (rule-based, AI-powered, etc.)
 */
public interface ChatbotService {
    
    /**
     * Process user query and generate response
     * @param query User's query or message
     * @return ChatbotResponse containing reply and optional navigation
     */
    ChatbotResponse processQuery(String query);
    
    /**
     * Process query with context (user session, previous messages, etc.)
     * @param query User's query or message
     * @param context Additional context information
     * @return ChatbotResponse containing reply and optional navigation
     */
    default ChatbotResponse processQuery(String query, Object context) {
        // Default implementation ignores context
        return processQuery(query);
    }
    
    /**
     * Get chatbot capabilities or supported features
     * @return Description of what the chatbot can help with
     */
    default String getCapabilities() {
        return "I can help you with general inquiries about our services.";
    }
    
    /**
     * Check if chatbot service is available
     * @return true if chatbot is ready to process queries
     */
    default boolean isAvailable() {
        return true;
    }
    
    /**
     * Get the chatbot implementation type
     * @return Implementation type (e.g., "RULE_BASED", "AI_POWERED", "HYBRID")
     */
    default String getImplementationType() {
        return "UNKNOWN";
    }
}
