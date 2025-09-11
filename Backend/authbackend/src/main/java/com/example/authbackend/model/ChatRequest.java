package com.example.authbackend.model;

public class ChatRequest {
    private String message;

    // Default constructor for JSON deserialization
    public ChatRequest() {
    }

    public ChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
