package com.example.authbackend.model;

import java.util.List;

// Removed Lombok dependency to ensure compatibility
public class TranslateRequest {
    private List<String> texts;
    private String lang;
    
    // Explicit getter methods
    public List<String> getTexts() {
        return texts;
    }
    
    public void setTexts(List<String> texts) {
        this.texts = texts;
    }
    
    public String getLang() {
        return lang;
    }
    
    public void setLang(String lang) {
        this.lang = lang;
    }
}
