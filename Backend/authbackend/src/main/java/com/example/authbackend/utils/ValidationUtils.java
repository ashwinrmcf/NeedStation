package com.example.authbackend.utils;

import java.util.regex.Pattern;

public class ValidationUtils {

    private static final String EMAIL_PATTERN = 
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
    
    private static final String PHONE_PATTERN = "^[+]?[0-9]{10,15}$";
    
    private static final Pattern emailPattern = Pattern.compile(EMAIL_PATTERN);
    private static final Pattern phonePattern = Pattern.compile(PHONE_PATTERN);

    public static boolean isValidEmail(String email) {
        return email != null && emailPattern.matcher(email).matches();
    }

    public static boolean isValidPhone(String phone) {
        return phone != null && phonePattern.matcher(phone).matches();
    }

    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 6;
    }

    public static boolean isValidOtp(String otp) {
        return otp != null && otp.matches("^[0-9]{6}$");
    }

    public static boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

    public static String formatPhoneNumber(String phone) {
        if (phone == null) return null;
        
        // Remove all non-digit characters
        String cleanPhone = phone.replaceAll("[^0-9]", "");
        
        // Add country code for India if not present
        if (cleanPhone.length() == 10) {
            cleanPhone = "91" + cleanPhone;
        }
        
        return cleanPhone;
    }
}
