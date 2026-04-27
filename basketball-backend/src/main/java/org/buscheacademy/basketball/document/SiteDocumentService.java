package org.buscheacademy.basketball.document;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.SiteDocumentDto;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SiteDocumentService {

    private final SiteDocumentRepository repository;
    private final DocumentStorageService storageService;

    public List<SiteDocument> getAll() {
        return repository.findAll();
    }

    public Optional<SiteDocument> getByKey(String key) {
        return repository.findByDocumentKey(key);
    }

    public SiteDocument upsert(String key, String fileUrl) {
        SiteDocument doc = repository.findByDocumentKey(key)
                .orElseGet(() -> SiteDocument.builder().documentKey(key).build());
        doc.setFileUrl(fileUrl);
        doc.setUploadedAt(Instant.now());
        return repository.save(doc);
    }

    public void deleteByKey(String key) {
        repository.findByDocumentKey(key).ifPresent(doc -> {
            if (doc.getFileUrl() != null && !doc.getFileUrl().isBlank()) {
                storageService.deleteDocument(doc.getFileUrl());
            }
            repository.delete(doc);
        });
    }

    public SiteDocumentDto toDto(SiteDocument doc) {
        return new SiteDocumentDto(
                doc.getId(),
                doc.getDocumentKey(),
                doc.getFileUrl(),
                doc.getUploadedAt() != null ? doc.getUploadedAt().toString() : null
        );
    }
}
