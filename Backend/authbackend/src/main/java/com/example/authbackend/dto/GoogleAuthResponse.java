package com.example.authbackend.dto;

public class GoogleAuthResponse {
    private boolean success;
    private String message;
    private String token;
    private UserInfo user;

    // Default constructor
    public GoogleAuthResponse() {}

    public GoogleAuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public GoogleAuthResponse(boolean success, String message, String token, UserInfo user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    // Inner class for user information
    public static class UserInfo {
        private String email;
        private String name;
        private String firstName;
        private String lastName;
        private String picture;

        public UserInfo() {}

        public UserInfo(String email, String name, String picture) {
            this.email = email;
            this.name = name;
            this.picture = picture;
        }
        
        public UserInfo(String email, String firstName, String lastName, String picture) {
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.name = (firstName + " " + lastName).trim();
            this.picture = picture;
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
        
        public String getFirstName() {
            return firstName;
        }
        
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
        
        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
    }
}
