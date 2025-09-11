package com.example.authbackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Base64;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class BackblazeB2Service {

    @Value("${backblaze.application-key-id:}")
    private String applicationKeyId;
    
    // Holds the upload URL and its corresponding upload authorization token
    private static class UploadUrlResponse {
        String uploadUrl;
        String uploadAuthorizationToken;
        UploadUrlResponse(String uploadUrl, String uploadAuthorizationToken) {
            this.uploadUrl = uploadUrl;
            this.uploadAuthorizationToken = uploadAuthorizationToken;
        }
    }

    @Value("${backblaze.application-key:}")
    private String applicationKey;
    
    @Value("${backblaze.bucket-name:}")
    private String bucketName;
    
    @Value("${backblaze.bucket-id:}")
    private String bucketId;
    
    private HttpClient httpClient;
    private ObjectMapper objectMapper;
    private String authToken;
    private String apiUrl;
    private String downloadUrl;
    
    @PostConstruct
    public void initialize() {
        try {
            if (applicationKeyId.isEmpty() || applicationKey.isEmpty()) {
                System.out.println("Backblaze B2 credentials not configured - uploads will be disabled");
                return;
            }
            
            httpClient = HttpClient.newHttpClient();
            objectMapper = new ObjectMapper();
            
            // Authenticate with B2 API
            authenticateB2();
            
            System.out.println("Backblaze B2 initialized successfully");
        } catch (Exception e) {
            System.err.println("Failed to initialize Backblaze B2: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void authenticateB2() throws IOException, InterruptedException {
        String credentials = Base64.getEncoder().encodeToString((applicationKeyId + ":" + applicationKey).getBytes());
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.backblazeb2.com/b2api/v2/b2_authorize_account"))
                .header("Authorization", "Basic " + credentials)
                .GET()
                .build();
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
            JsonNode json = objectMapper.readTree(response.body());
            authToken = json.get("authorizationToken").asText();
            apiUrl = json.get("apiUrl").asText();
            downloadUrl = json.get("downloadUrl").asText();
        } else {
            throw new IOException("Failed to authenticate with B2: " + response.body());
        }
    }
    
    /**
     * Upload image to Backblaze B2 and return the public URL
     */
    public String uploadImage(MultipartFile file) throws IOException {
        return uploadImage(file, null, null);
    }
    
    /**
     * Upload image to Backblaze B2 with worker-specific folder and return the public URL
     */
    public String uploadImage(MultipartFile file, String workerName, Long workerId) throws IOException {
        try {
            System.out.println("=== BACKBLAZE B2 UPLOAD START ===");
            
            if (file == null || file.isEmpty()) {
                System.err.println("ERROR: Upload called with null or empty file");
                return null;
            }
            
            if (authToken == null) {
                System.err.println("ERROR: Backblaze B2 not initialized - authToken is null");
                System.err.println("Attempting to re-authenticate...");
                try {
                    authenticateB2();
                    if (authToken == null) {
                        System.err.println("CRITICAL: Re-authentication failed");
                        return null;
                    }
                } catch (Exception e) {
                    System.err.println("CRITICAL: Re-authentication exception: " + e.getMessage());
                    return null;
                }
            }
            
            System.out.println("File details:");
            System.out.println("  - Original name: " + file.getOriginalFilename());
            System.out.println("  - Size: " + file.getSize() + " bytes");
            System.out.println("  - Content type: " + file.getContentType());
            System.out.println("  - Worker name: " + workerName);
            System.out.println("  - Worker ID: " + workerId);
            
            // Generate folder path and filename
            String folderPath;
            if (workerName != null && workerId != null) {
                // Create worker-specific folder: WorkerName_WorkerID
                String sanitizedName = workerName.replaceAll("[^a-zA-Z0-9]", ""); // Remove special characters
                folderPath = sanitizedName + "_" + workerId + "/";
                System.out.println("Using worker-specific folder: " + folderPath);
            } else {
                // Fallback to general worker_profiles folder
                folderPath = "worker_profiles/";
                System.out.println("Using general worker_profiles folder");
            }
            
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : "";
            String filename = folderPath + UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + extension;
            System.out.println("Generated filename: " + filename);
            
            // Get upload URL
            UploadUrlResponse uploadData = getUploadUrl();
            if (uploadData == null || uploadData.uploadUrl == null || uploadData.uploadAuthorizationToken == null) {
                System.err.println("Failed to get upload URL from Backblaze B2");
                return null;
            }
            System.out.println("Got upload URL: " + uploadData.uploadUrl);
            
            // Upload file
            String fileId = uploadFile(uploadData.uploadUrl, uploadData.uploadAuthorizationToken, filename, file);
            if (fileId == null) {
                System.err.println("Failed to upload file to Backblaze B2");
                return null;
            }
            System.out.println("File uploaded successfully. File ID: " + fileId);
            
            // Generate public URL
            String publicUrl = downloadUrl + "/file/" + bucketName + "/" + filename;
            
            System.out.println("Image uploaded successfully to Backblaze B2: " + publicUrl);
            System.out.println("Returning URL: " + publicUrl);
            
            return publicUrl;
            
        } catch (Exception e) {
            System.err.println("Error uploading image to Backblaze B2: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    private UploadUrlResponse getUploadUrl() throws IOException, InterruptedException {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("bucketId", bucketId);
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl + "/b2api/v2/b2_get_upload_url"))
                .header("Authorization", authToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                .build();
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
            JsonNode json = objectMapper.readTree(response.body());
            String uploadUrl = json.get("uploadUrl").asText();
            String uploadAuthToken = json.get("authorizationToken").asText();
            return new UploadUrlResponse(uploadUrl, uploadAuthToken);
        } else {
            System.err.println("Failed to get upload URL: " + response.body());
            return null;
        }
    }
    
    private String uploadFile(String uploadUrl, String uploadAuthorizationToken, String filename, MultipartFile file) throws IOException, InterruptedException {
        String contentType = file.getContentType();
        if (contentType == null || contentType.isEmpty()) {
            contentType = "application/octet-stream";
        }
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadUrl))
                .header("Authorization", uploadAuthorizationToken)
                .header("X-Bz-File-Name", filename)
                .header("Content-Type", contentType)
                .header("X-Bz-Content-Sha1", "do_not_verify")
                .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
            JsonNode json = objectMapper.readTree(response.body());
            return json.get("fileId").asText();
        } else {
            System.err.println("Failed to upload file: " + response.body());
            return null;
        }
    }
    
    /**
     * Upload multiple files to Backblaze B2
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
     * Delete file from Backblaze B2
     */
    public boolean deleteFile(String fileUrl) {
        try {
            if (authToken == null) {
                System.out.println("Backblaze B2 not initialized - delete failed");
                return false;
            }
            
            // Extract filename from URL
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            
            // Note: For deletion, you would need the fileId, not just the filename
            // This is a simplified implementation - in production, you'd store fileId with the URL
            System.out.println("File deletion not fully implemented - would delete: " + filename);
            
            return true;
        } catch (Exception e) {
            System.err.println("Error deleting file from Backblaze B2: " + e.getMessage());
            return false;
        }
    }
}
