package com.example.authbackend.controller;

import com.example.authbackend.dto.*;
import com.example.authbackend.service.interfac.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "*"})
public class AuthController {

    @Autowired
    private IAuthService iAuthService;

    @PostMapping("/registerUser")
    public Response registerUser(@RequestBody SignupStep2RequestDto signupRequest) {
        return iAuthService.registerUser(signupRequest);
    }

    @PostMapping("/loginUser")
    public Response loginUser(@RequestBody LoginRequestDto loginRequest) {
        return iAuthService.loginUser(loginRequest);
    }

    @PostMapping("/verifyOtp")
    public Response verifyOtp(@RequestBody OtpVerificationRequestDto otpRequest) {
        return iAuthService.verifyOtp(otpRequest);
    }

    @PostMapping("/verifyEmailOtp")
    public Response verifyEmailOtp(@RequestBody EmailOtpVerificationRequestDto emailOtpRequest) {
        return iAuthService.verifyEmailOtp(emailOtpRequest);
    }

    @GetMapping("/getUser/{userId}")
    public Response getUserById(@PathVariable Long userId) {
        return iAuthService.getUserById(userId);
    }

    @GetMapping("/getAllUsers")
    public Response getAllUsers() {
        return iAuthService.getAllUsers();
    }

    @DeleteMapping("/deleteUser/{userId}")
    public Response deleteUser(@PathVariable Long userId) {
        return iAuthService.deleteUser(userId);
    }

    // User management endpoints merged from UserController
    @PostMapping("/user/update-location")
    public Response updateLocation(@RequestBody LocationDTO locationDTO) {
        return iAuthService.getUserById(Long.valueOf(locationDTO.getUserIdentifier()));
    }

    @PostMapping("/user/update-form-data")
    public Response updateFormData(@RequestBody UserFormDataDTO formDataDTO) {
        return iAuthService.getUserById(Long.valueOf(formDataDTO.getUserIdentifier()));
    }
}


