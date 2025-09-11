package com.example.authbackend.service;

import com.example.authbackend.dto.ContactRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebhookEmailService {

    @Value("${formspree.endpoint:}")
    private String formspreeEndpoint;

    @Value("${contact.support.email:needstation3@gmail.com}")
    private String supportEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendContactFormViaWebhook(ContactRequest contactRequest) {
        if (formspreeEndpoint == null || formspreeEndpoint.isEmpty()) {
            throw new RuntimeException("Formspree endpoint not configured");
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("name", contactRequest.getName());
            payload.put("email", contactRequest.getEmail());
            payload.put("subject", "NeedStation Contact: " + contactRequest.getSubject());
            payload.put("message", buildFormattedMessage(contactRequest));
            payload.put("_replyto", contactRequest.getEmail());
            payload.put("_subject", "NeedStation Contact: " + contactRequest.getSubject());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.add("Accept", "application/json");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(
                formspreeEndpoint, 
                request, 
                String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to send via webhook: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error sending contact form via webhook: " + e.getMessage());
        }
    }

    private String buildFormattedMessage(ContactRequest contactRequest) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        return String.format(
            "NEW CONTACT FORM SUBMISSION - NEEDSTATION\n" +
            "========================================\n\n" +
            "Name: %s\n" +
            "Email: %s\n" +
            "Subject: %s\n" +
            "Submitted: %s\n\n" +
            "Message:\n" +
            "--------\n" +
            "%s\n\n" +
            "========================================\n" +
            "Reply directly to this email to respond to the customer.\n" +
            "Customer Email: %s", 
            contactRequest.getName(),
            contactRequest.getEmail(),
            contactRequest.getSubject(),
            timestamp,
            contactRequest.getMessage(),
            contactRequest.getEmail()
        );
    }
}
