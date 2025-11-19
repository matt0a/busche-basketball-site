package org.buscheacademy.basketball.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.buscheacademy.basketball.game.HomeAway;

import java.time.LocalDateTime;

public record CreateOrUpdateGameRequest(
        @NotNull Long teamId,
        @NotBlank String opponent,
        @NotNull @FutureOrPresent LocalDateTime gameDateTime,
        @NotNull HomeAway homeAway,
        @NotBlank String location,
        Integer scoreUs,
        Integer scoreThem,
        boolean conferenceGame,
        String notes
) {
}
