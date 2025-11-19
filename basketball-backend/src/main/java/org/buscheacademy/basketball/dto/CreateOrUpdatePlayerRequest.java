package org.buscheacademy.basketball.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateOrUpdatePlayerRequest(
        @NotNull Long teamId,
        @NotBlank String firstName,
        @NotBlank String lastName,
        Integer jerseyNumber,
        String position,
        String height,
        Integer gradYear,
        String country,
        String photoUrl
) {
}
