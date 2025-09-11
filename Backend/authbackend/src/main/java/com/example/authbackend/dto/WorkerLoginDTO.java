package com.example.authbackend.dto;

public class WorkerLoginDTO {
    private String email;
    private String phone;
    private Long workerId;
    private boolean verified;

    public WorkerLoginDTO() {}
    
    public WorkerLoginDTO(String email, String phone) {
        this.email = email;
        this.phone = phone;
        this.verified = false;
    }
    
    public WorkerLoginDTO(Long workerId, String phone, boolean verified) {
        this.workerId = workerId;
        this.phone = phone;
        this.verified = verified;
    }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }
    
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
