package org.buscheacademy.basketball.staff;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class StaffPhotoStorageService {

    // Store under <working-dir>/uploads/staff
    private final Path rootDir;

    public StaffPhotoStorageService() {
        // Absolute, normalized path so we’re not inside Tomcat’s temp dir
        this.rootDir = Paths.get("uploads", "staff")
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(rootDir);
            log.info("Staff photos will be stored under: {}", rootDir);
        } catch (IOException e) {
            log.error("Could not create staff uploads directory: {}", rootDir, e);
            throw new IllegalStateException("Could not create staff uploads directory", e);
        }
    }

    public String saveStaffPhoto(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Empty file");
        }

        String originalName = file.getOriginalFilename();
        String ext = "";

        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf('.'));
        }

        String filename = UUID.randomUUID() + ext;
        Path target = rootDir.resolve(filename).normalize();

        try {
            // Ensure parent exists at write time
            Files.createDirectories(target.getParent());
            // Spring 6 / Servlet 6 supports this Path overload
            file.transferTo(target);
            log.info("Stored staff photo at {}", target);
        } catch (IOException e) {
            log.error("Failed to store staff photo at {}", target, e);
            throw new RuntimeException("Failed to store staff photo", e);
        }

        // URL the frontend should use
        return "/uploads/staff/" + filename;
    }
}
