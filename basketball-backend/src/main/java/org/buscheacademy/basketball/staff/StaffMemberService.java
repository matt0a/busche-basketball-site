package org.buscheacademy.basketball.staff;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.CreateOrUpdateStaffMemberRequest;
import org.buscheacademy.basketball.dto.StaffMemberDto;
import org.buscheacademy.basketball.team.TeamLevel;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffMemberService {

    private final StaffMemberRepository staffMemberRepository;

    // ---------- Admin ----------

    public List<StaffMemberDto> getAllStaff() {
        return staffMemberRepository.findAllByOrderByDisplayOrderAscFullNameAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "publicStaff", allEntries = true),
            @CacheEvict(cacheNames = "publicStaffMember", allEntries = true)
    })
    public StaffMemberDto createStaff(CreateOrUpdateStaffMemberRequest request) {
        StaffMember staff = StaffMember.builder()
                .fullName(request.fullName())
                .teamLevel(request.teamLevel())
                .position(request.position())
                .displayOrder(request.displayOrder())
                .primaryPhotoUrl(request.primaryPhotoUrl())
                .secondaryPhotoUrl(request.secondaryPhotoUrl())
                .bio(request.bio())
                .email(request.email())
                .phone(request.phone())
                .active(request.active())
                .adminStaff(request.adminStaff())
                .staffCategory(request.staffCategory())
                .build();

        return toDto(staffMemberRepository.save(staff));
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "publicStaff", allEntries = true),
            @CacheEvict(cacheNames = "publicStaffMember", allEntries = true)
    })
    public StaffMemberDto updateStaff(Long id, CreateOrUpdateStaffMemberRequest request) {
        StaffMember staff = staffMemberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found: " + id));

        staff.setFullName(request.fullName());
        staff.setTeamLevel(request.teamLevel());
        staff.setPosition(request.position());
        staff.setDisplayOrder(request.displayOrder());
        staff.setPrimaryPhotoUrl(request.primaryPhotoUrl());
        staff.setSecondaryPhotoUrl(request.secondaryPhotoUrl());
        staff.setBio(request.bio());
        staff.setEmail(request.email());
        staff.setPhone(request.phone());
        staff.setActive(request.active());
        staff.setAdminStaff(request.adminStaff());
        staff.setStaffCategory(request.staffCategory());

        return toDto(staffMemberRepository.save(staff));
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "publicStaff", allEntries = true),
            @CacheEvict(cacheNames = "publicStaffMember", allEntries = true)
    })
    public void deleteStaff(Long id) {
        if (!staffMemberRepository.existsById(id)) {
            throw new IllegalArgumentException("Staff member not found: " + id);
        }
        staffMemberRepository.deleteById(id);
    }

    // ---------- Public ----------

    @Cacheable(cacheNames = "publicStaff",
            key = "((#teamLevel == null ? 'ALL' : #teamLevel.name()) + '_' + (#staffCategory == null ? 'ALL' : #staffCategory.name()))")
    public List<StaffMemberDto> getPublicStaff(TeamLevel teamLevel, StaffCategory staffCategory) {
        List<StaffMember> staff;
        if (teamLevel != null && staffCategory != null) {
            staff = staffMemberRepository
                    .findByTeamLevelAndStaffCategoryAndActiveTrueOrderByDisplayOrderAscFullNameAsc(teamLevel, staffCategory);
        } else if (teamLevel != null) {
            staff = staffMemberRepository
                    .findByTeamLevelAndActiveTrueOrderByDisplayOrderAscFullNameAsc(teamLevel);
        } else if (staffCategory != null) {
            staff = staffMemberRepository
                    .findByStaffCategoryAndActiveTrueOrderByDisplayOrderAscFullNameAsc(staffCategory);
        } else {
            staff = staffMemberRepository
                    .findByActiveTrueOrderByDisplayOrderAscFullNameAsc();
        }

        return staff.stream()
                .map(this::toDto)
                .toList();
    }

    @Cacheable(cacheNames = "publicStaffMember", key = "#id")
    public StaffMemberDto getPublicStaffMember(Long id) {
        StaffMember staff = staffMemberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found: " + id));

        if (!staff.isActive()) {
            throw new IllegalArgumentException("Staff member not active: " + id);
        }

        return toDto(staff);
    }

    // ---------- Mapper ----------

    private StaffMemberDto toDto(StaffMember staff) {
        return new StaffMemberDto(
                staff.getId(),
                staff.getFullName(),
                staff.getTeamLevel(),
                staff.getPosition(),
                staff.getDisplayOrder(),
                staff.getPrimaryPhotoUrl(),
                staff.getSecondaryPhotoUrl(),
                staff.getBio(),
                staff.getEmail(),
                staff.getPhone(),
                staff.isActive(),
                staff.isAdminStaff(),
                staff.getStaffCategory()
        );
    }
}
