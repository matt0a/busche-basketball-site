package org.buscheacademy.basketball.dto;

public record DiningMenuDto(
        Long id,
        String title,
        String imageUrl,
        Integer displayOrder,
        String uploadedAt
) {
}
