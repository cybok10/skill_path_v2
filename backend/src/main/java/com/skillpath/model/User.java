package com.skillpath.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", 
       uniqueConstraints = { 
           @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email") 
       })
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String username;
  private String email;
  private String password;

  @Column(name = "reset_token")
  private String resetToken;

  @Column(name = "reset_token_expiry")
  private LocalDateTime resetTokenExpiry;
  
  @Lob
  @Column(name = "roadmap_json", columnDefinition = "TEXT")
  private String roadmapJson;

  @ElementCollection(fetch = FetchType.EAGER)
  private Set<String> roles = new HashSet<>();

  public User() {}

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  
  public Set<String> getRoles() { return roles; }
  public void setRoles(Set<String> roles) { this.roles = roles; }

  public String getResetToken() { return resetToken; }
  public void setResetToken(String resetToken) { this.resetToken = resetToken; }

  public LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }
  public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }

  public String getRoadmapJson() { return roadmapJson; }
  public void setRoadmapJson(String roadmapJson) { this.roadmapJson = roadmapJson; }
}