package org.buscheacademy.basketball.dining;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "dining_menus")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DiningMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 1000)
    private String imageUrl;

    /** Lower numbers appear first on the public page. */
    @Column(nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    private Instant uploadedAt;
}
