package com.example.authbackend.service.interfac;

import com.example.authbackend.dto.TranslateRequestDto;
import com.example.authbackend.dto.Response;

public interface IGoogleTranslateService {
    
    Response translateTexts(TranslateRequestDto request);
}
