package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IFirebaseEmailService;
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
public class FirebaseEmailService implements IFirebaseEmailService {

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
                    System.out.println("Firebase initialized successfully");
                }
            } catch (IOException e) {
                System.err.println("Failed to initialize Firebase: " + e.getMessage());
            }
        } else {
            System.out.println("Firebase service account path not configured, Firebase email service will be disabled");
        }
    }

    @Override
    public Response sendContactFormViaFirebase(ContactRequestDto contactRequest) {
        Response response = new Response();
        if (firebaseFunctionUrl == null || firebaseFunctionUrl.isEmpty()) {
            response.setStatusCode(500);
            response.setMessage("Firebase Function URL not configured");
            return response;
        }
        try {
            Map<String, Object> emailData = new HashMap<>();
            emailData.put("to", supportEmail);
            emailData.put("subject", "NeedStation Contact: " + contactRequest.getSubject());
            emailData.put("html", buildEmailHtml(contactRequest));
            emailData.put("replyTo", contactRequest.getEmail());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(emailData, headers);

            String firebaseResponse = restTemplate.postForObject(firebaseFunctionUrl, entity, String.class);

            if (firebaseResponse != null) {
                response.setStatusCode(200);
                response.setMessage("Email sent successfully via Firebase");
            } else {
                response.setStatusCode(500);
                response.setMessage("Firebase Function failed to send email");
            }

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to send email via Firebase: " + e.getMessage());
        }
        return response;
    }

    private String buildEmailHtml(ContactRequestDto contactRequest) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>New Contact Form Submission</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #555; }
                    .value { margin-top: 5px; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Contact Form Submission</h1>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">Name:</div>
                            <div class="value">%s</div>
                        </div>
                        <div class="field">
                            <div class="label">Email:</div>
                            <div class="value">%s</div>
                        </div>
                        <div class="field">
                            <div class="label">Phone:</div>
                            <div class="value">%s</div>
                        </div>
                        <div class="field">
                            <div class="label">Subject:</div>
                            <div class="value">%s</div>
                        </div>
                        <div class="field">
                            <div class="label">Message:</div>
                            <div class="value">%s</div>
                        </div>
                        <div class="field">
                            <div class="label">Submitted at:</div>
                            <div class="value">%s</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This message was sent from the NeedStation contact form via Firebase.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            contactRequest.getName(),
            contactRequest.getEmail(),
            contactRequest.getPhone() != null ? contactRequest.getPhone() : "Not provided",
            contactRequest.getSubject(),
            contactRequest.getMessage().replace("\n", "<br>"),
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
    }
}
