package org.buscheacademy.basketball.game;

import jakarta.persistence.*;
import lombok.*;
import org.buscheacademy.basketball.common.BaseEntity;
import org.buscheacademy.basketball.team.Team;

import java.time.LocalDateTime;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Which Busche team is playing (Regional or National).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_games_team"))
    private Team team;

    @Column(nullable = false, length = 150)
    private String opponent;

    @Column(nullable = false)
    private LocalDateTime gameDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private HomeAway homeAway;

    @Column(nullable = false, length = 200)
    private String location;

    /**
     * Nullable until the game is played.
     */
    private Integer scoreUs;

    private Integer scoreThem;

    /**
     * Mark if it's a league / conference game if that's relevant.
     */
    @Column(nullable = false)
    @Builder.Default
    private boolean conferenceGame = false;

    /**
     * Optional notes (e.g., tournament name, showcase).
     */
    @Column(length = 1000)
    private String notes;
}
