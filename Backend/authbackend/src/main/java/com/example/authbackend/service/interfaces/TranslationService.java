package com.example.authbackend.service.interfaces;

import java.util.List;

/**
 * Interface for translation services
 * Abstracts different translation providers (Google Translate, etc.)
 */
public interface TranslationService {
    
    /**
     * Translate multiple texts to target language
     * @param texts List of texts to translate
     * @param targetLanguage Target language code (e.g., "hi", "es", "fr")
     * @return List of translated texts
     */
    List<String> translateTexts(List<String> texts, String targetLanguage);
    
    /**
     * Translate single text to target language
     * @param text Text to translate
     * @param targetLanguage Target language code
     * @return Translated text
     */
    default String translateText(String text, String targetLanguage) {
        List<String> texts = List.of(text);
        List<String> translations = translateTexts(texts, targetLanguage);
        return translations.isEmpty() ? text : translations.get(0);
    }
    
    /**
     * Translate texts from source to target language
     * @param texts List of texts to translate
     * @param sourceLanguage Source language code
     * @param targetLanguage Target language code
     * @return List of translated texts
     */
    default List<String> translateTexts(List<String> texts, String sourceLanguage, String targetLanguage) {
        // Default implementation ignores source language
        return translateTexts(texts, targetLanguage);
    }
    
    /**
     * Check if the translation service is properly configured
     * @return true if service is ready to translate
     */
    boolean isConfigured();
    
    /**
     * Get supported language codes
     * @return List of supported language codes
     */
    default List<String> getSupportedLanguages() {
        return List.of("en", "hi", "es", "fr", "de", "it", "pt", "ru", "ja", "ko", "zh");
    }
}
