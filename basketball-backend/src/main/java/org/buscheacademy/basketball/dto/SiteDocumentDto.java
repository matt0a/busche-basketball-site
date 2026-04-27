package org.buscheacademy.basketball.dto;

public record SiteDocumentDto(
        Long id,
        String documentKey,
        String fileUrl,
        String uploadedAt
) {
}
