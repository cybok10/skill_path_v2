package com.skillpath.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.skillpath.model.User;
import com.skillpath.repository.UserRepository;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest updateRequest) {
        Optional<User> userOptional = userRepository.findById(id);
        
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
        }

        User user = userOptional.get();

        // Update Username
        if (updateRequest.getUsername() != null && !updateRequest.getUsername().isEmpty() && !updateRequest.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updateRequest.getUsername())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
            }
            user.setUsername(updateRequest.getUsername());
        }

        // Update Email
        if (updateRequest.getEmail() != null && !updateRequest.getEmail().isEmpty() && !updateRequest.getEmail().equals(user.getEmail())) {
             if (userRepository.existsByEmail(updateRequest.getEmail())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
            }
            user.setEmail(updateRequest.getEmail());
        }

        // Update Password
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(updateRequest.getPassword()));
        }

        userRepository.save(user);
        
        // Return updated info (excluding password for security)
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRoadmapJson()));
    }

    @PutMapping("/{id}/roadmap")
    public ResponseEntity<?> updateUserRoadmap(@PathVariable Long id, @RequestBody RoadmapUpdateRequest roadmapRequest) {
        Optional<User> userOptional = userRepository.findById(id);
        
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
        }

        User user = userOptional.get();
        user.setRoadmapJson(roadmapRequest.getRoadmapJson());
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("Roadmap updated successfully"));
    }

    // DTOs
    public static class UserUpdateRequest {
        private String username;
        private String email;
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class UserResponse {
        private Long id;
        private String username;
        private String email;
        private String roadmapJson;
        
        public UserResponse(Long id, String username, String email, String roadmapJson) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.roadmapJson = roadmapJson;
        }
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getRoadmapJson() { return roadmapJson; }
    }
    
    public static class MessageResponse {
      private String message;
      public MessageResponse(String message) { this.message = message; }
      public String getMessage() { return message; }
      public void setMessage(String message) { this.message = message; }
    }

    public static class RoadmapUpdateRequest {
        private String roadmapJson;
        public String getRoadmapJson() { return roadmapJson; }
        public void setRoadmapJson(String roadmapJson) { this.roadmapJson = roadmapJson; }
    }
}