package com.example.authbackend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker")
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Agency relationship
    @Column(name = "agency_id", nullable = false)
    private Long agencyId;

    // Personal Information
    @Column(name = "full_name", length = 255, nullable = false)
    private String fullName = "";
    
    private String email = "";
    
    @Column(unique = true, nullable = false, length = 20)
    private String phone = "";
    
    @Column(name = "alternate_phone", length = 20)
    private String alternatePhone = "";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth = LocalDate.of(2000, 1, 1);
    
    // Legacy dob field for database compatibility
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "dob", nullable = false)
    private LocalDate dob = LocalDate.of(2000, 1, 1);

    // Address Information
    @Column(name = "current_address", columnDefinition = "TEXT", nullable = false)
    private String currentAddress = "";
    
    @Column(name = "permanent_address", columnDefinition = "TEXT")
    private String permanentAddress = "";
    
    @Column(length = 100, nullable = false)
    private String city = "";
    
    @Column(length = 10, nullable = false)
    private String pincode = "";
    
    // Professional Information
    @Enumerated(EnumType.STRING)
    @Column(name = "worker_type", nullable = false)
    private WorkerType workerType;
    
    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears = 0;
    
    @Column(columnDefinition = "JSON")
    private String specializations = "[]";
    
    @Column(columnDefinition = "JSON")
    private String languages = "[]";
    
    @Column(name = "education_qualification", length = 255)
    private String educationQualification = "";
    
    @Column(columnDefinition = "JSON")
    private String certifications = "[]";
    
    // Verification
    @Column(name = "aadhar_number", length = 20, unique = true)
    private String aadharNumber = "";
    
    @Column(name = "aadhar_verified", nullable = false)
    private Boolean aadharVerified = false;
    
    @Column(name = "pan_number", length = 20)
    private String panNumber = "";
    
    @Column(name = "pan_verified", nullable = false)
    private Boolean panVerified = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "police_verification_status", nullable = false)
    private VerificationStatus policeVerificationStatus = VerificationStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "medical_certificate_status", nullable = false)
    private VerificationStatus medicalCertificateStatus = VerificationStatus.PENDING;
    
    // Platform Details
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl = "";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;
    
    @Column(name = "service_radius_km", nullable = false)
    private Integer serviceRadiusKm = 10;
    
    // Geolocation - captured on login
    @Column(name = "current_latitude")
    private Double currentLatitude;
    
    @Column(name = "current_longitude")
    private Double currentLongitude;
    
    @Column(name = "last_location_update")
    private LocalDateTime lastLocationUpdate;
    
    @Column(precision = 3, scale = 2, nullable = false)
    private BigDecimal rating = BigDecimal.valueOf(0.00);
    
    @Column(name = "total_bookings", nullable = false)
    private Integer totalBookings = 0;
    
    // Emergency Contact
    @Column(name = "emergency_contact_name", length = 255)
    private String emergencyContactName = "";
    
    @Column(name = "emergency_contact_number", length = 20)
    private String emergencyContactNumber = "";
    
    @Column(name = "emergency_contact_relation", length = 100)
    private String emergencyContactRelation = "";
    
    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status", nullable = false)
    private RegistrationStatus registrationStatus = RegistrationStatus.PENDING;
    
    // Registration date field for database compatibility
    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate = LocalDate.now();
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Legacy fields for backward compatibility
    @Column(length = 500)
    private String idProofUrl = "";
    @Column(length = 500)
    private String selfieWithIdUrl = "";
    @Column(columnDefinition = "TEXT")
    private String certificateUrls = "{}"; // JSON array of certificate URLs
    
    // Payment Information
    private String paymentMode = ""; // UPI, Bank Transfer, Cash
    private String upiId = "";
    private String bankName = "";
    private String accountNumber = "";
    private String ifscCode = "";
    
    @Column(nullable = false)
    private Boolean openToTravel = false;
    
    // OTP verification fields
    private String phoneVerificationOtp;
    private LocalDateTime otpCreatedAt;
    private LocalDateTime otpExpiresAt;
    private Boolean phoneVerified = false;
    private Integer otpAttempts = 0; // Track failed attempts for security
    private LocalDate verificationDate;
    
    // Enums
    public enum Gender {
        MALE, FEMALE, OTHER
    }
    
    // Removed nested WorkerType enum - using standalone com.example.authbackend.model.WorkerType instead
    
    public enum VerificationStatus {
        PENDING, VERIFIED, FAILED, NOT_REQUIRED
    }
    
    public enum AvailabilityStatus {
        AVAILABLE, BUSY, OFFLINE
    }
    
    public enum RegistrationStatus {
        PENDING, ACTIVE, SUSPENDED, TERMINATED
    }

    // Constructors
    public Worker() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(Long agencyId) {
        this.agencyId = agencyId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
        this.dob = dateOfBirth; // Keep legacy field in sync
    }
    
    // Legacy getter/setter for compatibility
    public LocalDate getDob() {
        return dateOfBirth;
    }

    public void setDob(LocalDate dob) {
        this.dateOfBirth = dob;
        this.dob = dob; // Keep both fields in sync
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

    public String getAlternatePhone() {
        return alternatePhone;
    }

    public void setAlternatePhone(String alternatePhone) {
        this.alternatePhone = alternatePhone;
    }
    
    // Legacy getter/setter for compatibility
    public String getWhatsappNumber() {
        return alternatePhone;
    }

    public void setWhatsappNumber(String whatsappNumber) {
        this.alternatePhone = whatsappNumber;
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

    public WorkerType getWorkerType() {
        return workerType;
    }

    public void setWorkerType(WorkerType workerType) {
        this.workerType = workerType;
    }
    
    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }
    
    public String getSpecializations() {
        return specializations;
    }

    public void setSpecializations(String specializations) {
        this.specializations = specializations;
    }
    
    public String getEducationQualification() {
        return educationQualification;
    }

    public void setEducationQualification(String educationQualification) {
        this.educationQualification = educationQualification;
    }
    
    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    public Boolean getOpenToTravel() {
        return openToTravel;
    }

    public void setOpenToTravel(Boolean openToTravel) {
        this.openToTravel = openToTravel;
    }

    public VerificationStatus getPoliceVerificationStatus() {
        return policeVerificationStatus;
    }

    public void setPoliceVerificationStatus(VerificationStatus policeVerificationStatus) {
        this.policeVerificationStatus = policeVerificationStatus;
    }
    
    public VerificationStatus getMedicalCertificateStatus() {
        return medicalCertificateStatus;
    }

    public void setMedicalCertificateStatus(VerificationStatus medicalCertificateStatus) {
        this.medicalCertificateStatus = medicalCertificateStatus;
    }
    
    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }
    
    public Integer getServiceRadiusKm() {
        return serviceRadiusKm;
    }

    public void setServiceRadiusKm(Integer serviceRadiusKm) {
        this.serviceRadiusKm = serviceRadiusKm;
    }
    
    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }
    
    public Integer getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
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

    public Boolean getAadharVerified() {
        return aadharVerified;
    }

    public void setAadharVerified(Boolean aadharVerified) {
        this.aadharVerified = aadharVerified;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public Boolean getPanVerified() {
        return panVerified;
    }

    public void setPanVerified(Boolean panVerified) {
        this.panVerified = panVerified;
    }

    public String getEmergencyContactRelation() {
        return emergencyContactRelation;
    }

    public void setEmergencyContactRelation(String emergencyContactRelation) {
        this.emergencyContactRelation = emergencyContactRelation;
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

    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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

    // Legacy compatibility methods
    public String getServices() {
        return specializations;
    }

    public void setServices(String services) {
        this.specializations = services;
    }
    
    public String getExperience() {
        return experienceYears != null ? experienceYears.toString() : "0";
    }

    public void setExperience(String experience) {
        try {
            this.experienceYears = Integer.parseInt(experience);
        } catch (NumberFormatException e) {
            this.experienceYears = 0;
        }
    }
    
    public String getWorkType() {
        return workerType != null ? workerType.toString() : "";
    }

    public void setWorkType(String workType) {
        try {
            this.workerType = WorkerType.valueOf(workType.toUpperCase());
        } catch (IllegalArgumentException e) {
            this.workerType = WorkerType.CARETAKER;
        }
    }
    
    public String getAvailability() {
        return availabilityStatus != null ? availabilityStatus.toString() : "AVAILABLE";
    }

    public void setAvailability(String availability) {
        try {
            this.availabilityStatus = AvailabilityStatus.valueOf(availability.toUpperCase());
        } catch (IllegalArgumentException e) {
            this.availabilityStatus = AvailabilityStatus.AVAILABLE;
        }
    }
    
    public LocalDate getRegistrationDate() {
        return registrationDate != null ? registrationDate : (createdAt != null ? createdAt.toLocalDate() : LocalDate.now());
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }
    
    public String getServiceAreas() {
        return serviceRadiusKm != null ? serviceRadiusKm.toString() + "km" : "10km";
    }

    public void setServiceAreas(String serviceAreas) {
        try {
            String numStr = serviceAreas.replaceAll("[^0-9]", "");
            this.serviceRadiusKm = Integer.parseInt(numStr);
        } catch (NumberFormatException e) {
            this.serviceRadiusKm = 10;
        }
    }
    
    public String getPanCard() {
        return panNumber;
    }

    public void setPanCard(String panCard) {
        this.panNumber = panCard;
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

    // Additional compatibility methods for WorkerService
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
        return getExperience();
    }

    public void setWorkExperience(String workExperience) {
        setExperience(workExperience);
    }

    public String getEducation() {
        return educationQualification;
    }

    public void setEducation(String education) {
        this.educationQualification = education;
    }
    
    // Geolocation getters and setters
    public Double getCurrentLatitude() {
        return currentLatitude;
    }
    
    public void setCurrentLatitude(Double currentLatitude) {
        this.currentLatitude = currentLatitude;
    }
    
    public Double getCurrentLongitude() {
        return currentLongitude;
    }
    
    public void setCurrentLongitude(Double currentLongitude) {
        this.currentLongitude = currentLongitude;
    }
    
    public LocalDateTime getLastLocationUpdate() {
        return lastLocationUpdate;
    }
    
    public void setLastLocationUpdate(LocalDateTime lastLocationUpdate) {
        this.lastLocationUpdate = lastLocationUpdate;
    }
    
    // Legacy constructor for backward compatibility
    public Worker(Long id, String fullName, String gender, LocalDate dob, String profileImageUrl, String phone, String email, String whatsappNumber) {
        this.id = id;
        this.fullName = fullName;
        try {
            this.gender = Gender.valueOf(gender.toUpperCase());
        } catch (IllegalArgumentException e) {
            this.gender = Gender.OTHER;
        }
        this.dateOfBirth = dob;
        this.dob = dob; // Keep legacy field in sync
        this.registrationDate = LocalDate.now(); // Set registration date
        this.profileImageUrl = profileImageUrl;
        this.phone = phone;
        this.email = email;
        this.alternatePhone = whatsappNumber;
    }
}
