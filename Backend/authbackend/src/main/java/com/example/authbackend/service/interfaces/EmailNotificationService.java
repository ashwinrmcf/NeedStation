package com.example.authbackend.service.interfaces;

import com.example.authbackend.dto.ContactRequest;
import java.io.IOException;

/**
 * Interface for email notification services
 * Abstracts different email providers (SendGrid, Firebase, etc.)
 */
public interface EmailNotificationService {
    
    /**
     * Send contact form email
     * @param contactRequest Contact form data
     * @throws IOException if email sending fails
     */
    void sendContactFormEmail(ContactRequest contactRequest) throws IOException;
    
    /**
     * Send generic email
     * @param to Recipient email address
     * @param subject Email subject
     * @param content Email content (HTML or plain text)
     * @param replyTo Optional reply-to address
     * @throws IOException if email sending fails
     */
    default void sendEmail(String to, String subject, String content, String replyTo) throws IOException {
        throw new UnsupportedOperationException("Generic email sending not implemented");
    }
    
    /**
     * Check if the email service is properly configured
     * @return true if service is ready to send emails
     */
    boolean isConfigured();
}
