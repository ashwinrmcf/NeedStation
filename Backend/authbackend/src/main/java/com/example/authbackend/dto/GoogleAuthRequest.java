package com.example.authbackend.dto;

public class GoogleAuthRequest {
    private String idToken;
    private String email;
    private String name;
    private String picture;

    // Default constructor
    public GoogleAuthRequest() {}

    public GoogleAuthRequest(String idToken, String email, String name, String picture) {
        this.idToken = idToken;
        this.email = email;
        this.name = name;
        this.picture = picture;
    }

    // Getters and Setters
    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
