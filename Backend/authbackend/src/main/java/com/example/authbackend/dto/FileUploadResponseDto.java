package com.example.authbackend.dto;

import lombok.Data;

import java.util.Map;

@Data
public class FileUploadResponseDto {
    
    private Map<String, String> uploadedFiles;
    private int totalFiles;
    private boolean success;
    private String baseUrl;
    
    // Explicit getters and setters to ensure compilation
    public Map<String, String> getUploadedFiles() {
        return uploadedFiles;
    }
    
    public void setUploadedFiles(Map<String, String> uploadedFiles) {
        this.uploadedFiles = uploadedFiles;
    }
    
    public int getTotalFiles() {
        return totalFiles;
    }
    
    public void setTotalFiles(int totalFiles) {
        this.totalFiles = totalFiles;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getBaseUrl() {
        return baseUrl;
    }
    
    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
}
