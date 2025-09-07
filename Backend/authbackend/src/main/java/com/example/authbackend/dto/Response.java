package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;
    
    // Explicit getter and setter for statusCode to ensure compilation
    public int getStatusCode() {
        return statusCode;
    }
    
    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }
    
    // Explicit getter and setter for message to ensure compilation
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    // Explicit getter and setter for emailOtpResponseDto to ensure compilation
    public EmailOtpResponseDto getEmailOtpResponseDto() {
        return emailOtpResponseDto;
    }
    
    public void setEmailOtpResponseDto(EmailOtpResponseDto emailOtpResponseDto) {
        this.emailOtpResponseDto = emailOtpResponseDto;
    }
    
    // Explicit getters and setters for userDto and token to ensure compilation
    public UserDto getUserDto() {
        return userDto;
    }
    
    public void setUserDto(UserDto userDto) {
        this.userDto = userDto;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    // Explicit getters and setters for list fields to ensure compilation
    public List<UserDto> getUserDtoList() {
        return userDtoList;
    }
    
    public void setUserDtoList(List<UserDto> userDtoList) {
        this.userDtoList = userDtoList;
    }
    
    public List<WorkerDTO> getWorkerDtoList() {
        return workerDtoList;
    }
    
    public void setWorkerDtoList(List<WorkerDTO> workerDtoList) {
        this.workerDtoList = workerDtoList;
    }
    
    public List<ContactDto> getContactDtoList() {
        return contactDtoList;
    }
    
    public void setContactDtoList(List<ContactDto> contactDtoList) {
        this.contactDtoList = contactDtoList;
    }
    
    // Explicit getters and setters for additional response DTOs to ensure compilation
    public BackblazeResponseDto getBackblazeResponseDto() {
        return backblazeResponseDto;
    }
    
    public void setBackblazeResponseDto(BackblazeResponseDto backblazeResponseDto) {
        this.backblazeResponseDto = backblazeResponseDto;
    }
    
    public FileUploadResponseDto getFileUploadResponseDto() {
        return fileUploadResponseDto;
    }
    
    public void setFileUploadResponseDto(FileUploadResponseDto fileUploadResponseDto) {
        this.fileUploadResponseDto = fileUploadResponseDto;
    }
    
    public SmsResponseDto getSmsResponseDto() {
        return smsResponseDto;
    }
    
    public void setSmsResponseDto(SmsResponseDto smsResponseDto) {
        this.smsResponseDto = smsResponseDto;
    }
    
    public TranslateResponseDto getTranslateResponseDto() {
        return translateResponseDto;
    }
    
    public void setTranslateResponseDto(TranslateResponseDto translateResponseDto) {
        this.translateResponseDto = translateResponseDto;
    }
    
    public TwoFactorOtpResponseDto getTwoFactorOtpResponseDto() {
        return twoFactorOtpResponseDto;
    }
    
    public void setTwoFactorOtpResponseDto(TwoFactorOtpResponseDto twoFactorOtpResponseDto) {
        this.twoFactorOtpResponseDto = twoFactorOtpResponseDto;
    }
    
    public WebhookEmailResponseDto getWebhookEmailResponseDto() {
        return webhookEmailResponseDto;
    }
    
    public void setWebhookEmailResponseDto(WebhookEmailResponseDto webhookEmailResponseDto) {
        this.webhookEmailResponseDto = webhookEmailResponseDto;
    }
    
    public ChatbotResponseDto getChatbotResponseDto() {
        return chatbotResponseDto;
    }
    
    public void setChatbotResponseDto(ChatbotResponseDto chatbotResponseDto) {
        this.chatbotResponseDto = chatbotResponseDto;
    }
    
    public OtpVerificationDto getOtpVerificationDto() {
        return otpVerificationDto;
    }
    
    public void setOtpVerificationDto(OtpVerificationDto otpVerificationDto) {
        this.otpVerificationDto = otpVerificationDto;
    }
    
    public GoogleAuthRequestDto getGoogleAuthRequestDto() {
        return googleAuthRequestDto;
    }
    
    public void setGoogleAuthRequestDto(GoogleAuthRequestDto googleAuthRequestDto) {
        this.googleAuthRequestDto = googleAuthRequestDto;
    }
    
    public WorkerDTO getWorkerDto() {
        return workerDto;
    }
    
    public void setWorkerDto(WorkerDTO workerDto) {
        this.workerDto = workerDto;
    }
    
    public ContactDto getContactDto() {
        return contactDto;
    }
    
    public void setContactDto(ContactDto contactDto) {
        this.contactDto = contactDto;
    }
    
    public String getExpirationTime() {
        return expirationTime;
    }
    
    public void setExpirationTime(String expirationTime) {
        this.expirationTime = expirationTime;
    }
    
    public String getOtpId() {
        return otpId;
    }
    
    public void setOtpId(String otpId) {
        this.otpId = otpId;
    }

    private String token;
    private String role;
    private String expirationTime;
    private String otpId;

    private UserDto userDto;
    private WorkerDTO workerDto;
    private ContactDto contactDto;
    private ChatbotResponseDto chatbotResponseDto;
    private EmailOtpResponseDto emailOtpResponseDto;
    private OtpVerificationDto otpVerificationDto;
    private GoogleAuthRequestDto googleAuthRequestDto;
    private TranslateResponseDto translateResponseDto;
    private FileUploadResponseDto fileUploadResponseDto;
    private SmsResponseDto smsResponseDto;
    private TwoFactorOtpResponseDto twoFactorOtpResponseDto;
    private WebhookEmailResponseDto webhookEmailResponseDto;
    private BackblazeResponseDto backblazeResponseDto;

    private List<UserDto> userDtoList;
    private List<WorkerDTO> workerDtoList;
    private List<ContactDto> contactDtoList;
}
