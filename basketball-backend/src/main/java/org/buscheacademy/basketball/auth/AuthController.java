package org.buscheacademy.basketball.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        passwordResetService.requestReset(request.email());
        // Always return a generic response so callers cannot probe which emails have accounts.
        return ResponseEntity.ok(Map.of(
                "message", "If an account exists for that email, a reset link has been sent."
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.token(), request.password());
        return ResponseEntity.ok(Map.of(
                "message", "Your password has been updated. You can now sign in."
        ));
    }
}
