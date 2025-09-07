package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IWebhookEmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebhookEmailService implements IWebhookEmailService {

    @Value("${formspree.endpoint:}")
    private String formspreeEndpoint;

    @Value("${contact.support.email:needstation3@gmail.com}")
    private String supportEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public Response sendContactFormViaWebhook(ContactRequestDto contactRequest) {
        Response response = new Response();
        try {
            if (formspreeEndpoint == null || formspreeEndpoint.isEmpty()) {
                response.setStatusCode(500);
                response.setMessage("Webhook endpoint not configured");
                return response;
            }

            if (contactRequest == null) {
                response.setStatusCode(400);
                response.setMessage("Contact request is required");
                return response;
            }

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
            
            String webhookResponse = restTemplate.postForObject(
                formspreeEndpoint, 
                request, 
                String.class
            );

            WebhookEmailResponseDto emailDto = new WebhookEmailResponseDto();
            emailDto.setWebhookEndpoint(formspreeEndpoint);
            emailDto.setProvider("Formspree");
            emailDto.setRecipientEmail(supportEmail);

            if (webhookResponse != null) {
                emailDto.setSent(true);
                emailDto.setMessageId("webhook_" + System.currentTimeMillis());
                
                response.setWebhookEmailResponseDto(emailDto);
                response.setStatusCode(200);
                response.setMessage("Contact form sent successfully via webhook");
            } else {
                emailDto.setSent(false);
                
                response.setWebhookEmailResponseDto(emailDto);
                response.setStatusCode(500);
                response.setMessage("Failed to send via webhook: No response received");
            }

        } catch (Exception e) {
            WebhookEmailResponseDto emailDto = new WebhookEmailResponseDto();
            emailDto.setWebhookEndpoint(formspreeEndpoint);
            emailDto.setProvider("Formspree");
            emailDto.setSent(false);
            
            response.setWebhookEmailResponseDto(emailDto);
            response.setStatusCode(500);
            response.setMessage("Error sending contact form via webhook: " + e.getMessage());
        }
        return response;
    }

    private String buildFormattedMessage(ContactRequestDto contactRequest) {
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
