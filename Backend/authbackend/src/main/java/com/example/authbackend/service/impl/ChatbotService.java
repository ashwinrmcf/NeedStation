package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IChatbotService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class ChatbotService implements IChatbotService {

    private String projectContext;

    public ChatbotService() {
        this.projectContext = initializeProjectContext();
    }

    private String initializeProjectContext() {
        return "NeedStation is a comprehensive home services platform that connects customers with verified service providers. " +
               "Our services include:\n" +
               "- Plumbing and electrical work\n" +
               "- Home cleaning and maintenance\n" +
               "- Repairs and installations\n" +
               "- Emergency services\n" +
               "- Verified and background-checked workers\n" +
               "- Competitive pricing and reliable service";
    }

    @Override
    public Response processQuery(String query) {
        Response response = new Response();
        try {
            if (query == null || query.trim().isEmpty()) {
                response.setStatusCode(200);
                response.setMessage("How can I help you with NeedStation services today?");
                return response;
            }

            String normalizedQuery = query.toLowerCase().trim();
            
            // Check for greetings
            if (normalizedQuery.matches("(?i).*(hello|hi|hey|good morning|good afternoon|good evening).*")) {
                return createGreetingResponse();
            }
            // Check for goodbye
            else if (normalizedQuery.matches("(?i).*(bye|goodbye|thank you|thanks).*")) {
                return createFarewellResponse();
            }
            // Check for service-related queries
            else if (normalizedQuery.matches("(?i).*(service|help|repair|fix|clean|plumb|electric).*")) {
                return createServiceInquiryResponse();
            }
            // Check for worker registration queries
            else if (normalizedQuery.matches("(?i).*(worker|register|join|work|employment).*")) {
                return createWorkerRegistrationResponse();
            }
            // Check for contact queries
            else if (normalizedQuery.matches("(?i).*(contact|support|help|phone|email).*")) {
                return createContactInquiryResponse();
            }
            // Check for booking queries
            else if (normalizedQuery.matches("(?i).*(book|schedule|appointment|hire).*")) {
                return createBookingInquiryResponse();
            }
            else {
                return createDefaultResponse();
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Chatbot processing failed: " + e.getMessage());
        }
        return response;
    }
    
    private Response createGreetingResponse() {
        Response response = new Response();
        ChatbotResponseDto chatbotResponse = new ChatbotResponseDto(
            "Hello! Welcome to NeedStation. I'm here to help you with our home services. What can I assist you with today?",
            "greeting",
            "welcome"
        );
        response.setStatusCode(200);
        response.setMessage(chatbotResponse.getMessage());
        response.setChatbotResponseDto(chatbotResponse);
        return response;
    }
    
    private Response createFarewellResponse() {
        Response response = new Response();
        ChatbotResponseDto chatbotResponse = new ChatbotResponseDto(
            "Thank you for using NeedStation! Have a great day and don't hesitate to reach out if you need any home services.",
            "farewell",
            "goodbye"
        );
        response.setStatusCode(200);
        response.setMessage(chatbotResponse.getMessage());
        response.setChatbotResponseDto(chatbotResponse);
        return response;
    }
    
    private Response createServiceInquiryResponse() {
        Response response = new Response();
        ChatbotResponseDto chatbotResponse = new ChatbotResponseDto(
            "NeedStation offers various home services including plumbing, electrical work, cleaning, repairs, and maintenance. What specific service are you looking for?",
            "service_inquiry",
            "service_request"
        );
        response.setStatusCode(200);
        response.setMessage(chatbotResponse.getMessage());
        response.setChatbotResponseDto(chatbotResponse);
        return response;
    }
    
    private Response createWorkerRegistrationResponse() {
        Response response = new Response();
        ChatbotResponseDto chatbotResponse = new ChatbotResponseDto(
            "To register as a worker with NeedStation, you'll need to complete our multi-step registration process including verification. Would you like me to guide you through the registration steps?",
            "worker_registration",
            "worker_signup"
        );
        response.setStatusCode(200);
        response.setMessage(chatbotResponse.getMessage());
        response.setChatbotResponseDto(chatbotResponse);
        return response;
    }
    
    private Response createContactInquiryResponse() {
        Response response = new Response();
        ChatbotResponseDto chatbotResponse = new ChatbotResponseDto(
            "You can contact NeedStation support through our contact form, email, or phone. Would you like me to provide the contact details?",
            "contact_inquiry",
            "contact_support"
        );
        response.setStatusCode(200);
        response.setMessage(chatbotResponse.getMessage());
        response.setChatbotResponseDto(chatbotResponse);
        return response;
    }
    
    private Response createBookingInquiryResponse() {
        Response response = new Response();
        ChatbotResponseDto chatbotResponse = new ChatbotResponseDto(
            "To book a service, you can browse our available workers, select the service you need, and schedule an appointment. Would you like help finding a specific service?",
            "booking_inquiry",
            "service_booking"
        );
        response.setStatusCode(200);
        response.setMessage(chatbotResponse.getMessage());
        response.setChatbotResponseDto(chatbotResponse);
        return response;
    }
    
    private Response createDefaultResponse() {
        Response response = new Response();
        ChatbotResponseDto chatbotResponse = new ChatbotResponseDto(
            "I'm here to help you with NeedStation services. " + projectContext + 
            "\n\nCould you please be more specific about what you're looking for? " +
            "For example, you can ask about:\n" +
            "- Available services\n" +
            "- Worker registration\n" +
            "- Booking appointments\n" +
            "- Contact information",
            "default",
            "help_menu"
        );
        response.setStatusCode(200);
        response.setMessage(chatbotResponse.getMessage());
        response.setChatbotResponseDto(chatbotResponse);
        return response;
    }
}
