package com.example.authbackend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Step 1: Basic Information
    @Column(nullable = false)
    private String fullName = "";
    
    // Explicit getters and setters for critical fields to ensure compilation
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    // Explicit getter and setter for fullName to ensure compilation
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    @Column(nullable = false)
    private String gender = "";
    
    // Explicit getter and setter for gender to ensure compilation
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(nullable = false)
    private LocalDate dob = LocalDate.now();
    
    // Explicit getter and setter for dob to ensure compilation
    public LocalDate getDob() {
        return dob;
    }
    
    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    @Column(length = 500)
    private String profileImageUrl = "";
    
    // Explicit getter and setter for profileImageUrl to ensure compilation
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    @Column(unique = true, nullable = false)
    private String phone = "";
    
    // Explicit getter and setter for phone to ensure compilation
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }

    private String email = "";
    private String whatsappNumber = "";
    
    // Explicit getter and setter for whatsappNumber to ensure compilation
    public String getWhatsappNumber() {
        return whatsappNumber;
    }
    
    public void setWhatsappNumber(String whatsappNumber) {
        this.whatsappNumber = whatsappNumber;
    }
    
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
    private LocalDateTime otpVerifiedAt;
    private Boolean phoneVerified = false;
    private Integer otpAttempts = 0; // Track failed attempts for security
    
    // Explicit getters and setters for OTP fields to ensure compilation
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
    
    public LocalDateTime getOtpVerifiedAt() {
        return otpVerifiedAt;
    }
    
    public void setOtpVerifiedAt(LocalDateTime otpVerifiedAt) {
        this.otpVerifiedAt = otpVerifiedAt;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
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

}
