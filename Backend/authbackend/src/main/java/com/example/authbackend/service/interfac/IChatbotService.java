package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.Response;

public interface IChatbotService {
    
    Response processQuery(String query);
}
