package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.ContactRequestDto;
import com.example.authbackend.dto.Response;

public interface IFirebaseEmailService {
    
    Response sendContactFormViaFirebase(ContactRequestDto contactRequest);
}
