package com.skillpath.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.skillpath.model.User;
import com.skillpath.repository.UserRepository;
import com.skillpath.security.jwt.JwtUtils;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;
  
  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

    String username = loginRequest.getEmail(); 
    Optional<User> userOp = userRepository.findByEmail(username);
    
    if (userOp.isPresent()) {
        username = userOp.get().getUsername();
    }

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(username, loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    
    // Generate REAL JWT Token
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    User user = userRepository.findByUsername(username).orElseThrow();
    List<String> roles = user.getRoles().stream().collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt, 
                         user.getId(), 
                         user.getUsername(), 
                         user.getEmail(), 
                         roles,
                         user.getRoadmapJson()));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    User user = new User(signUpRequest.getUsername(), 
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<String> roles = new HashSet<>();
    roles.add("ROLE_USER"); 
    user.setRoles(roles);
    
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
      Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
      
      if (!userOptional.isPresent()) {
          // To prevent email enumeration attacks, we send a generic success response even if the user doesn't exist.
          return ResponseEntity.ok(new MessageResponse("If your email exists, a reset link has been sent."));
      }

      User user = userOptional.get();
      String token = UUID.randomUUID().toString();
      
      user.setResetToken(token);
      user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token is valid for 1 hour
      userRepository.save(user);

      // In a real app, you would email this token. For this demo, we return it.
      return ResponseEntity.ok(new TokenResponse("Reset token generated (Simulated Email)", token));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
      Optional<User> userOptional = userRepository.findByResetToken(request.getToken());

      if (!userOptional.isPresent()) {
          return ResponseEntity.badRequest().body(new MessageResponse("Invalid token."));
      }

      User user = userOptional.get();

      if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
          return ResponseEntity.badRequest().body(new MessageResponse("Token has expired."));
      }

      user.setPassword(encoder.encode(request.getNewPassword()));
      user.setResetToken(null);
      user.setResetTokenExpiry(null);
      
      userRepository.save(user);

      return ResponseEntity.ok(new MessageResponse("Password successfully reset."));
  }

  // --- DTOs ---
  
  public static class LoginRequest {
      private String email;
      private String password;
      public String getEmail() { return email; }
      public void setEmail(String email) { this.email = email; }
      public String getPassword() { return password; }
      public void setPassword(String password) { this.password = password; }
  }

  public static class SignupRequest {
      private String username;
      private String email;
      private String password;
      private Set<String> role;
      public String getUsername() { return username; }
      public void setUsername(String username) { this.username = username; }
      public String getEmail() { return email; }
      public void setEmail(String email) { this.email = email; }
      public String getPassword() { return password; }
      public void setPassword(String password) { this.password = password; }
      public Set<String> getRole() { return role; }
      public void setRole(Set<String> role) { this.role = role; }
  }

  public static class ForgotPasswordRequest {
      private String email;
      public String getEmail() { return email; }
      public void setEmail(String email) { this.email = email; }
  }

  public static class ResetPasswordRequest {
      private String token;
      private String newPassword;
      public String getToken() { return token; }
      public void setToken(String token) { this.token = token; }
      public String getNewPassword() { return newPassword; }
      public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
  }

  public static class JwtResponse {
      private String token;
      private Long id;
      private String username;
      private String email;
      private List<String> roles;
      private String roadmapJson;

      public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles, String roadmapJson) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.roadmapJson = roadmapJson;
      }
      public String getToken() { return token; }
      public String getUsername() { return username; }
      public String getEmail() { return email; }
      public List<String> getRoles() { return roles; }
      public String getRoadmapJson() { return roadmapJson; }
  }

  public static class MessageResponse {
      private String message;
      public MessageResponse(String message) { this.message = message; }
      public String getMessage() { return message; }
      public void setMessage(String message) { this.message = message; }
  }

  public static class TokenResponse {
    private String message;
    private String token;
    public TokenResponse(String message, String token) { 
        this.message = message; 
        this.token = token;
    }
    public String getMessage() { return message; }
    public String getToken() { return token; }
  }
}