package com.example.authbackend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    /**
     * Upload profile picture to Cloudinary
     */
    public String uploadProfilePicture(MultipartFile file, String workerId) throws IOException {
        try {
            // Create a unique public ID for the image
            String publicId = "worker_profiles/worker_" + workerId + "_" + System.currentTimeMillis();
            
            // Upload options
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "needstation/worker_profiles",
                "resource_type", "image",
                "format", "jpg",
                "quality", "auto:good",
                "width", 400,
                "height", 400,
                "crop", "fill",
                "gravity", "face"
            );
            
            // Upload to Cloudinary
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
            
            // Return the secure URL
            String imageUrl = (String) uploadResult.get("secure_url");
            
            System.out.println("Successfully uploaded profile picture to Cloudinary: " + imageUrl);
            return imageUrl;
            
        } catch (IOException e) {
            System.err.println("Failed to upload profile picture to Cloudinary: " + e.getMessage());
            throw new IOException("Failed to upload profile picture: " + e.getMessage(), e);
        }
    }

    /**
     * Delete profile picture from Cloudinary
     */
    public boolean deleteProfilePicture(String publicId) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");
            return "ok".equals(resultStatus);
        } catch (Exception e) {
            System.err.println("Failed to delete profile picture from Cloudinary: " + e.getMessage());
            return false;
        }
    }

    /**
     * Upload any file to Cloudinary (for certificates, ID proofs, etc.)
     */
    public String uploadFile(MultipartFile file, String folder, String publicIdPrefix) throws IOException {
        try {
            String publicId = publicIdPrefix + "_" + System.currentTimeMillis();
            
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "needstation/" + folder,
                "resource_type", "auto"
            );
            
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
            String fileUrl = (String) uploadResult.get("secure_url");
            
            System.out.println("Successfully uploaded file to Cloudinary: " + fileUrl);
            return fileUrl;
            
        } catch (IOException e) {
            System.err.println("Failed to upload file to Cloudinary: " + e.getMessage());
            throw new IOException("Failed to upload file: " + e.getMessage(), e);
        }
    }
}
