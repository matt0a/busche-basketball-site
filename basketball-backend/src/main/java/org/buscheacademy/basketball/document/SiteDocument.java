package org.buscheacademy.basketball.document;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "site_documents")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SiteDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 64)
    private String documentKey;

    @Column(nullable = false, length = 1000)
    private String fileUrl;

    @Column(nullable = false)
    private Instant uploadedAt;
}
