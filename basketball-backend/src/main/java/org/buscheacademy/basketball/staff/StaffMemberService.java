package org.buscheacademy.basketball.staff;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.CreateOrUpdateStaffMemberRequest;
import org.buscheacademy.basketball.dto.StaffMemberDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffMemberService {

    private final StaffMemberRepository staffMemberRepository;

    // ---------- Public ----------

    public List<StaffMemberDto> getAllStaff() {
        return staffMemberRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    // ---------- Admin CRUD ----------

    public StaffMemberDto createStaff(CreateOrUpdateStaffMemberRequest request) {
        StaffMember staff = StaffMember.builder()
                .fullName(request.fullName())
                .roleTitle(request.roleTitle())
                .bio(request.bio())
                .photoUrl(request.photoUrl())
                .email(request.email())
                .phone(request.phone())
                .build();

        return toDto(staffMemberRepository.save(staff));
    }

    public StaffMemberDto updateStaff(Long id, CreateOrUpdateStaffMemberRequest request) {
        StaffMember staff = staffMemberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found: " + id));

        staff.setFullName(request.fullName());
        staff.setRoleTitle(request.roleTitle());
        staff.setBio(request.bio());
        staff.setPhotoUrl(request.photoUrl());
        staff.setEmail(request.email());
        staff.setPhone(request.phone());

        return toDto(staffMemberRepository.save(staff));
    }

    public void deleteStaff(Long id) {
        if (!staffMemberRepository.existsById(id)) {
            throw new IllegalArgumentException("Staff member not found: " + id);
        }
        staffMemberRepository.deleteById(id);
    }

    // ---------- Mapper ----------

    private StaffMemberDto toDto(StaffMember staff) {
        return new StaffMemberDto(
                staff.getId(),
                staff.getFullName(),
                staff.getRoleTitle(),
                staff.getBio(),
                staff.getPhotoUrl(),
                staff.getEmail(),
                staff.getPhone()
        );
    }
}
