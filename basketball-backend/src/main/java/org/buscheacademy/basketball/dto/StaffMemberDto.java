package org.buscheacademy.basketball.dto;

import org.buscheacademy.basketball.staff.StaffCategory;
import org.buscheacademy.basketball.team.TeamLevel;

public record StaffMemberDto(
        Long id,
        String fullName,
        TeamLevel teamLevel,
        String position,
        int displayOrder,
        String primaryPhotoUrl,
        String secondaryPhotoUrl,
        String bio,
        String email,
        String phone,
        boolean active,
        boolean adminStaff,
        StaffCategory staffCategory
) {
}
