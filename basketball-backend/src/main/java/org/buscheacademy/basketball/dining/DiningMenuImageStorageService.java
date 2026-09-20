package org.buscheacademy.basketball.dining;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiningMenuImageStorageService {

    /**
     * The file extension is derived from the validated content type rather than the
     * uploaded filename, so a mislabelled upload cannot place a misleading extension
     * on a publicly readable S3 key.
     */
    private static final Map<String, String> ALLOWED_CONTENT_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    private final S3Client s3Client;

    @Value("${app.s3.bucket-name}")
    private String bucketName;

    @Value("${app.s3.region:us-east-1}")
    private String region;

    @Value("${app.s3.public-base-url:}")
    private String publicBaseUrl;

    @Value("${app.s3.menu-prefix:menus/}")
    private String menuPrefix;

    public String storeMenuImage(MultipartFile file) {
        String extension = ALLOWED_CONTENT_TYPES.get(file.getContentType());
        if (extension == null) {
            throw new IllegalArgumentException("Only JPEG, PNG, or WebP images are accepted");
        }

        if (bucketName == null || bucketName.isBlank()) {
            throw new IllegalStateException("S3 bucket is not configured (app.s3.bucket-name is blank)");
        }

        String key = menuPrefix + UUID.randomUUID() + extension;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(
                    putRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            return buildPublicUrl(key);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store dining menu image", ex);
        }
    }

    public void deleteMenuImage(String fileUrl) {
        String s3Key = URI.create(fileUrl).getPath().replaceFirst("^/", "");
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .build());
    }

    private String buildPublicUrl(String key) {
        if (publicBaseUrl != null && !publicBaseUrl.isBlank()) {
            if (publicBaseUrl.endsWith("/")) {
                return publicBaseUrl + key;
            } else {
                return publicBaseUrl + "/" + key;
            }
        }
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
    }
}
