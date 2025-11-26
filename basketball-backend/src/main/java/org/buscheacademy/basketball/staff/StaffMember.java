package org.buscheacademy.basketball.staff;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.buscheacademy.basketball.team.TeamLevel;

@Entity
@Table(name = "staff_members")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private TeamLevel teamLevel; // NATIONAL / REGIONAL

    @Column(nullable = false)
    private String position;   // e.g. Head Coach, Assistant Coach

    // Order in which they appear on the page (small int)
    @Column(nullable = false)
    @Builder.Default
    private int displayOrder = 0;

    // Primary photo (default card image)
    @Column(length = 1000)
    private String primaryPhotoUrl;

    // Secondary photo (hover image)
    @Column(length = 1000)
    private String secondaryPhotoUrl;

    // Long bio – TEXT/LONGTEXT
    @Column(columnDefinition = "TEXT")
    private String bio;

    // Contact info
    @Column(length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
