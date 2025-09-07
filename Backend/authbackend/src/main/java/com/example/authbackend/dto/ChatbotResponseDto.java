package com.example.authbackend.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatbotResponseDto {
    
    @NotBlank(message = "Response message is required")
    private String message;
    
    private String type;
    private String intent;
    private String action;
    private String redirectUrl;
    
    // Constructors
    public ChatbotResponseDto() {}
    
    public ChatbotResponseDto(String message, String type) {
        this.message = message;
        this.type = type;
    }
    
    public ChatbotResponseDto(String message, String type, String intent) {
        this.message = message;
        this.type = type;
        this.intent = intent;
    }
    
    // Getters and Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getIntent() {
        return intent;
    }
    
    public void setIntent(String intent) {
        this.intent = intent;
    }
    
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }
    
    public String getRedirectUrl() {
        return redirectUrl;
    }
    
    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
}
