package com.skillpath;

import com.skillpath.model.User;
import com.skillpath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin exists to avoid duplicates
        if (!userRepository.existsByUsername("admin")) {
            // Create the admin user
            User admin = new User("admin", "admin@skillpath.com", encoder.encode("admin123"));
            
            Set<String> roles = new HashSet<>();
            roles.add("ROLE_USER");
            roles.add("ROLE_ADMIN");
            
            admin.setRoles(roles);
            
            userRepository.save(admin);
            
            System.out.println("==========================================");
            System.out.println("ADMIN USER CREATED SUCCESSFULLY");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("==========================================");
        }
    }
}