package com.skillchef.skillchef_backend.controller.hashan;

import com.skillchef.skillchef_backend.dto.hashan.UserLoginDTO;
import com.skillchef.skillchef_backend.dto.hashan.UserRegisterDTO;
import com.skillchef.skillchef_backend.dto.hashan.UserResponseDTO;
import com.skillchef.skillchef_backend.model.hashan.User;
import com.skillchef.skillchef_backend.service.hashan.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterDTO userDto) {
        if (userService.existsByEmail(userDto.getEmail())) {
            return ResponseEntity.status(400).body("Email already registered");
        }

        User user = new User(
                userDto.getUsername(),
                userDto.getEmail(),
                userDto.getPassword(),
                userDto.getBio(),
                userDto.getProfilePic(),
                userDto.getLocation(),
                null
        );

        User registered = userService.register(user);
        return ResponseEntity.ok(new UserResponseDTO(registered));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO loginDto) {
        return userService
                .login(loginDto.getEmail(), loginDto.getPassword())
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(new UserResponseDTO(user)))
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateWithImage(
            @PathVariable String id,
            @RequestPart("username") String username,
            @RequestPart("bio") String bio,
            @RequestPart("location") String location,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        try {
            User user = userService.getUserById(id).orElseThrow(() -> new RuntimeException("User not found"));
            user.setUsername(username);
            user.setBio(bio);
            user.setLocation(location);

            if (file != null && !file.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + "/skillchef-backend/uploads/";
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename().replaceAll(" ", "_");
                Path filePath = Paths.get(uploadDir + fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());
                user.setProfilePic("/uploads/" + fileName);
            }

            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(new UserResponseDTO(updatedUser));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Profile image upload failed");
        }
    }

    @PutMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<?> followUser(@PathVariable String userId, @PathVariable String targetId) {
        try {
            User updated = userService.follow(userId, targetId);
            return ResponseEntity.ok(new UserResponseDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Follow failed: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/unfollow/{targetId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String userId, @PathVariable String targetId) {
        try {
            User updated = userService.unfollow(userId, targetId);
            return ResponseEntity.ok(new UserResponseDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Unfollow failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(new UserResponseDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/suggestions/{userId}")
    public List<User> suggestUsers(@PathVariable String userId) {
        return userService.suggestUsersToFollow(userId);
    }
}