package com.example.authbackend.service;

import com.example.authbackend.dto.ContactRequest;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class FirebaseEmailService {

    @Value("${firebase.project.id:}")
    private String firebaseProjectId;

    @Value("${firebase.service.account.path:}")
    private String serviceAccountPath;

    @Value("${firebase.function.url:}")
    private String firebaseFunctionUrl;

    @Value("${contact.support.email:needstation3@gmail.com}")
    private String supportEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    public void initializeFirebase() {
        if (serviceAccountPath != null && !serviceAccountPath.isEmpty()) {
            try {
                FileInputStream serviceAccount = new FileInputStream(serviceAccountPath);
                
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setProjectId(firebaseProjectId)
                    .build();

                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                }
            } catch (IOException e) {
                System.err.println("Failed to initialize Firebase: " + e.getMessage());
            }
        }
    }

    public void sendContactFormViaFirebase(ContactRequest contactRequest) {
        if (firebaseFunctionUrl == null || firebaseFunctionUrl.isEmpty()) {
            throw new RuntimeException("Firebase Function URL not configured");
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("to", supportEmail);
            payload.put("subject", "NeedStation Contact: " + contactRequest.getSubject());
            payload.put("html", buildEmailHtml(contactRequest));
            payload.put("replyTo", contactRequest.getEmail());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.add("Accept", "application/json");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(
                firebaseFunctionUrl, 
                request, 
                String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to send via Firebase: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error sending contact form via Firebase: " + e.getMessage());
        }
    }

    private String buildEmailHtml(ContactRequest contactRequest) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        return String.format(
            "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;\">" +
            "<div style=\"background-color: #00E0B8; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;\">" +
            "<h1 style=\"color: white; margin: 0;\">NeedStation Contact Form</h1>" +
            "</div>" +
            "<div style=\"background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);\">" +
            "<h2 style=\"color: #333; margin-bottom: 20px;\">New Contact Form Submission</h2>" +
            "<div style=\"margin-bottom: 15px;\">" +
            "<strong style=\"color: #00E0B8;\">Name:</strong>" +
            "<p style=\"margin: 5px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;\">%s</p>" +
            "</div>" +
            "<div style=\"margin-bottom: 15px;\">" +
            "<strong style=\"color: #00E0B8;\">Email:</strong>" +
            "<p style=\"margin: 5px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;\">%s</p>" +
            "</div>" +
            "<div style=\"margin-bottom: 15px;\">" +
            "<strong style=\"color: #00E0B8;\">Subject:</strong>" +
            "<p style=\"margin: 5px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;\">%s</p>" +
            "</div>" +
            "<div style=\"margin-bottom: 15px;\">" +
            "<strong style=\"color: #00E0B8;\">Message:</strong>" +
            "<div style=\"margin: 5px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; white-space: pre-wrap;\">%s</div>" +
            "</div>" +
            "<div style=\"margin-top: 20px; padding: 15px; background-color: #e8f8f5; border-radius: 5px; border-left: 4px solid #00E0B8;\">" +
            "<p style=\"margin: 0; color: #666;\">" +
            "<strong>Submitted:</strong> %s<br>" +
            "<strong>Reply to:</strong> %s" +
            "</p>" +
            "</div>" +
            "<div style=\"margin-top: 20px; padding: 10px; background-color: #fff3cd; border-radius: 5px; border: 1px solid #ffeaa7;\">" +
            "<p style=\"margin: 0; color: #856404; font-size: 14px;\">" +
            "<strong>Note:</strong> You can reply directly to this email to respond to the customer." +
            "</p>" +
            "</div>" +
            "</div>" +
            "</div>", 
            contactRequest.getName(), 
            contactRequest.getEmail(), 
            contactRequest.getSubject(), 
            contactRequest.getMessage(), 
            timestamp, 
            contactRequest.getEmail()
        );
    }
}
