package org.buscheacademy.basketball.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Helper for seeding users with encoded passwords.
     */
    public User createUserIfNotExists(String fullName, String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User user = User.builder()
                            .fullName(fullName)
                            .email(email)
                            .passwordHash(passwordEncoder.encode(rawPassword))
                            .enabled(true)
                            .build();
                    return userRepository.save(user);
                });
    }
}
