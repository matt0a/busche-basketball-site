package org.buscheacademy.basketball.dto;

import jakarta.validation.constraints.*;
import org.buscheacademy.basketball.team.TeamLevel;

public record CreateOrUpdateStaffMemberRequest(

        @NotBlank
        String fullName,

        @NotNull
        TeamLevel teamLevel,

        @NotBlank
        String position,

        @Min(0)
        int displayOrder,

        @Size(max = 1000)
        String primaryPhotoUrl,

        @Size(max = 1000)
        String secondaryPhotoUrl,

        // long bio, no hard length validation
        String bio,

        @Email
        @Size(max = 255)
        String email,

        @Size(max = 50)
        String phone,

        boolean active
) {
}
