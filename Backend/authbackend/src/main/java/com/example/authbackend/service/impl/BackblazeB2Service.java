package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IBackblazeB2Service;
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
public class BackblazeB2Service implements IBackblazeB2Service {

    @Value("${backblaze.application-key-id:}")
    private String applicationKeyId;
    
    @Value("${backblaze.application-key:}")
    private String applicationKey;
    
    @Value("${backblaze.bucket-id:}")
    private String bucketId;
    
    @Value("${backblaze.bucket-name:}")
    private String bucketName;
    
    private String authorizationToken;
    private String apiUrl;
    private String downloadUrl;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();
    
    // Holds the upload URL and its corresponding upload authorization token
    private static class UploadUrlResponse {
        String uploadUrl;
        String uploadAuthorizationToken;
        UploadUrlResponse(String uploadUrl, String uploadAuthorizationToken) {
            this.uploadUrl = uploadUrl;
            this.uploadAuthorizationToken = uploadAuthorizationToken;
        }
    }
    
    @PostConstruct
    public void initialize() {
        try {
            if (applicationKeyId != null && !applicationKeyId.isEmpty() && 
                applicationKey != null && !applicationKey.isEmpty()) {
                authorizeAccount();
                System.out.println("Backblaze B2 service initialized successfully");
            } else {
                System.out.println("Backblaze B2 credentials not configured, service will be disabled");
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize Backblaze B2 service: " + e.getMessage());
        }
    }
    
    private void authorizeAccount() throws IOException, InterruptedException {
        String credentials = Base64.getEncoder().encodeToString((applicationKeyId + ":" + applicationKey).getBytes());
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.backblazeb2.com/b2api/v2/b2_authorize_account"))
                .header("Authorization", "Basic " + credentials)
                .GET()
                .build();
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
            JsonNode jsonResponse = objectMapper.readTree(response.body());
            this.authorizationToken = jsonResponse.get("authorizationToken").asText();
            this.apiUrl = jsonResponse.get("apiUrl").asText();
            this.downloadUrl = jsonResponse.get("downloadUrl").asText();
            System.out.println("Backblaze B2 authorization successful");
        } else {
            throw new IOException("Failed to authorize Backblaze B2 account: " + response.body());
        }
    }
    
    private UploadUrlResponse getUploadUrl() throws IOException, InterruptedException {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("bucketId", bucketId);
        
        String jsonBody = objectMapper.writeValueAsString(requestBody);
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl + "/b2api/v2/b2_get_upload_url"))
                .header("Authorization", authorizationToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
            JsonNode jsonResponse = objectMapper.readTree(response.body());
            String uploadUrl = jsonResponse.get("uploadUrl").asText();
            String uploadAuthToken = jsonResponse.get("authorizationToken").asText();
            return new UploadUrlResponse(uploadUrl, uploadAuthToken);
        } else {
            throw new IOException("Failed to get upload URL: " + response.body());
        }
    }
    
    @Override
    public Response uploadImage(MultipartFile file) {
        Response response = new Response();
        try {
            if (authorizationToken == null) {
                response.setStatusCode(500);
                response.setMessage("Backblaze B2 service not initialized");
                return response;
            }
            
            UploadUrlResponse uploadUrlResponse = getUploadUrl();
            
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String contentType = file.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrlResponse.uploadUrl))
                    .header("Authorization", uploadUrlResponse.uploadAuthorizationToken)
                    .header("X-Bz-File-Name", fileName)
                    .header("Content-Type", contentType)
                    .header("X-Bz-Content-Sha1", "unverified")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();
            
            HttpResponse<String> httpResponse = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (httpResponse.statusCode() == 200) {
                JsonNode jsonResponse = objectMapper.readTree(httpResponse.body());
                String fileId = jsonResponse.get("fileId").asText();
                String uploadedFileName = jsonResponse.get("fileName").asText();
                
                // Return the public download URL
                String imageUrl = downloadUrl + "/file/" + bucketName + "/" + uploadedFileName;
                
                BackblazeResponseDto backblazeDto = new BackblazeResponseDto();
                backblazeDto.setFileId(fileId);
                backblazeDto.setFileName(uploadedFileName);
                backblazeDto.setFileUrl(imageUrl);
                backblazeDto.setContentType(contentType);
                backblazeDto.setFileSize(file.getSize());
                backblazeDto.setSuccess(true);
                
                response.setBackblazeResponseDto(backblazeDto);
                response.setStatusCode(200);
                response.setMessage("File uploaded successfully");
            } else {
                response.setStatusCode(500);
                response.setMessage("Failed to upload file: " + httpResponse.body());
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Upload failed: " + e.getMessage());
        }
        return response;
    }
    
    @Override
    public Response uploadMultipleFiles(Map<String, MultipartFile> files) {
        Response response = new Response();
        try {
            Map<String, String> uploadedUrls = new HashMap<>();
            
            for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
                String key = entry.getKey();
                MultipartFile file = entry.getValue();
                
                if (file != null && !file.isEmpty()) {
                    Response uploadResponse = uploadImage(file);
                    if (uploadResponse.getStatusCode() == 200) {
                        uploadedUrls.put(key, uploadResponse.getBackblazeResponseDto().getFileUrl());
                    } else {
                        response.setStatusCode(500);
                        response.setMessage("Failed to upload " + key + ": " + uploadResponse.getMessage());
                        return response;
                    }
                }
            }
            
            BackblazeResponseDto backblazeDto = new BackblazeResponseDto();
            backblazeDto.setUploadedFiles(uploadedUrls);
            backblazeDto.setTotalFiles(uploadedUrls.size());
            backblazeDto.setSuccess(true);
            
            response.setBackblazeResponseDto(backblazeDto);
            response.setStatusCode(200);
            response.setMessage("All files uploaded successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Multiple file upload failed: " + e.getMessage());
        }
        return response;
    }
}
