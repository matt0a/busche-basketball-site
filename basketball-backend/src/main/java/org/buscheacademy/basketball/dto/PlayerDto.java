package org.buscheacademy.basketball.dto;

public record PlayerDto(
        Long id,
        String firstName,
        String lastName,
        Integer jerseyNumber,
        String position,
        String height,
        Integer gradYear,
        String country,
        String photoUrl,
        Long teamId,
        String teamName
) {
}
