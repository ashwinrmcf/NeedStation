package com.example.authbackend.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import org.springframework.stereotype.Service;

@Service
public class GoogleTranslateService {

    private final String API_KEY = "AIzaSyDaEJ4vo3cRDG90bsEVw2C98QNQlP5Ai6o";
    private final String ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

    public List<String> translateTexts(List<String> texts, String targetLang) {
        List<String> results = new ArrayList<>();
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = ENDPOINT + "?key=" + API_KEY;

            Map<String, Object> body = new HashMap<>();
            body.put("q", texts);
            body.put("target", targetLang);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            JSONObject json = new JSONObject(response.getBody());

            JSONArray translations = json.getJSONObject("data").getJSONArray("translations");
            for (int i = 0; i < translations.length(); i++) {
                results.add(translations.getJSONObject(i).getString("translatedText"));
            }

        } catch (Exception e) {
            e.printStackTrace();
            results = texts; // fallback to original
        }
        return results;
    }
}
