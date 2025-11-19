package org.buscheacademy.basketball.auth;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.user.User;
import org.buscheacademy.basketball.user.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserService userService;

    public AuthResponse login(LoginRequest request) {
        // Will throw if credentials are bad
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // Load user details after successful authentication
        var userDetails = userDetailsService.loadUserByUsername(request.email());
        String token = jwtService.generateToken(userDetails);

        User user = userService.findByEmail(request.email())
                .orElseThrow(); // shouldn't happen because we just authenticated

        return new AuthResponse(token, user.getFullName(), user.getEmail());
    }
}
