package org.buscheacademy.basketball.user;

import jakarta.persistence.*;
import lombok.*;

import org.buscheacademy.basketball.common.BaseEntity;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "password_reset_token",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_password_reset_token_hash", columnNames = "token_hash")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(name = "token_hash", nullable = false, length = 64)
    private String tokenHash;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean used = false;
}
