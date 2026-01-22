package com.skillpath.service;

import com.skillpath.model.User;
import com.skillpath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserMetricsService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    // In-memory store for demo purposes. In a real app, this would be in the database.
    private final Map<String, Integer> userXp = new ConcurrentHashMap<>();
    private final Map<String, Integer> userStreak = new ConcurrentHashMap<>();

    public void awardXpAndIncrementStreak(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        // Initialize if not present (using values from frontend for consistency)
        userXp.putIfAbsent(userEmail, 12450);
        userStreak.putIfAbsent(userEmail, 12);

        // Update metrics
        int newXp = userXp.get(userEmail) + 50;
        int newStreak = userStreak.get(userEmail) + 1;

        userXp.put(userEmail, newXp);
        userStreak.put(userEmail, newStreak);

        // Send update via WebSocket
        sendMetricsUpdate(user.getEmail(), newXp, newStreak);
    }

    private void sendMetricsUpdate(String userEmail, int xp, int streak) {
        Map<String, Object> payload = Map.of("xp", xp, "streak", streak);
        messagingTemplate.convertAndSendToUser(userEmail, "/queue/metrics", payload);
    }
}