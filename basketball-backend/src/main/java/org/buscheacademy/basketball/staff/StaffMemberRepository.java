package org.buscheacademy.basketball.staff;

import org.buscheacademy.basketball.team.TeamLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffMemberRepository extends JpaRepository<StaffMember, Long> {

    // Admin listing – all staff
    List<StaffMember> findAllByOrderByDisplayOrderAscFullNameAsc();

    // Public listing – only active staff
    List<StaffMember> findByActiveTrueOrderByDisplayOrderAscFullNameAsc();

    // Public listing filtered by team level
    List<StaffMember> findByTeamLevelAndActiveTrueOrderByDisplayOrderAscFullNameAsc(TeamLevel teamLevel);
}
