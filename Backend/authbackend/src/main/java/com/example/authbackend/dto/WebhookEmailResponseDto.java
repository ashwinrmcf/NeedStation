package com.example.authbackend.dto;

import lombok.Data;

@Data
public class WebhookEmailResponseDto {
    
    private String webhookEndpoint;
    private boolean sent;
    private String provider;
    private String messageId;
    private String recipientEmail;
    
    // Explicit getters and setters to ensure compilation
    public String getWebhookEndpoint() {
        return webhookEndpoint;
    }
    
    public void setWebhookEndpoint(String webhookEndpoint) {
        this.webhookEndpoint = webhookEndpoint;
    }
    
    public boolean isSent() {
        return sent;
    }
    
    public void setSent(boolean sent) {
        this.sent = sent;
    }
    
    public String getProvider() {
        return provider;
    }
    
    public void setProvider(String provider) {
        this.provider = provider;
    }
    
    public String getMessageId() {
        return messageId;
    }
    
    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
    
    public String getRecipientEmail() {
        return recipientEmail;
    }
    
    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
}
