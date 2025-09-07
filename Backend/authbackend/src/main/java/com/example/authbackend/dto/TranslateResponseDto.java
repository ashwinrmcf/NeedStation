package com.example.authbackend.dto;

import lombok.Data;

import java.util.List;

@Data
public class TranslateResponseDto {
    
    private List<String> translatedTexts;
    private String sourceLang;
    private String targetLang;
    private int totalTexts;
    private boolean success;
    
    // Explicit getters and setters to ensure compilation
    public List<String> getTranslatedTexts() {
        return translatedTexts;
    }
    
    public void setTranslatedTexts(List<String> translatedTexts) {
        this.translatedTexts = translatedTexts;
    }
    
    public String getSourceLang() {
        return sourceLang;
    }
    
    public void setSourceLang(String sourceLang) {
        this.sourceLang = sourceLang;
    }
    
    public String getTargetLang() {
        return targetLang;
    }
    
    public void setTargetLang(String targetLang) {
        this.targetLang = targetLang;
    }
    
    public int getTotalTexts() {
        return totalTexts;
    }
    
    public void setTotalTexts(int totalTexts) {
        this.totalTexts = totalTexts;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
}
