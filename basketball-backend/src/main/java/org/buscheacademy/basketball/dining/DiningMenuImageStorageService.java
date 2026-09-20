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
            byte[] data = file.getBytes();
            verifyMagicBytes(data, file.getContentType());

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromBytes(data));

            return buildPublicUrl(key);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store dining menu image", ex);
        }
    }

    /**
     * The multipart content type is supplied by the client, so it is only a claim.
     * Check the leading bytes actually match the declared type before putting the
     * object on a publicly readable bucket.
     */
    private void verifyMagicBytes(byte[] data, String contentType) {
        boolean matches = switch (contentType) {
            case "image/jpeg" -> data.length >= 3
                    && (data[0] & 0xFF) == 0xFF && (data[1] & 0xFF) == 0xD8 && (data[2] & 0xFF) == 0xFF;
            case "image/png" -> data.length >= 8
                    && (data[0] & 0xFF) == 0x89 && data[1] == 'P' && data[2] == 'N' && data[3] == 'G'
                    && (data[4] & 0xFF) == 0x0D && (data[5] & 0xFF) == 0x0A
                    && (data[6] & 0xFF) == 0x1A && (data[7] & 0xFF) == 0x0A;
            // RIFF....WEBP — bytes 4-7 are the little-endian file size and are not checked.
            case "image/webp" -> data.length >= 12
                    && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F'
                    && data[8] == 'W' && data[9] == 'E' && data[10] == 'B' && data[11] == 'P';
            default -> false;
        };

        if (!matches) {
            throw new IllegalArgumentException("File content does not match its declared image type");
        }
    }

    /**
     * Only the stored URL is persisted, never the S3 key, so the key has to be
     * recovered from the URL. Anchor it on the menu prefix rather than trusting the
     * whole path: that keeps a malformed or hand-edited row from targeting an object
     * outside menus/, and it stays correct when app.s3.public-base-url carries its own
     * path segment (a CloudFront origin path, say).
     */
    public void deleteMenuImage(String fileUrl) {
        String path = URI.create(fileUrl).getPath().replaceFirst("^/", "");

        int prefixStart = path.indexOf(menuPrefix);
        if (prefixStart < 0) {
            throw new IllegalArgumentException("Refusing to delete an object outside " + menuPrefix);
        }

        String s3Key = path.substring(prefixStart);
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
