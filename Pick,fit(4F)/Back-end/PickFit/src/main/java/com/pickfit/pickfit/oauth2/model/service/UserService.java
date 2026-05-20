package com.pickfit.pickfit.oauth2.model.service;

import com.pickfit.pickfit.oauth2.model.dto.UserDTO;
import com.pickfit.pickfit.oauth2.model.entity.UserEntity;
import com.pickfit.pickfit.oauth2.model.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserEntity handleOAuth2Login(UserDTO userDTO) {
        Optional<UserEntity> existingUser = repository.findById(userDTO.getEmail());

        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            UserEntity newUser = new UserEntity();
            newUser.setEmail(userDTO.getEmail());
            newUser.setName(userDTO.getName());
            newUser.setRole("USER");
            return repository.save(newUser);
        }
    }

    public UserEntity updateUserDetails(UserDTO userDTO) {
        Optional<UserEntity> existingUser = repository.findById(userDTO.getEmail());

        if (existingUser.isPresent()) {
            UserEntity user = existingUser.get();

            if (userDTO.getPhoneNum() != null) {
                user.setPhoneNum(userDTO.getPhoneNum());
            }
            if (userDTO.getAddress() != null) {
                user.setAddress(userDTO.getAddress());
            }
            if (userDTO.getNickname() != null) {
                user.setNickname(userDTO.getNickname());
            }
            if (userDTO.getProfile() != null) {
                user.setProfile(userDTO.getProfile());
            }
            return repository.save(user);
        } else {
            throw new IllegalArgumentException("User not found with email: " + userDTO.getEmail());
        }
    }
}