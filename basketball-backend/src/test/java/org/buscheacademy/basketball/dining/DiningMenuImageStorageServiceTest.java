package org.buscheacademy.basketball.dining;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayOutputStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiningMenuImageStorageServiceTest {

    @Mock
    private S3Client s3Client;

    private DiningMenuImageStorageService service;

    private static final byte[] JPEG_HEADER = { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0 };
    private static final byte[] PNG_HEADER =
            { (byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0 };

    @BeforeEach
    void setUp() {
        service = new DiningMenuImageStorageService(s3Client);
        ReflectionTestUtils.setField(service, "bucketName", "busche-media");
        ReflectionTestUtils.setField(service, "region", "us-east-2");
        ReflectionTestUtils.setField(service, "publicBaseUrl", "");
        ReflectionTestUtils.setField(service, "menuPrefix", "menus/");
    }

    private static byte[] withHeader(byte[] header, int totalLength) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        out.writeBytes(header);
        for (int i = header.length; i < totalLength; i++) {
            out.write('x');
        }
        return out.toByteArray();
    }

    private MockMultipartFile file(String contentType, byte[] content) {
        return new MockMultipartFile("file", "menu.bin", contentType, content);
    }

    // ---------- upload ----------

    @Test
    void storesRealJpegUnderMenuPrefixWithUuidName() {
        String url = service.storeMenuImage(file("image/jpeg", withHeader(JPEG_HEADER, 64)));

        ArgumentCaptor<PutObjectRequest> put = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(put.capture(), any(RequestBody.class));

        assertThat(put.getValue().key()).startsWith("menus/").endsWith(".jpg");
        assertThat(put.getValue().contentType()).isEqualTo("image/jpeg");
        assertThat(url).isEqualTo(
                "https://busche-media.s3.us-east-2.amazonaws.com/" + put.getValue().key());
    }

    @Test
    void storesRealPng() {
        service.storeMenuImage(file("image/png", withHeader(PNG_HEADER, 64)));

        ArgumentCaptor<PutObjectRequest> put = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(put.capture(), any(RequestBody.class));
        assertThat(put.getValue().key()).endsWith(".png");
    }

    @Test
    void rejectsDisallowedContentType() {
        assertThatThrownBy(() -> service.storeMenuImage(file("application/pdf", withHeader(JPEG_HEADER, 32))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Only JPEG, PNG, or WebP");

        verifyNoInteractions(s3Client);
    }

    @Test
    void rejectsNonImageBytesMasqueradingAsJpeg() {
        byte[] html = "<html><script>alert(1)</script></html>".getBytes();

        assertThatThrownBy(() -> service.storeMenuImage(file("image/jpeg", html)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not match its declared image type");

        verifyNoInteractions(s3Client);
    }

    @Test
    void rejectsPngBytesDeclaredAsJpeg() {
        assertThatThrownBy(() -> service.storeMenuImage(file("image/jpeg", withHeader(PNG_HEADER, 64))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not match its declared image type");

        verifyNoInteractions(s3Client);
    }

    @Test
    void rejectsTruncatedFileTooShortToIdentify() {
        assertThatThrownBy(() -> service.storeMenuImage(file("image/jpeg", new byte[] { (byte) 0xFF })))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not match its declared image type");

        verifyNoInteractions(s3Client);
    }

    @Test
    void failsClearlyWhenBucketNotConfigured() {
        ReflectionTestUtils.setField(service, "bucketName", "  ");

        assertThatThrownBy(() -> service.storeMenuImage(file("image/jpeg", withHeader(JPEG_HEADER, 32))))
                .isInstanceOf(IllegalStateException.class);

        verifyNoInteractions(s3Client);
    }

    // ---------- delete ----------

    @Test
    void deleteDerivesKeyFromUrl() {
        service.deleteMenuImage("https://busche-media.s3.us-east-2.amazonaws.com/menus/abc.jpg");

        ArgumentCaptor<DeleteObjectRequest> del = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(del.capture());
        assertThat(del.getValue().key()).isEqualTo("menus/abc.jpg");
    }

    @Test
    void deleteAnchorsOnPrefixWhenPublicBaseUrlHasItsOwnPathSegment() {
        service.deleteMenuImage("https://cdn.example.com/assets/menus/abc.jpg");

        ArgumentCaptor<DeleteObjectRequest> del = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(del.capture());
        // "assets/" is a CDN path, not part of the S3 key.
        assertThat(del.getValue().key()).isEqualTo("menus/abc.jpg");
    }

    @Test
    void deleteRefusesObjectOutsideMenuPrefix() {
        assertThatThrownBy(() ->
                service.deleteMenuImage("https://busche-media.s3.us-east-2.amazonaws.com/staff/headshot.jpg"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Refusing to delete");

        verifyNoInteractions(s3Client);
    }

    @Test
    void deleteRefusesUrlFromAnUnrelatedHost() {
        assertThatThrownBy(() -> service.deleteMenuImage("http://localhost:5173/some-local-file.jpg"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Refusing to delete");

        verifyNoInteractions(s3Client);
    }
}
