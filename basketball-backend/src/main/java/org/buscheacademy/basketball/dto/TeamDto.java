package org.buscheacademy.basketball.dto;

import org.buscheacademy.basketball.team.TeamLevel;

public record TeamDto(
        Long id,
        String name,
        TeamLevel level,
        String season,
        String description
) {
}
