package com.example.authbackend.service;

import com.example.authbackend.dto.ContactSubmissionDTO;
import com.example.authbackend.entity.ContactSubmission;
import com.example.authbackend.repository.ContactSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContactSubmissionService {

    @Autowired
    private ContactSubmissionRepository contactSubmissionRepository;

    public ContactSubmission saveContactSubmission(ContactSubmissionDTO contactDTO) {
        ContactSubmission contactSubmission = new ContactSubmission(
            contactDTO.getName(),
            contactDTO.getEmail(),
            contactDTO.getSubject(),
            contactDTO.getMessage()
        );
        
        return contactSubmissionRepository.save(contactSubmission);
    }

    public List<ContactSubmission> getAllSubmissions() {
        return contactSubmissionRepository.findAll();
    }

    public List<ContactSubmission> getUnresolvedSubmissions() {
        return contactSubmissionRepository.findByIsResolvedFalseOrderBySubmittedAtDesc();
    }

    public List<ContactSubmission> getResolvedSubmissions() {
        return contactSubmissionRepository.findByIsResolvedTrueOrderBySubmittedAtDesc();
    }

    public List<ContactSubmission> getSubmissionsByEmail(String email) {
        return contactSubmissionRepository.findByEmailOrderBySubmittedAtDesc(email);
    }

    public Optional<ContactSubmission> getSubmissionById(Long id) {
        return contactSubmissionRepository.findById(id);
    }

    public ContactSubmission markAsResolved(Long id, String adminNotes) {
        Optional<ContactSubmission> optionalSubmission = contactSubmissionRepository.findById(id);
        if (optionalSubmission.isPresent()) {
            ContactSubmission submission = optionalSubmission.get();
            submission.setIsResolved(true);
            submission.setResolvedAt(LocalDateTime.now());
            submission.setAdminNotes(adminNotes);
            return contactSubmissionRepository.save(submission);
        }
        return null;
    }

    public long getUnresolvedCount() {
        return contactSubmissionRepository.countByIsResolvedFalse();
    }

    public List<ContactSubmission> searchBySubject(String keyword) {
        return contactSubmissionRepository.findBySubjectContainingIgnoreCaseOrderBySubmittedAtDesc(keyword);
    }

    public List<ContactSubmission> getSubmissionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return contactSubmissionRepository.findBySubmittedAtBetween(startDate, endDate);
    }
}
