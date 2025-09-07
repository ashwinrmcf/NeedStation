package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserFormDataDTO {
    private String userIdentifier; 
    private String address;
    private String landmark;
    private String pincode;
    private String contactNumber;
    private String alternateContact;
    private String preferredDate;
    private String preferredTime;
    private String workDetails;
    private Double locationLat;
    private Double locationLng;
    private String locationAddress;
    
    // Explicit getter for userIdentifier to ensure compilation
    public String getUserIdentifier() {
        return userIdentifier;
    }
    
    public void setUserIdentifier(String userIdentifier) {
        this.userIdentifier = userIdentifier;
    }
}
