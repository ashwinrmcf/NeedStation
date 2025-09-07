package com.example.authbackend.service.impl;

import com.example.authbackend.dto.*;
import com.example.authbackend.model.User;
import com.example.authbackend.repository.UserRepository;
import com.example.authbackend.service.interfac.IAuthService;
import com.example.authbackend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService implements IAuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Response registerUser(SignupStep2RequestDto signupRequest) {
        Response response = new Response();
        try {
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                response.setStatusCode(400);
                response.setMessage("Email is already registered");
                return response;
            }
            
            if (userRepository.existsByUsername(signupRequest.getEmail())) {
                response.setStatusCode(400);
                response.setMessage("Username is already taken");
                return response;
            }

            User user = new User();
            user.setFirstName(signupRequest.getFirstName());
            user.setLastName(signupRequest.getLastName());
            user.setEmail(signupRequest.getEmail());
            user.setUsername(signupRequest.getEmail()); // Using email as username
            user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

            User savedUser = userRepository.save(user);
            UserDto userDto = Utils.mapUserEntityToUserDto(savedUser);
            
            response.setUserDto(userDto);
            response.setMessage("User registered successfully");
            response.setStatusCode(200);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal server error: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response loginUser(LoginRequestDto loginRequest) {
        Response response = new Response();
        try {
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new Exception("User not found"));
            
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                response.setStatusCode(401);
                response.setMessage("Invalid credentials");
                return response;
            }

            UserDto userDto = Utils.mapUserEntityToUserDto(user);
            response.setUserDto(userDto);
            response.setStatusCode(200);
            response.setMessage("Login successful");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal server error: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserById(Long userId) {
        Response response = new Response();
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new Exception("User not found"));
            
            UserDto userDto = Utils.mapUserEntityToUserDto(user);
            response.setUserDto(userDto);
            response.setStatusCode(200);
            response.setMessage("User found successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal server error: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllUsers() {
        Response response = new Response();
        try {
            List<User> userList = userRepository.findAll();
            if (userList.isEmpty()) {
                response.setStatusCode(404);
                response.setMessage("No users found");
                return response;
            }
            
            List<UserDto> userDtoList = Utils.mapUserListEntityToUserDtoList(userList);
            response.setUserDtoList(userDtoList);
            response.setStatusCode(200);
            response.setMessage("Users retrieved successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal server error: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteUser(Long userId) {
        Response response = new Response();
        try {
            if (!userRepository.existsById(userId)) {
                response.setStatusCode(404);
                response.setMessage("User not found");
                return response;
            }
            
            userRepository.deleteById(userId);
            response.setStatusCode(200);
            response.setMessage("User deleted successfully");
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal server error: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response verifyOtp(OtpVerificationRequestDto otpRequest) {
        Response response = new Response();
        try {
            // TODO: Implement OTP verification logic
            response.setStatusCode(200);
            response.setMessage("OTP verification not implemented yet");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal server error: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response verifyEmailOtp(EmailOtpVerificationRequestDto emailOtpRequest) {
        Response response = new Response();
        try {
            // TODO: Implement email OTP verification logic
            response.setStatusCode(200);
            response.setMessage("Email OTP verification not implemented yet");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal server error: " + e.getMessage());
        }
        return response;
    }
}

