package org.buscheacademy.basketball.admin;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dining.DiningMenuImageStorageService;
import org.buscheacademy.basketball.dining.DiningMenuService;
import org.buscheacademy.basketball.dto.DiningMenuDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/dining-menus")
@RequiredArgsConstructor
public class AdminDiningMenuController {

    private final DiningMenuImageStorageService storageService;
    private final DiningMenuService menuService;

    @GetMapping
    public ResponseEntity<List<DiningMenuDto>> getAll() {
        return ResponseEntity.ok(
                menuService.getAll().stream().map(menuService::toDto).toList()
        );
    }

    @PostMapping
    public ResponseEntity<DiningMenuDto> create(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "displayOrder", required = false) Integer displayOrder) {

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("A menu title is required");
        }

        String url = storageService.storeMenuImage(file);
        DiningMenuDto dto = menuService.toDto(menuService.create(title.trim(), url, displayOrder));
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        menuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
