package org.buscheacademy.basketball.player;

import jakarta.persistence.*;
import lombok.*;
import org.buscheacademy.basketball.common.BaseEntity;
import org.buscheacademy.basketball.team.Team;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String firstName;

    @Column(nullable = false, length = 80)
    private String lastName;

    /**
     * Jersey number, optional.
     */
    @Column
    private Integer jerseyNumber;

    /**
     * Position string like "G", "F", "C", "G/F" etc.
     */
    @Column(length = 20)
    private String position;

    /**
     * Example: "6'3\"" or "190 cm" – keep it as string for flexibility.
     */
    @Column(length = 50)
    private String height;

    /**
     * High school graduating year, e.g., 2026.
     */
    @Column
    private Integer gradYear;

    @Column(length = 120)
    private String country;

    /**
     * URL of the player's photo (optional).
     */
    @Column(length = 500)
    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_players_team"))
    private Team team;
}
