package com.skillpath.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillpath.model.User;
import com.skillpath.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  UserRepository userRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // We allow login by either username OR email
    User user = userRepository.findByUsername(username)
        .or(() -> userRepository.findByEmail(username)) 
        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

    return UserDetailsImpl.build(user);
  }
}