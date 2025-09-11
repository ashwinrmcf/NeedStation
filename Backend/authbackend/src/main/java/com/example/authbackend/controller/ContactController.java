package com.example.authbackend.controller;

import com.example.authbackend.dto.ContactRequest;
import com.example.authbackend.dto.ContactResponse;
import com.example.authbackend.entity.ContactSubmission;
import com.example.authbackend.service.ContactService;
import com.example.authbackend.service.ContactSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    private ContactSubmissionService contactSubmissionService;

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

    // Admin endpoints for managing contact submissions
    @GetMapping("/admin/contact/submissions")
    public ResponseEntity<List<ContactSubmission>> getAllSubmissions() {
        try {
            List<ContactSubmission> submissions = contactSubmissionService.getAllSubmissions();
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/contact/submissions/unresolved")
    public ResponseEntity<List<ContactSubmission>> getUnresolvedSubmissions() {
        try {
            List<ContactSubmission> submissions = contactSubmissionService.getUnresolvedSubmissions();
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/contact/submissions/count")
    public ResponseEntity<Map<String, Long>> getSubmissionCount() {
        try {
            long unresolvedCount = contactSubmissionService.getUnresolvedCount();
            return ResponseEntity.ok(Map.of("unresolved", unresolvedCount));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/admin/contact/submissions/{id}/resolve")
    public ResponseEntity<ContactSubmission> markAsResolved(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String adminNotes = request.get("adminNotes");
            ContactSubmission resolved = contactSubmissionService.markAsResolved(id, adminNotes);
            if (resolved != null) {
                return ResponseEntity.ok(resolved);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
