package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IGoogleTranslateService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import org.springframework.stereotype.Service;

@Service
public class GoogleTranslateService implements IGoogleTranslateService {

    @Value("${google.translate.api.key:}")
    private String apiKey;
    
    private final String ENDPOINT = "https://translation.googleapis.com/language/translate/v2";
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public Response translateTexts(TranslateRequestDto request) {
        Response response = new Response();
        try {
            if (apiKey == null || apiKey.isEmpty()) {
                response.setStatusCode(500);
                response.setMessage("Google Translate API key not configured");
                return response;
            }

            if (request.getTexts() == null || request.getTexts().isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("Texts list cannot be empty");
                return response;
            }

            String url = ENDPOINT + "?key=" + apiKey;

            Map<String, Object> body = new HashMap<>();
            body.put("q", request.getTexts());
            body.put("target", request.getTargetLang());
            if (request.getSourceLang() != null && !request.getSourceLang().isEmpty()) {
                body.put("source", request.getSourceLang());
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            String responseBody = restTemplate.postForObject(url, entity, String.class);
            
            if (responseBody != null) {
                JSONObject json = new JSONObject(responseBody);
                JSONArray translations = json.getJSONObject("data").getJSONArray("translations");
                
                List<String> translatedTexts = new ArrayList<>();
                String detectedSourceLang = null;
                
                for (int i = 0; i < translations.length(); i++) {
                    JSONObject translation = translations.getJSONObject(i);
                    translatedTexts.add(translation.getString("translatedText"));
                    
                    if (detectedSourceLang == null && translation.has("detectedSourceLanguage")) {
                        detectedSourceLang = translation.getString("detectedSourceLanguage");
                    }
                }
                
                TranslateResponseDto translateDto = new TranslateResponseDto();
                translateDto.setTranslatedTexts(translatedTexts);
                translateDto.setTargetLang(request.getTargetLang());
                translateDto.setSourceLang(detectedSourceLang != null ? detectedSourceLang : request.getSourceLang());
                translateDto.setTotalTexts(translatedTexts.size());
                translateDto.setSuccess(true);
                
                response.setTranslateResponseDto(translateDto);
                response.setStatusCode(200);
                response.setMessage("Translation completed successfully");
            } else {
                response.setStatusCode(500);
                response.setMessage("Google Translate API returned null response");
            }

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Translation failed: " + e.getMessage());
        }
        return response;
    }
}
