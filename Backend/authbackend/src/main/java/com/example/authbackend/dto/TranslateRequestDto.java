package com.example.authbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class TranslateRequestDto {
    
    @NotEmpty(message = "Texts list cannot be empty")
    @Size(max = 100, message = "Maximum 100 texts can be translated at once")
    private List<@NotBlank(message = "Text cannot be blank") String> texts;
    
    @NotBlank(message = "Target language is required")
    @Size(min = 2, max = 5, message = "Language code must be between 2-5 characters")
    private String targetLang;
    
    @Size(min = 2, max = 5, message = "Source language code must be between 2-5 characters")
    private String sourceLang;
    
    // Explicit getters and setters to ensure compilation
    public List<String> getTexts() {
        return texts;
    }
    
    public void setTexts(List<String> texts) {
        this.texts = texts;
    }
    
    public String getTargetLang() {
        return targetLang;
    }
    
    public void setTargetLang(String targetLang) {
        this.targetLang = targetLang;
    }
    
    public String getSourceLang() {
        return sourceLang;
    }
    
    public void setSourceLang(String sourceLang) {
        this.sourceLang = sourceLang;
    }
}
