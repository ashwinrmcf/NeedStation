//package com.example.authbackend.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "otp_verifications")
//public class OtpVerification {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "otp_id", nullable = false, unique = true)
//    private String otpId;
//
//    @Column(name = "otp_secret", nullable = false)
//    private String otpSecret;
//
//    @Column(name = "phone_number", nullable = false)
//    private String phoneNumber;
//
//    @Column(name = "email")
//    private String email;
//
//    @Column(name = "user_id")
//    private Long userId;
//
//    @Column(name = "status", nullable = false)
//    private String status;
//
//    @Column(name = "created_at", nullable = false)
//    private LocalDateTime createdAt;
//
//    @Column(name = "verified_at")
//    private LocalDateTime verifiedAt;
//
//    @Column(name = "ip_address")
//    private String ipAddress;
//
//    @Column(name = "risk_score")
//    private Float riskScore;
//
//    // Getters and setters
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getOtpId() {
//        return otpId;
//    }
//
//    public void setOtpId(String otpId) {
//        this.otpId = otpId;
//    }
//
//    public String getOtpSecret() {
//        return otpSecret;
//    }
//
//    public void setOtpSecret(String otpSecret) {
//        this.otpSecret = otpSecret;
//    }
//
//    public String getPhoneNumber() {
//        return phoneNumber;
//    }
//
//    public void setPhoneNumber(String phoneNumber) {
//        this.phoneNumber = phoneNumber;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public Long getUserId() {
//        return userId;
//    }
//
//    public void setUserId(Long userId) {
//        this.userId = userId;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public LocalDateTime getVerifiedAt() {
//        return verifiedAt;
//    }
//
//    public void setVerifiedAt(LocalDateTime verifiedAt) {
//        this.verifiedAt = verifiedAt;
//    }
//
//    public String getIpAddress() {
//        return ipAddress;
//    }
//
//    public void setIpAddress(String ipAddress) {
//        this.ipAddress = ipAddress;
//    }
//
//    public Float getRiskScore() {
//        return riskScore;
//    }
//
//    public void setRiskScore(Float riskScore) {
//        this.riskScore = riskScore;
//    }
//}
