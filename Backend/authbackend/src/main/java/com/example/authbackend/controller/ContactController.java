package com.example.authbackend.controller;

import com.example.authbackend.dto.ContactRequest;
import com.example.authbackend.dto.ContactResponse;
import com.example.authbackend.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/contact")
    public ResponseEntity<ContactResponse> submitContact(@RequestBody ContactRequest contactRequest) {
        try {
            ContactResponse response = contactService.processContactForm(contactRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ContactResponse errorResponse = new ContactResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to send message: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/contact/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Contact service is running");
    }
}
