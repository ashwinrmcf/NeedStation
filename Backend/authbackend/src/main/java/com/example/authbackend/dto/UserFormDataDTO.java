package com.example.authbackend.dto;

public class UserFormDataDTO {
    private String userIdentifier; // email or username
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

    // Constructors
    public UserFormDataDTO() {}

    public UserFormDataDTO(String userIdentifier, String address, String landmark, String pincode,
                          String contactNumber, String alternateContact, String preferredDate, String preferredTime, 
                          String workDetails, Double locationLat, 
                          Double locationLng, String locationAddress) {
        this.userIdentifier = userIdentifier;
        this.address = address;
        this.landmark = landmark;
        this.pincode = pincode;
        this.contactNumber = contactNumber;
        this.alternateContact = alternateContact;
        this.preferredDate = preferredDate;
        this.preferredTime = preferredTime;
        this.workDetails = workDetails;
        this.locationLat = locationLat;
        this.locationLng = locationLng;
        this.locationAddress = locationAddress;
    }

    // Getters and setters
    public String getUserIdentifier() {
        return userIdentifier;
    }

    public void setUserIdentifier(String userIdentifier) {
        this.userIdentifier = userIdentifier;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getAlternateContact() {
        return alternateContact;
    }

    public void setAlternateContact(String alternateContact) {
        this.alternateContact = alternateContact;
    }

    public String getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(String preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPreferredTime() {
        return preferredTime;
    }

    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }

    public String getWorkDetails() {
        return workDetails;
    }

    public void setWorkDetails(String workDetails) {
        this.workDetails = workDetails;
    }


    public Double getLocationLat() {
        return locationLat;
    }

    public void setLocationLat(Double locationLat) {
        this.locationLat = locationLat;
    }

    public Double getLocationLng() {
        return locationLng;
    }

    public void setLocationLng(Double locationLng) {
        this.locationLng = locationLng;
    }

    public String getLocationAddress() {
        return locationAddress;
    }

    public void setLocationAddress(String locationAddress) {
        this.locationAddress = locationAddress;
    }
}
