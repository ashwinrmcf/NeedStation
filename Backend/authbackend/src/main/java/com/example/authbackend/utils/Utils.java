package com.example.authbackend.utils;

import com.example.authbackend.dto.UserDto;
import com.example.authbackend.dto.WorkerDTO;
import com.example.authbackend.dto.ContactDto;
import com.example.authbackend.model.User;
import com.example.authbackend.model.Worker;

import java.util.List;
import java.util.stream.Collectors;

public class Utils {

    public static UserDto mapUserEntityToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setContactNumber(user.getContactNumber());
        userDto.setRole("USER");
        return userDto;
    }

    public static WorkerDTO mapWorkerEntityToWorkerDto(Worker worker) {
        WorkerDTO workerDto = new WorkerDTO();
        workerDto.setId(worker.getId());
        workerDto.setFullName(worker.getFullName());
        workerDto.setGender(worker.getGender());
        workerDto.setDob(worker.getDob() != null ? worker.getDob().toString() : null);
        workerDto.setPhone(worker.getPhone());
        workerDto.setEmail(worker.getEmail());
        workerDto.setWhatsappNumber(worker.getWhatsappNumber());
        workerDto.setProfileImageUrl(worker.getProfileImageUrl());
        workerDto.setStatus("ACTIVE");
        return workerDto;
    }

    public static ContactDto mapContactRequestToContactDto(String name, String email, String phone, String subject, String message) {
        ContactDto contactDto = new ContactDto();
        contactDto.setName(name);
        contactDto.setEmail(email);
        contactDto.setPhone(phone);
        contactDto.setSubject(subject);
        contactDto.setMessage(message);
        contactDto.setStatus("SUBMITTED");
        return contactDto;
    }

    public static List<UserDto> mapUserListEntityToUserDtoList(List<User> userList) {
        return userList.stream().map(Utils::mapUserEntityToUserDto).collect(Collectors.toList());
    }

    public static List<WorkerDTO> mapWorkerListEntityToWorkerDtoList(List<Worker> workerList) {
        return workerList.stream().map(Utils::mapWorkerEntityToWorkerDto).collect(Collectors.toList());
    }
}
