package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LocationDTO {
    private String userIdentifier; // email or username
    private Double lat;
    private Double lng;
    private String address;
    
    // Explicit getter for userIdentifier to ensure compilation
    public String getUserIdentifier() {
        return userIdentifier;
    }
    
    public void setUserIdentifier(String userIdentifier) {
        this.userIdentifier = userIdentifier;
    }
}
