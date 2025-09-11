package com.example.authbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

// This class has been deprecated in favor of com.example.authbackend.model.Worker
// Removing @Entity annotation to avoid duplicate entity name error
public class WorkerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Step 1: Basic Information
    private String fullName;
    private String gender;
    private LocalDate dob;
    private String phone;
    private String email;
    private String whatsappNumber;
    private String profilePictureUrl;
    private Boolean otpVerified;
    
    // Step 2: Contact Information
    private String permanentAddress;
    private String currentAddress;
    private String city;
    private String pincode;
    
    // Service areas (comma-separated)
    private String serviceAreas;
    private Boolean openToTravel;
    
    // Step 3: Professional Details
    // Stored as JSON strings for flexibility
    @Column(columnDefinition = "TEXT")
    private String services; // JSON of selected services
    private String experience;
    private String workType; // Part-time, Full-time, Weekends

    @Column(columnDefinition = "TEXT")
    private String availability; // JSON of availability days/times
    
    @Column(columnDefinition = "TEXT")
    private String languages; // JSON of languages
    
    // Step 4: Verification
    private String aadharNumber;
    private String policeVerificationStatus;
    private String idProofUrl;
    private String selfieWithIdUrl;
    
    @Column(columnDefinition = "TEXT")
    private String certificateUrls; // JSON array of certificate URLs
    
    // Step 5: Payment Information
    private String paymentMode; // UPI or Bank Transfer
    private String upiId;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String panCard;
    
    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactNumber;
    
    // Registration status
    private String registrationStatus = "INCOMPLETE"; // INCOMPLETE, PENDING_VERIFICATION, VERIFIED, REJECTED
    private LocalDate registrationDate;
    private LocalDate verificationDate;

    // Default constructor
    public WorkerEntity() {
        this.registrationDate = LocalDate.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWhatsappNumber() {
        return whatsappNumber;
    }

    public void setWhatsappNumber(String whatsappNumber) {
        this.whatsappNumber = whatsappNumber;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public Boolean getOtpVerified() {
        return otpVerified;
    }

    public void setOtpVerified(Boolean otpVerified) {
        this.otpVerified = otpVerified;
    }

    public String getPermanentAddress() {
        return permanentAddress;
    }

    public void setPermanentAddress(String permanentAddress) {
        this.permanentAddress = permanentAddress;
    }

    public String getCurrentAddress() {
        return currentAddress;
    }

    public void setCurrentAddress(String currentAddress) {
        this.currentAddress = currentAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getServiceAreas() {
        return serviceAreas;
    }

    public void setServiceAreas(String serviceAreas) {
        this.serviceAreas = serviceAreas;
    }

    public Boolean getOpenToTravel() {
        return openToTravel;
    }

    public void setOpenToTravel(Boolean openToTravel) {
        this.openToTravel = openToTravel;
    }

    public String getServices() {
        return services;
    }

    public void setServices(String services) {
        this.services = services;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public String getAadharNumber() {
        return aadharNumber;
    }

    public void setAadharNumber(String aadharNumber) {
        this.aadharNumber = aadharNumber;
    }

    public String getPoliceVerificationStatus() {
        return policeVerificationStatus;
    }

    public void setPoliceVerificationStatus(String policeVerificationStatus) {
        this.policeVerificationStatus = policeVerificationStatus;
    }

    public String getIdProofUrl() {
        return idProofUrl;
    }

    public void setIdProofUrl(String idProofUrl) {
        this.idProofUrl = idProofUrl;
    }

    public String getSelfieWithIdUrl() {
        return selfieWithIdUrl;
    }

    public void setSelfieWithIdUrl(String selfieWithIdUrl) {
        this.selfieWithIdUrl = selfieWithIdUrl;
    }

    public String getCertificateUrls() {
        return certificateUrls;
    }

    public void setCertificateUrls(String certificateUrls) {
        this.certificateUrls = certificateUrls;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public String getPanCard() {
        return panCard;
    }

    public void setPanCard(String panCard) {
        this.panCard = panCard;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }

    public String getEmergencyContactNumber() {
        return emergencyContactNumber;
    }

    public void setEmergencyContactNumber(String emergencyContactNumber) {
        this.emergencyContactNumber = emergencyContactNumber;
    }

    public String getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(String registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public LocalDate getVerificationDate() {
        return verificationDate;
    }

    public void setVerificationDate(LocalDate verificationDate) {
        this.verificationDate = verificationDate;
    }
}
