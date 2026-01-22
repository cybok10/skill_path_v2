package com.skillpath.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.skillpath.model.User;
import com.skillpath.repository.UserRepository;
import com.skillpath.service.UserMetricsService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

import java.security.Principal;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;
    
    @Autowired
    UserMetricsService userMetricsService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    private ObjectMapper objectMapper;

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
    
    @PostMapping("/complete-activity")
    public ResponseEntity<?> completeActivity(Principal principal) {
        userMetricsService.awardXpAndIncrementStreak(principal.getName());
        return ResponseEntity.ok(new MessageResponse("Activity completed, metrics updated."));
    }

    @PostMapping("/roadmap/nodes/{nodeId}/complete")
    public ResponseEntity<?> completeRoadmapNode(@PathVariable String nodeId, Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoadmapJson() == null || user.getRoadmapJson().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("No roadmap found for user."));
        }

        try {
            RoadmapDto roadmap = objectMapper.readValue(user.getRoadmapJson(), RoadmapDto.class);
            
            int activeNodeIndex = -1;
            for (int i = 0; i < roadmap.getNodes().size(); i++) {
                if (roadmap.getNodes().get(i).getId().equals(nodeId)) {
                    if (!"active".equals(roadmap.getNodes().get(i).getStatus())) {
                        return ResponseEntity.badRequest().body(new MessageResponse("Node is not active."));
                    }
                    activeNodeIndex = i;
                    break;
                }
            }

            if (activeNodeIndex == -1) {
                return ResponseEntity.notFound().build();
            }

            // Mark current node as complete
            roadmap.getNodes().get(activeNodeIndex).setStatus("completed");

            // Mark next node as active
            if (activeNodeIndex + 1 < roadmap.getNodes().size()) {
                roadmap.getNodes().get(activeNodeIndex + 1).setStatus("active");
            }

            String updatedRoadmapJson = objectMapper.writeValueAsString(roadmap);
            user.setRoadmapJson(updatedRoadmapJson);
            userRepository.save(user);

            return ResponseEntity.ok(roadmap);

        } catch (JsonProcessingException e) {
            return ResponseEntity.internalServerError().body(new MessageResponse("Error processing roadmap data."));
        }
    }


    // DTOs

    public static class RoadmapNodeDto {
        private String id;
        private String title;
        private String description;
        private int estimatedHours;
        private String status;
        private List<String> topics;
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public int getEstimatedHours() { return estimatedHours; }
        public void setEstimatedHours(int estimatedHours) { this.estimatedHours = estimatedHours; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public List<String> getTopics() { return topics; }
        public void setTopics(List<String> topics) { this.topics = topics; }
    }

    public static class RoadmapDto {
        private String title;
        private String description;
        private List<RoadmapNodeDto> nodes;
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<RoadmapNodeDto> getNodes() { return nodes; }
        public void setNodes(List<RoadmapNodeDto> nodes) { this.nodes = nodes; }
    }


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