package org.buscheacademy.basketball.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateOrUpdateStaffMemberRequest(
        @NotBlank String fullName,
        @NotBlank String roleTitle,
        String bio,
        String photoUrl,
        String email,
        String phone
) {
}
