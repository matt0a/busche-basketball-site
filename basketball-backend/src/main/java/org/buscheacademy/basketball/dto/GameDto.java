package org.buscheacademy.basketball.dto;

import org.buscheacademy.basketball.game.HomeAway;

import java.time.LocalDateTime;

public record GameDto(
        Long id,
        Long teamId,
        String teamName,
        String opponent,
        LocalDateTime gameDateTime,
        HomeAway homeAway,
        String location,
        Integer scoreUs,
        Integer scoreThem,
        Boolean win,          // null if no score yet
        boolean conferenceGame,
        String notes
) {
}
