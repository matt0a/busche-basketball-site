package org.buscheacademy.basketball.team;

import jakarta.persistence.*;
import lombok.*;
import org.buscheacademy.basketball.common.BaseEntity;

@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Example: "Busche Academy Regional Team" / "Busche Academy National Team"
     */
    @Column(nullable = false, length = 150)
    private String name;

    /**
     * Short code like "REGIONAL" or "NATIONAL" for UI filtering if you want.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private TeamLevel level;

    /**
     * Optional: e.g. "2024-2025"
     */
    @Column(length = 40)
    private String season;

    /**
     * Short description to display on roster/program page.
     */
    @Column(length = 1000)
    private String description;
}
