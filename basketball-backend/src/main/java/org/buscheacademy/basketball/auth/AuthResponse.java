package org.buscheacademy.basketball.auth;

public record AuthResponse(
        String token,
        String fullName,
        String email
) {
}
