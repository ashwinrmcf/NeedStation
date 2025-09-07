package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.Response;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ILocalStorageService {
    
    Response uploadImage(MultipartFile file);
    
    Response uploadMultipleFiles(Map<String, MultipartFile> files);
    
    Response deleteFile(String fileUrl);
}
