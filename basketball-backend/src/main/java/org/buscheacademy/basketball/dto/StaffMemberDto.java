package org.buscheacademy.basketball.dto;

public record StaffMemberDto(
        Long id,
        String fullName,
        String roleTitle,
        String bio,
        String photoUrl,
        String email,
        String phone
) {
}
