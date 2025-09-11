package com.example.authbackend.service;

import com.example.authbackend.dto.ContactRequest;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;

    @Value("${contact.support.email:needstation3@gmail.com}")
    private String supportEmail;

    @Value("${contact.from.email:noreply@needstation.com}")
    private String fromEmail;

    public void sendContactFormEmail(ContactRequest contactRequest) throws IOException {
        if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            throw new RuntimeException("SendGrid API key not configured");
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
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("Failed to send email: " + response.getBody());
            }
        } catch (IOException ex) {
            throw new IOException("Error sending email via SendGrid", ex);
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
