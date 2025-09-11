package com.example.authbackend.dto;

public class WorkerDTO {
    private String fullName;
    private String gender;
    private String dob;  // Date of birth as string (will be parsed to LocalDate)
    private String phone;
    private String email;
    private String whatsappNumber;
    // Note: profileImageUrl is handled separately through file upload

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

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
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

    public WorkerDTO() {
    }

    public WorkerDTO(String fullName, String gender, String dob, String phone, String email, String whatsappNumber) {
        this.fullName = fullName;
        this.gender = gender;
        this.dob = dob;
        this.phone = phone;
        this.email = email;
        this.whatsappNumber = whatsappNumber;
    }
}