package com.example.authbackend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker")
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Step 1: Basic Information
    @Column(nullable = false)
    private String fullName = "";
    
    @Column(nullable = false)
    private String gender = "";

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(nullable = false)
    private LocalDate dob = LocalDate.now();

    @Column(length = 500)
    private String profileImageUrl = "";

    @Column(unique = true, nullable = false)
    private String phone = "";

    private String email = "";
    private String whatsappNumber = "";
    
    // Step 2: Contact Information
    private String permanentAddress = "";
    private String currentAddress = "";
    private String city = "";
    private String pincode = "";
    
    // Service areas (comma-separated)
    private String serviceAreas = "";
    
    @Column(nullable = false)
    private Boolean openToTravel = false;
    
    // Step 3: Professional Details
    // Stored as JSON strings for flexibility
    @Column(columnDefinition = "TEXT")
    private String services = "{}"; // JSON of selected services
    
    private String experience = "";
    private String workType = ""; // Part-time, Full-time, Weekends

    @Column(columnDefinition = "TEXT")
    private String availability = "{}"; // JSON of availability days/times
    
    @Column(columnDefinition = "TEXT")
    private String languages = "{}"; // JSON of languages
    
    // Step 4: Verification
    private String aadharNumber = "";
    private String policeVerificationStatus = "PENDING";
    @Column(length = 500)
    private String idProofUrl = "";
    @Column(length = 500)
    private String selfieWithIdUrl = "";
    
    @Column(columnDefinition = "TEXT")
    private String certificateUrls = "{}"; // JSON array of certificate URLs
    
    // Step 5: Payment Information
    private String paymentMode = ""; // UPI, Bank Transfer, Cash
    private String upiId = "";
    private String bankName = "";
    private String accountNumber = "";
    private String ifscCode = "";
    private String panCard = "";
    
    // Emergency Contact
    private String emergencyContactName = "";
    private String emergencyContactNumber = "";
    
    // Registration status
    @Column(nullable = false)
    private String registrationStatus = "INCOMPLETE"; // INCOMPLETE, PENDING_VERIFICATION, VERIFIED, REJECTED
    @Column(nullable = false)
    private LocalDate registrationDate = LocalDate.now();
    private LocalDate verificationDate;
    
    // OTP verification fields
    private String phoneVerificationOtp;
    private LocalDateTime otpCreatedAt;
    private LocalDateTime otpExpiresAt;
    private Boolean phoneVerified = false;
    private Integer otpAttempts = 0; // Track failed attempts for security

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

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
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
    
    public String getPhoneVerificationOtp() {
        return phoneVerificationOtp;
    }

    public void setPhoneVerificationOtp(String phoneVerificationOtp) {
        this.phoneVerificationOtp = phoneVerificationOtp;
    }

    public LocalDateTime getOtpCreatedAt() {
        return otpCreatedAt;
    }

    public void setOtpCreatedAt(LocalDateTime otpCreatedAt) {
        this.otpCreatedAt = otpCreatedAt;
    }

    public LocalDateTime getOtpExpiresAt() {
        return otpExpiresAt;
    }

    public void setOtpExpiresAt(LocalDateTime otpExpiresAt) {
        this.otpExpiresAt = otpExpiresAt;
    }

    public Boolean getPhoneVerified() {
        return phoneVerified;
    }

    public void setPhoneVerified(Boolean phoneVerified) {
        this.phoneVerified = phoneVerified;
    }

    public Integer getOtpAttempts() {
        return otpAttempts;
    }

    public void setOtpAttempts(Integer otpAttempts) {
        this.otpAttempts = otpAttempts;
    }

    // Missing getter/setter methods for WorkerService compatibility
    public String getAddress() {
        return permanentAddress;
    }

    public void setAddress(String address) {
        this.permanentAddress = address;
    }

    public String getState() {
        return ""; // Add state field if needed
    }

    public void setState(String state) {
        // Add state field if needed
    }

    public String getLocality() {
        return ""; // Add locality field if needed
    }

    public void setLocality(String locality) {
        // Add locality field if needed
    }

    public String getWorkExperience() {
        return experience;
    }

    public void setWorkExperience(String workExperience) {
        this.experience = workExperience;
    }

    public String getEducation() {
        return ""; // Add education field if needed
    }

    public void setEducation(String education) {
        // Add education field if needed
    }

    public Worker() {
    }

    public Worker(Long id, String fullName, String gender, LocalDate dob, String profileImageUrl, String phone, String email, String whatsappNumber) {
        this.id = id;
        this.fullName = fullName;
        this.gender = gender;
        this.dob = dob;
        this.profileImageUrl = profileImageUrl;
        this.phone = phone;
        this.email = email;
        this.whatsappNumber = whatsappNumber;
    }
}
