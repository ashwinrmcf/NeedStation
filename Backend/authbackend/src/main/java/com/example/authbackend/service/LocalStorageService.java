package com.example.authbackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class LocalStorageService {

    @Value("${server.port:8080}")
    private String serverPort;
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    private static final String BASE_URL = "http://localhost";
    
    /**
     * Upload image to local storage and return the public URL
     */
    public String uploadImage(MultipartFile file) throws IOException {
        try {
            if (file == null || file.isEmpty()) {
                System.out.println("Upload image called with null or empty file");
                return null;
            }
            
            System.out.println("Uploading image to local storage. File size: " + file.getSize() + ", Content Type: " + file.getContentType());
            
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : "";
            String filename = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + extension;
            
            // Create subfolder for worker profiles
            Path profilesPath = uploadPath.resolve("worker_profiles");
            if (!Files.exists(profilesPath)) {
                Files.createDirectories(profilesPath);
            }
            
            // Save file
            Path filePath = profilesPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Generate public URL
            String publicUrl = BASE_URL + ":" + serverPort + "/uploads/worker_profiles/" + filename;
            
            System.out.println("Image uploaded successfully to local storage: " + publicUrl);
            
            return publicUrl;
            
        } catch (Exception e) {
            System.err.println("Error uploading image to local storage: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Upload multiple files to local storage
     */
    public Map<String, String> uploadMultipleFiles(Map<String, MultipartFile> files) throws IOException {
        Map<String, String> uploadedUrls = new HashMap<>();
        
        if (files != null && !files.isEmpty()) {
            for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
                if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                    String url = uploadImage(entry.getValue());
                    uploadedUrls.put(entry.getKey(), url);
                }
            }
        }
        
        return uploadedUrls;
    }
    
    /**
     * Delete file from local storage
     */
    public boolean deleteFile(String fileUrl) {
        try {
            // Extract filename from URL
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, "worker_profiles", filename);
            
            boolean deleted = Files.deleteIfExists(filePath);
            System.out.println("File deletion " + (deleted ? "successful" : "failed") + ": " + filename);
            
            return deleted;
        } catch (Exception e) {
            System.err.println("Error deleting file from local storage: " + e.getMessage());
            return false;
        }
    }
}
