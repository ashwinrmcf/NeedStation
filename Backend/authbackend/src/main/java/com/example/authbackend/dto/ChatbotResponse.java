package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL) // Only include non-null fields in JSON output
public class ChatbotResponse {
    private String message;
    private String redirectUrl;
    private String redirectButtonText;

    // Constructors
    public ChatbotResponse(String message) {
        this.message = message;
    }

    public ChatbotResponse(String message, String redirectUrl, String redirectButtonText) {
        this.message = message;
        this.redirectUrl = redirectUrl;
        this.redirectButtonText = redirectButtonText;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public String getRedirectButtonText() {
        return redirectButtonText;
    }

    public void setRedirectButtonText(String redirectButtonText) {
        this.redirectButtonText = redirectButtonText;
    }
}
