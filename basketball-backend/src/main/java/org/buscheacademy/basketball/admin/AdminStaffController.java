package org.buscheacademy.basketball.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.CreateOrUpdateStaffMemberRequest;
import org.buscheacademy.basketball.dto.PhotoUploadResponse;
import org.buscheacademy.basketball.dto.StaffMemberDto;
import org.buscheacademy.basketball.staff.StaffMemberService;
import org.buscheacademy.basketball.staff.StaffPhotoStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/staff")
@RequiredArgsConstructor
public class AdminStaffController {

    private final StaffMemberService staffMemberService;
    private final StaffPhotoStorageService staffPhotoStorageService;

    @GetMapping
    public ResponseEntity<List<StaffMemberDto>> listStaff() {
        return ResponseEntity.ok(staffMemberService.getAllStaff());
    }

    @PostMapping
    public ResponseEntity<StaffMemberDto> createStaff(
            @RequestBody @Valid CreateOrUpdateStaffMemberRequest request) {
        return ResponseEntity.ok(staffMemberService.createStaff(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffMemberDto> updateStaff(
            @PathVariable Long id,
            @RequestBody @Valid CreateOrUpdateStaffMemberRequest request) {
        return ResponseEntity.ok(staffMemberService.updateStaff(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffMemberService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/photo")
    public ResponseEntity<PhotoUploadResponse> uploadPhoto(
            @RequestParam("file") MultipartFile file) {

        String url = staffPhotoStorageService.saveStaffPhoto(file);
        return ResponseEntity.ok(new PhotoUploadResponse(url));
    }
}
