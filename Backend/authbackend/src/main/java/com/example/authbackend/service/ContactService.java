package com.example.authbackend.service;

import com.example.authbackend.dto.ContactRequest;
import com.example.authbackend.dto.ContactResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ContactService {

    @Autowired(required = false)
    private EmailService emailService;

    @Autowired(required = false)
    private WebhookEmailService webhookEmailService;

    @Autowired(required = false)
    private FirebaseEmailService firebaseEmailService;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${contact.method:smtp}")
    private String contactMethod;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${contact.support.email:needstation3@gmail.com}")
    private String supportEmail;

    public ContactResponse processContactForm(ContactRequest contactRequest) {
        try {
            switch (contactMethod.toLowerCase()) {
                case "sendgrid":
                    if (emailService != null) {
                        emailService.sendContactFormEmail(contactRequest);
                    } else {
                        throw new RuntimeException("SendGrid service not available");
                    }
                    break;
                case "firebase":
                    if (firebaseEmailService != null) {
                        firebaseEmailService.sendContactFormViaFirebase(contactRequest);
                    } else {
                        throw new RuntimeException("Firebase service not available");
                    }
                    break;
                case "smtp":
                    // Use the original SMTP email service
                    sendSupportEmail(contactRequest);
                    sendAutoReply(contactRequest);
                    break;
                case "webhook":
                case "formspree":
                default:
                    if (webhookEmailService != null) {
                        webhookEmailService.sendContactFormViaWebhook(contactRequest);
                    } else {
                        throw new RuntimeException("Webhook service not available");
                    }
                    break;
            }
            
            return new ContactResponse(true, "Message sent successfully!");
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to send contact form: " + e.getMessage());
        }
    }

    private void sendSupportEmail(ContactRequest contactRequest) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(supportEmail);
        helper.setSubject("NeedStation Contact Form: " + contactRequest.getSubject());
        helper.setReplyTo(contactRequest.getEmail());

        String htmlContent = buildSupportEmailHtml(contactRequest);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    private void sendAutoReply(ContactRequest contactRequest) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(contactRequest.getEmail());
        helper.setSubject("Thank you for contacting NeedStation");

        String htmlContent = buildAutoReplyHtml(contactRequest);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    private String buildSupportEmailHtml(ContactRequest contactRequest) {
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

    private String buildAutoReplyHtml(ContactRequest contactRequest) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        return String.format(
            "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;\">" +
            "<div style=\"background-color: #00E0B8; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;\">" +
            "<h1 style=\"color: white; margin: 0;\">Thank You!</h1>" +
            "</div>" +
            "<div style=\"background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);\">" +
            "<h2 style=\"color: #333; margin-bottom: 20px;\">Hi %s,</h2>" +
            "<p style=\"color: #666; line-height: 1.6; margin-bottom: 20px;\">" +
            "Thank you for reaching out to NeedStation! We've received your message and our team will get back to you within 24 hours." +
            "</p>" +
            "<div style=\"background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;\">" +
            "<h3 style=\"color: #00E0B8; margin-top: 0;\">Your Message Summary:</h3>" +
            "<p style=\"margin: 5px 0;\"><strong>Subject:</strong> %s</p>" +
            "<p style=\"margin: 5px 0;\"><strong>Submitted:</strong> %s</p>" +
            "</div>" +
            "<p style=\"color: #666; line-height: 1.6;\">" +
            "In the meantime, feel free to explore our services or check out our FAQ section for quick answers to common questions." +
            "</p>" +
            "<div style=\"text-align: center; margin: 30px 0;\">" +
            "<a href=\"http://localhost:5174\" style=\"background-color: #00E0B8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;\">Visit NeedStation</a>" +
            "</div>" +
            "<p style=\"color: #999; font-size: 12px; text-align: center; margin-top: 30px;\">" +
            "Best regards,<br>" +
            "The NeedStation Team" +
            "</p>" +
            "</div>" +
            "</div>", 
            contactRequest.getName(), 
            contactRequest.getSubject(), 
            timestamp
        );
    }
}
