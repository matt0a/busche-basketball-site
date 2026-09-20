package org.buscheacademy.basketball.dining;

import org.buscheacademy.basketball.dto.DiningMenuDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiningMenuServiceTest {

    @Mock
    private DiningMenuRepository repository;

    @Mock
    private DiningMenuImageStorageService storageService;

    @InjectMocks
    private DiningMenuService service;

    private DiningMenu menu(Long id, String imageUrl) {
        return DiningMenu.builder()
                .id(id)
                .title("Week Ending 9/20/26")
                .imageUrl(imageUrl)
                .displayOrder(0)
                .uploadedAt(Instant.parse("2026-09-20T12:00:00Z"))
                .build();
    }

    @Test
    void getAll_usesDisplayOrderThenNewestFirst() {
        service.getAll();
        verify(repository).findAllByOrderByDisplayOrderAscUploadedAtDesc();
    }

    @Test
    void create_stampsUploadedAtAndPersists() {
        when(repository.save(any(DiningMenu.class))).thenAnswer(i -> i.getArgument(0));

        service.create("Labor Day Cook-In", "https://cdn/menus/a.jpg", 2);

        ArgumentCaptor<DiningMenu> saved = ArgumentCaptor.forClass(DiningMenu.class);
        verify(repository).save(saved.capture());

        assertThat(saved.getValue().getTitle()).isEqualTo("Labor Day Cook-In");
        assertThat(saved.getValue().getImageUrl()).isEqualTo("https://cdn/menus/a.jpg");
        assertThat(saved.getValue().getDisplayOrder()).isEqualTo(2);
        assertThat(saved.getValue().getUploadedAt()).isNotNull();
    }

    @Test
    void create_defaultsDisplayOrderToZeroWhenNull() {
        when(repository.save(any(DiningMenu.class))).thenAnswer(i -> i.getArgument(0));

        service.create("Weekly", "https://cdn/menus/b.jpg", null);

        ArgumentCaptor<DiningMenu> saved = ArgumentCaptor.forClass(DiningMenu.class);
        verify(repository).save(saved.capture());
        assertThat(saved.getValue().getDisplayOrder()).isZero();
    }

    @Test
    void delete_removesS3ObjectBeforeRow() {
        DiningMenu existing = menu(7L, "https://cdn/menus/c.jpg");
        when(repository.findById(7L)).thenReturn(Optional.of(existing));

        service.delete(7L);

        InOrder order = inOrder(storageService, repository);
        order.verify(storageService).deleteMenuImage("https://cdn/menus/c.jpg");
        order.verify(repository).delete(existing);
    }

    @Test
    void delete_skipsStorageWhenImageUrlBlank() {
        DiningMenu existing = menu(8L, "   ");
        when(repository.findById(8L)).thenReturn(Optional.of(existing));

        service.delete(8L);

        verify(storageService, never()).deleteMenuImage(anyString());
        verify(repository).delete(existing);
    }

    @Test
    void delete_isNoOpForMissingId() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        service.delete(99L);

        verify(storageService, never()).deleteMenuImage(anyString());
        verify(repository, never()).delete(any());
    }

    @Test
    void toDto_mapsEveryFieldAndRendersInstantAsIsoString() {
        DiningMenuDto dto = service.toDto(menu(3L, "https://cdn/menus/d.jpg"));

        assertThat(dto.id()).isEqualTo(3L);
        assertThat(dto.title()).isEqualTo("Week Ending 9/20/26");
        assertThat(dto.imageUrl()).isEqualTo("https://cdn/menus/d.jpg");
        assertThat(dto.displayOrder()).isZero();
        assertThat(dto.uploadedAt()).isEqualTo("2026-09-20T12:00:00Z");
    }

    @Test
    void toDto_toleratesNullUploadedAt() {
        DiningMenu m = menu(4L, "https://cdn/menus/e.jpg");
        m.setUploadedAt(null);

        assertThat(service.toDto(m).uploadedAt()).isNull();
    }
}
