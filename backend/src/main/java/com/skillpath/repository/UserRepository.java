package com.skillpath.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.skillpath.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
  Optional<User> findByEmail(String email);
  Optional<User> findByResetToken(String resetToken);
  Boolean existsByUsername(String username);
  Boolean existsByEmail(String email);
}