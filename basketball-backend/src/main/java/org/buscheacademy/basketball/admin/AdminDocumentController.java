package org.buscheacademy.basketball.admin;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.document.DocumentStorageService;
import org.buscheacademy.basketball.document.SiteDocumentService;
import org.buscheacademy.basketball.dto.SiteDocumentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin/documents")
@RequiredArgsConstructor
public class AdminDocumentController {

    private static final Set<String> ALLOWED_KEYS =
            Set.of("HS_CURRICULUM", "PG_CURRICULUM", "CALENDAR", "CATALOG", "DORM_POLICIES");

    private final DocumentStorageService storageService;
    private final SiteDocumentService documentService;

    private void validateKey(String key) {
        if (!ALLOWED_KEYS.contains(key)) {
            throw new IllegalArgumentException("Invalid document key: " + key);
        }
    }

    @GetMapping
    public List<SiteDocumentDto> getAll() {
        return documentService.getAll().stream().map(documentService::toDto).toList();
    }

    @PostMapping("/{key}/upload")
    public ResponseEntity<SiteDocumentDto> upload(
            @PathVariable String key,
            @RequestParam("file") MultipartFile file) {
        validateKey(key);
        String url = storageService.storeDocument(file);
        SiteDocumentDto dto = documentService.toDto(documentService.upsert(key, url));
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<Void> delete(@PathVariable String key) {
        validateKey(key);
        documentService.deleteByKey(key);
        return ResponseEntity.noContent().build();
    }
}
