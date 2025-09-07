package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.ContactRequestDto;
import com.example.authbackend.dto.Response;

public interface IContactService {
    
    Response processContactForm(ContactRequestDto contactRequest);
}
