package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IContactService;
import com.example.authbackend.service.impl.EmailService;
import com.example.authbackend.service.impl.WebhookEmailService;
import com.example.authbackend.service.impl.FirebaseEmailService;
import com.example.authbackend.utils.Utils;
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
public class ContactService implements IContactService {

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

    @Override
    public Response processContactForm(ContactRequestDto contactRequest) {
        Response response = new Response();
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
            
            ContactDto contactDto = Utils.mapContactRequestToContactDto(
                contactRequest.getName(),
                contactRequest.getEmail(),
                contactRequest.getPhone(),
                contactRequest.getSubject(),
                contactRequest.getMessage()
            );
            
            response.setContactDto(contactDto);
            response.setStatusCode(200);
            response.setMessage("Contact form submitted successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to send contact form: " + e.getMessage());
        }
        return response;
    }

    private void sendSupportEmail(ContactRequestDto contactRequest) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(supportEmail);
        helper.setSubject("NeedStation Contact: " + contactRequest.getSubject());
        helper.setReplyTo(contactRequest.getEmail());

        String emailContent = buildSupportEmailContent(contactRequest);
        helper.setText(emailContent, true);

        mailSender.send(message);
    }

    private void sendAutoReply(ContactRequestDto contactRequest) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(contactRequest.getEmail());
        helper.setSubject("Thank you for contacting NeedStation - We've received your message");

        String autoReplyContent = buildAutoReplyContent(contactRequest);
        helper.setText(autoReplyContent, true);

        mailSender.send(message);
    }

    private String buildSupportEmailContent(ContactRequestDto contactRequest) {
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

    private String buildAutoReplyContent(ContactRequestDto contactRequest) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Thank you for contacting NeedStation</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Thank You!</h1>
                    </div>
                    <div class="content">
                        <p>Dear %s,</p>
                        <p>Thank you for contacting NeedStation. We have received your message regarding "<strong>%s</strong>" and will get back to you as soon as possible.</p>
                        <p>Our team typically responds within 24 hours during business days.</p>
                        <p>If you have any urgent concerns, please don't hesitate to call us directly.</p>
                        <p>Best regards,<br>The NeedStation Team</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated response. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            contactRequest.getName(),
            contactRequest.getSubject()
        );
    }
}
