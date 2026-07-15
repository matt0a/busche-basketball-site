package org.buscheacademy.basketball.auth;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.user.PasswordResetToken;
import org.buscheacademy.basketball.user.PasswordResetTokenRepository;
import org.buscheacademy.basketball.user.User;
import org.buscheacademy.basketball.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final PasswordResetTokenRepository tokenRepository;
    private final UserService userService;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Value("${app.reset-token.ttl-minutes:30}")
    private long ttlMinutes;

    /**
     * Generates a single-use reset token and emails the reset link. Always completes without
     * revealing whether an account exists for the given email (anti-enumeration).
     */
    @Transactional
    public void requestReset(String email) {
        Optional<User> maybeUser = userService.findByEmail(email);
        if (maybeUser.isEmpty()) {
            return;
        }
        User user = maybeUser.get();

        // Invalidate any outstanding unused tokens for this account.
        List<PasswordResetToken> existing = tokenRepository.findByEmailAndUsedFalse(user.getEmail());
        existing.forEach(t -> t.setUsed(true));
        tokenRepository.saveAll(existing);

        // Generate a raw token; store only its SHA-256 hash.
        byte[] raw = new byte[32];
        secureRandom.nextBytes(raw);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);

        PasswordResetToken token = PasswordResetToken.builder()
                .email(user.getEmail())
                .tokenHash(sha256Hex(rawToken))
                .expiresAt(LocalDateTime.now().plusMinutes(ttlMinutes))
                .used(false)
                .build();
        tokenRepository.save(token);

        String resetLink = frontendBaseUrl + "/reset-password?token=" + rawToken;

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        } catch (Exception ex) {
            // Do not propagate: avoids leaking account existence and keeps the endpoint resilient
            // when SMTP is unconfigured. The failure is recorded server-side.
            log.error("Failed to send password reset email to {}", user.getEmail(), ex);
        }
    }

    /**
     * Consumes a reset token and updates the account password. Throws 400 if the token is
     * unknown, already used, or expired.
     */
    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        PasswordResetToken token = tokenRepository.findByTokenHash(sha256Hex(rawToken))
                .filter(t -> !t.isUsed())
                .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "This reset link is invalid or has expired."));

        User user = userService.findByEmail(token.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "This reset link is invalid or has expired."));

        userService.updatePassword(user, newPassword);

        token.setUsed(true);
        tokenRepository.save(token);
    }

    private String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
