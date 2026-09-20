package org.buscheacademy.basketball.dining;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.DiningMenuDto;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiningMenuService {

    private final DiningMenuRepository repository;
    private final DiningMenuImageStorageService storageService;

    public List<DiningMenu> getAll() {
        return repository.findAllByOrderByDisplayOrderAscUploadedAtDesc();
    }

    public DiningMenu create(String title, String imageUrl, Integer displayOrder) {
        DiningMenu menu = DiningMenu.builder()
                .title(title)
                .imageUrl(imageUrl)
                .displayOrder(displayOrder != null ? displayOrder : 0)
                .uploadedAt(Instant.now())
                .build();
        return repository.save(menu);
    }

    public void delete(Long id) {
        repository.findById(id).ifPresent(menu -> {
            if (menu.getImageUrl() != null && !menu.getImageUrl().isBlank()) {
                storageService.deleteMenuImage(menu.getImageUrl());
            }
            repository.delete(menu);
        });
    }

    public DiningMenuDto toDto(DiningMenu menu) {
        return new DiningMenuDto(
                menu.getId(),
                menu.getTitle(),
                menu.getImageUrl(),
                menu.getDisplayOrder(),
                menu.getUploadedAt() != null ? menu.getUploadedAt().toString() : null
        );
    }
}
