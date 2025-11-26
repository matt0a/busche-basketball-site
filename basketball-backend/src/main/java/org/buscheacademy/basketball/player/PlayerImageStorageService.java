package org.buscheacademy.basketball.player;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlayerImageStorageService {

    @Value("${app.upload.player-dir:uploads/players}")
    private String playerDir;

    /**
     * Saves the uploaded image to disk and returns the URL path
     * (e.g. "/uploads/players/abcd1234.webp") that the frontend can use.
     */
    public String storePlayerPhoto(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() != null
                ? file.getOriginalFilename()
                : "player-photo");

        String extension = "";
        int dot = originalName.lastIndexOf('.');
        if (dot != -1) {
            extension = originalName.substring(dot);
        }

        String filename = UUID.randomUUID() + extension;

        try {
            Path uploadRoot = Paths.get(playerDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadRoot);

            Path target = uploadRoot.resolve(filename);

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }

            // This path lines up with the static handler in StaticResourceConfig
            return "/uploads/players/" + filename;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store player photo", ex);
        }
    }
}
