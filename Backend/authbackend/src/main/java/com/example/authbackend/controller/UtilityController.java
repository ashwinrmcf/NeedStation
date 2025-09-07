package com.example.authbackend.controller;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IChatbotService;
import com.example.authbackend.service.interfac.IContactService;
import com.example.authbackend.service.interfac.IGoogleTranslateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UtilityController {

    @Autowired
    private IChatbotService iChatbotService;

    @Autowired
    private IContactService iContactService;

    @Autowired
    private IGoogleTranslateService iGoogleTranslateService;

    // Chatbot endpoints
    @PostMapping("/chatbot")
    public Response getChatbotResponse(@RequestParam String message) {
        return iChatbotService.processQuery(message);
    }

    // Contact endpoints
    @PostMapping("/contact/submitContact")
    public Response submitContact(@RequestBody ContactRequestDto contactRequest) {
        return iContactService.processContactForm(contactRequest);
    }

    // Translation endpoints
    @PostMapping("/translate/batch")
    public Response translateBatch(@RequestBody TranslateRequestDto request) {
        return iGoogleTranslateService.translateTexts(request);
    }
}
