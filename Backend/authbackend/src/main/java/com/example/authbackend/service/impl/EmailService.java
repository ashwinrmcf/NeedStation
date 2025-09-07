package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IEmailService;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService implements IEmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${contact.support.email:needstation3@gmail.com}")
    private String supportEmail;

    @Value("${contact.from.email:noreply@needstation.com}")
    private String fromEmail;

    @Override
    public com.example.authbackend.dto.Response sendContactFormEmail(ContactRequestDto contactRequest) {
        com.example.authbackend.dto.Response response = new com.example.authbackend.dto.Response();
        try {
            if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
                response.setStatusCode(500);
                response.setMessage("SendGrid API key not configured");
                return response;
            }

            Email from = new Email(fromEmail, "NeedStation Contact Form");
            Email to = new Email(supportEmail);
            String subject = "NeedStation Contact: " + contactRequest.getSubject();
            
            Content content = new Content("text/html", buildEmailHtml(contactRequest));
            Mail mail = new Mail(from, subject, to, content);

            // Set reply-to as the user's email
            Email replyTo = new Email(contactRequest.getEmail());
            mail.setReplyTo(replyTo);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            com.sendgrid.Response sgResponse = sg.api(request);
            
            if (sgResponse.getStatusCode() >= 200 && sgResponse.getStatusCode() < 300) {
                response.setStatusCode(200);
                response.setMessage("Email sent successfully via SendGrid");
            } else {
                response.setStatusCode(500);
                response.setMessage("SendGrid API returned status: " + sgResponse.getStatusCode());
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to send email via SendGrid: " + e.getMessage());
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
                        <p>This message was sent from the NeedStation contact form.</p>
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
