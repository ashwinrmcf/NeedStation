package com.example.authbackend.controller;

import com.example.authbackend.dto.ChatbotResponse;
import com.example.authbackend.model.ChatRequest;
import com.example.authbackend.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @Autowired
    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<ChatbotResponse> getChatbotResponse(@RequestBody ChatRequest request) { // Changed back to ChatRequest
        ChatbotResponse response = chatbotService.processQuery(request.getMessage()); // Use getMessage()
        return ResponseEntity.ok(response);
    }
}
