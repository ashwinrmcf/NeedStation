package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.ILocalStorageService;
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
public class LocalStorageService implements ILocalStorageService {

    @Value("${server.port:8080}")
    private String serverPort;
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    private static final String BASE_URL = "http://localhost";
    
    /**
     * Upload image to local storage and return Response with URL
     */
    @Override
    public Response uploadImage(MultipartFile file) {
        Response response = new Response();
        try {
            if (file == null || file.isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("File is null or empty");
                return response;
            }
            
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
            
            response.setStatusCode(200);
            response.setMessage("Image uploaded successfully");
            response.setToken(publicUrl);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error uploading image: " + e.getMessage());
        }
        return response;
    }
    
    /**
     * Upload multiple files to local storage
     */
    @Override
    public Response uploadMultipleFiles(Map<String, MultipartFile> files) {
        Response response = new Response();
        try {
            Map<String, String> uploadedUrls = new HashMap<>();
            
            if (files != null && !files.isEmpty()) {
                for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
                    String fieldName = entry.getKey();
                    MultipartFile file = entry.getValue();
                    
                    if (!file.isEmpty()) {
                        String fileName = generateUniqueFileName(file.getOriginalFilename());
                        Path filePath = createUploadPath().resolve(fileName);
                        
                        // Create directories if they don't exist
                        Files.createDirectories(filePath.getParent());
                        
                        // Copy file to the target location
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        
                        // Generate public URL
                        String publicUrl = BASE_URL + ":" + serverPort + "/uploads/" + fileName;
                        uploadedUrls.put(fieldName, publicUrl);
                    }
                }
            }
            
            FileUploadResponseDto fileUploadDto = new FileUploadResponseDto();
            fileUploadDto.setUploadedFiles(uploadedUrls);
            fileUploadDto.setTotalFiles(uploadedUrls.size());
            fileUploadDto.setSuccess(true);
            fileUploadDto.setBaseUrl(BASE_URL + ":" + serverPort);
            
            response.setFileUploadResponseDto(fileUploadDto);
            response.setStatusCode(200);
            response.setMessage("Files uploaded successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Failed to upload files: " + e.getMessage());
        }
        return response;
    }
    
    /**
     * Delete file from local storage
     */
    @Override
    public Response deleteFile(String fileUrl) {
        Response response = new Response();
        try {
            // Extract filename from URL
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, "worker_profiles", filename);
            
            boolean deleted = Files.deleteIfExists(filePath);
            
            if (deleted) {
                response.setStatusCode(200);
                response.setMessage("File deleted successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("File not found or already deleted");
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error deleting file: " + e.getMessage());
        }
        return response;
    }

    private String generateUniqueFileName(String originalFilename) {
        String extension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : "";
        return UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + extension;
    }

    private Path createUploadPath() {
        return Paths.get(uploadDir);
    }
}
