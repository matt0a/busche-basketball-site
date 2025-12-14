package org.buscheacademy.basketball.staff;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class StaffPhotoStorageService {

    private final S3Client s3Client;

    @Value("${app.s3.bucket-name}")
    private String bucketName;

    @Value("${app.s3.region:us-east-1}")
    private String region;

    @Value("${app.s3.public-base-url:}")
    private String publicBaseUrl;

    @Value("${app.s3.staff-prefix:staff/}")
    private String staffPrefix;

    public String saveStaffPhoto(MultipartFile file) {
        if (bucketName == null || bucketName.isBlank()) {
            throw new IllegalStateException("S3 bucket is not configured (app.s3.bucket-name is blank)");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String key = staffPrefix + UUID.randomUUID() + extension;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .acl(ObjectCannedACL.PUBLIC_READ) // public object
                    .build();

            s3Client.putObject(
                    putRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            String url = buildPublicUrl(key);
            log.info("Stored staff photo in S3 at key {} (url={})", key, url);
            return url;
        } catch (IOException e) {
            log.error("Failed to store staff photo in S3", e);
            throw new RuntimeException("Failed to store staff photo", e);
        }
    }

    private String buildPublicUrl(String key) {
        // If you're using CloudFront or a custom domain, prefer that.
        if (publicBaseUrl != null && !publicBaseUrl.isBlank()) {
            if (publicBaseUrl.endsWith("/")) {
                return publicBaseUrl + key;
            } else {
                return publicBaseUrl + "/" + key;
            }
        }

        // Default S3 virtual-hosted–style URL
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
    }
}
