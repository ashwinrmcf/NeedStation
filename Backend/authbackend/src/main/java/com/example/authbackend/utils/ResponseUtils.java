package com.example.authbackend.utils;

import com.example.authbackend.dto.Response;
import com.example.authbackend.dto.UserDto;
import com.example.authbackend.dto.WorkerDTO;
import com.example.authbackend.dto.ContactDto;

import java.util.List;

public class ResponseUtils {

    public static Response createSuccessResponse(String message) {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage(message);
        return response;
    }

    public static Response createErrorResponse(String message, int statusCode) {
        Response response = new Response();
        response.setStatusCode(statusCode);
        response.setMessage(message);
        return response;
    }

    public static Response createAuthSuccessResponse(String token, String role, String expirationTime, UserDto userDto) {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Authentication successful");
        response.setToken(token);
        response.setRole(role);
        response.setExpirationTime(expirationTime);
        response.setUserDto(userDto);
        return response;
    }

    public static Response createWorkerAuthSuccessResponse(String token, String role, String expirationTime, WorkerDTO workerDto) {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Worker authentication successful");
        response.setToken(token);
        response.setRole(role);
        response.setExpirationTime(expirationTime);
        response.setWorkerDto(workerDto);
        return response;
    }

    public static Response createOtpResponse(String message, String otpId) {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage(message);
        response.setOtpId(otpId);
        return response;
    }

    public static Response createUserListResponse(List<UserDto> userList) {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Users retrieved successfully");
        response.setUserDtoList(userList);
        return response;
    }

    public static Response createWorkerListResponse(List<WorkerDTO> workerList) {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Workers retrieved successfully");
        response.setWorkerDtoList(workerList);
        return response;
    }

    public static Response createContactResponse(ContactDto contactDto) {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Contact form submitted successfully");
        response.setContactDto(contactDto);
        return response;
    }
}
