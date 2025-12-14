package org.buscheacademy.basketball.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.buscheacademy.basketball.team.TeamLevel;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrUpdateTeamRequest {

    @NotBlank
    private String name;

    @NotNull
    private TeamLevel level;
}
