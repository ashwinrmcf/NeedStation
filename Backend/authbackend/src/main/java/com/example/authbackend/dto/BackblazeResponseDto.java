package com.example.authbackend.dto;

import lombok.Data;

import java.util.Map;

@Data
public class BackblazeResponseDto {
    private String fileId;
    private String fileName;
    private String fileUrl;
    private String contentType;
    private long fileSize;
    private Map<String, String> uploadedFiles;
    private int totalFiles;
    private boolean success;
    
    // Explicit getters and setters to ensure compilation
    public String getFileId() {
        return fileId;
    }
    
    public void setFileId(String fileId) {
        this.fileId = fileId;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getFileUrl() {
        return fileUrl;
    }
    
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }
    
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
}
