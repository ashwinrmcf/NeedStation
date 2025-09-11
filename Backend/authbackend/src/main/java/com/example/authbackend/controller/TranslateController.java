package com.example.authbackend.controller;

import com.example.authbackend.model.TranslateRequest;
import com.example.authbackend.service.GoogleTranslateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.*;

@RestController
@RequestMapping("/api/translate")
public class TranslateController {

    @Autowired
    private GoogleTranslateService translationService;

    @PostMapping("/batch")
    public ResponseEntity<Map<String, List<String>>> translateBatch(@RequestBody TranslateRequest request) {
        List<String> translatedTexts = translationService.translateTexts(request.getTexts(), request.getLang());
        return ResponseEntity.ok(Collections.singletonMap("translations", translatedTexts));
    }
}
