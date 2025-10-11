package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.Map;

public class BookingDTO {
    
    private Long id;
    private String bookingId;
    
    // Customer Information
    @JsonProperty("phone")
    private String customerPhone;
    
    @JsonProperty("alternatePhone")
    private String alternatePhone;
    
    @JsonProperty("customerName")
    private String customerName;
    
    @JsonProperty("customerEmail")
    private String customerEmail;
    
    // Service Information
    @JsonProperty("serviceName")
    private String serviceName;
    
    @JsonProperty("serviceCategory")
    private String serviceCategory;
    
    // Location Information
    @JsonProperty("latitude")
    private Double latitude;
    
    @JsonProperty("longitude")
    private Double longitude;
    
    @JsonProperty("address")
    private String fullAddress;
    
    @JsonProperty("pincode")
    private String pincode;
    
    @JsonProperty("landmark")
    private String landmark;
    
    @JsonProperty("city")
    private String city;
    
    @JsonProperty("state")
    private String state;
    
    // Scheduling Information
    @JsonProperty("preferredDate")
    private String preferredDate;
    
    @JsonProperty("preferredTime")
    private String preferredTime;
    
    @JsonProperty("urgency")
    private String urgency;
    
    // Service Details
    @JsonProperty("serviceDetails")
    private Map<String, Object> serviceDetails;
    
    // Status and Pricing
    private String status;
    private Double estimatedPrice;
    private Double finalPrice;
    private String paymentMethod;
    private String paymentStatus;
    
    // Worker Information
    private Long assignedWorkerId;
    private String workerName;
    private String workerPhone;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime scheduledAt;
    private LocalDateTime completedAt;
    
    // Additional Information
    @JsonProperty("specialInstructions")
    private String specialInstructions;
    
    private String cancellationReason;
    private Integer rating;
    private String review;
    
    // Constructors
    public BookingDTO() {}
    
    public BookingDTO(String customerPhone, String serviceName) {
        this.customerPhone = customerPhone;
        this.serviceName = serviceName;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }
    
    public String getCustomerPhone() {
        return customerPhone;
    }
    
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
    
    public String getAlternatePhone() {
        return alternatePhone;
    }
    
    public void setAlternatePhone(String alternatePhone) {
        this.alternatePhone = alternatePhone;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public String getServiceName() {
        return serviceName;
    }
    
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
    
    public String getServiceCategory() {
        return serviceCategory;
    }
    
    public void setServiceCategory(String serviceCategory) {
        this.serviceCategory = serviceCategory;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public String getFullAddress() {
        return fullAddress;
    }
    
    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }
    
    public String getPincode() {
        return pincode;
    }
    
    public void setPincode(String pincode) {
        this.pincode = pincode;
    }
    
    public String getLandmark() {
        return landmark;
    }
    
    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
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
    
    public String getUrgency() {
        return urgency;
    }
    
    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }
    
    public Map<String, Object> getServiceDetails() {
        return serviceDetails;
    }
    
    public void setServiceDetails(Map<String, Object> serviceDetails) {
        this.serviceDetails = serviceDetails;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Double getEstimatedPrice() {
        return estimatedPrice;
    }
    
    public void setEstimatedPrice(Double estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
    }
    
    public Double getFinalPrice() {
        return finalPrice;
    }
    
    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public Long getAssignedWorkerId() {
        return assignedWorkerId;
    }
    
    public void setAssignedWorkerId(Long assignedWorkerId) {
        this.assignedWorkerId = assignedWorkerId;
    }
    
    public String getWorkerName() {
        return workerName;
    }
    
    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }
    
    public String getWorkerPhone() {
        return workerPhone;
    }
    
    public void setWorkerPhone(String workerPhone) {
        this.workerPhone = workerPhone;
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
    
    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }
    
    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public String getSpecialInstructions() {
        return specialInstructions;
    }
    
    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
    
    public String getCancellationReason() {
        return cancellationReason;
    }
    
    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getReview() {
        return review;
    }
    
    public void setReview(String review) {
        this.review = review;
    }
}
