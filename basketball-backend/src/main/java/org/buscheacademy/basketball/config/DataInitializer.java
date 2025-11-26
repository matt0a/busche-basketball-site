package org.buscheacademy.basketball.config;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.user.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserService userService;

    @Bean
    public CommandLineRunner seedUsers() {
        return args -> {
            // Change email/password to whatever you want for the first coach account.
            userService.createUserIfNotExists(
                    "Mike Mason",
                    "coach@buscheacademy.org",
                    "passsword"
            );
        };
    }
}
