package org.buscheacademy.basketball.auth;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.user.User;
import org.buscheacademy.basketball.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public AuthResponse register(RegisterRequest request) {
        if (!request.email().toLowerCase().endsWith("@buscheacademy.org")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email must be a @buscheacademy.org address.");
        }

        // userService.register throws 409 if email already taken
        User user = userService.register(request.fullName(), request.email(), request.password());

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, user.getFullName(), user.getEmail());
    }
}
