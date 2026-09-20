package org.buscheacademy.basketball.admin;

import org.buscheacademy.basketball.auth.CustomUserDetailsService;
import org.buscheacademy.basketball.auth.JwtAuthenticationFilter;
import org.buscheacademy.basketball.dining.DiningMenu;
import org.buscheacademy.basketball.dining.DiningMenuImageStorageService;
import org.buscheacademy.basketball.dining.DiningMenuService;
import org.buscheacademy.basketball.dto.DiningMenuDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * HTTP contract for the admin dining-menu endpoints.
 * Security filters are disabled here — authentication is enforced by SecurityConfig
 * (/admin/** is .authenticated()) and is covered separately.
 */
@WebMvcTest(controllers = AdminDiningMenuController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminDiningMenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DiningMenuService menuService;

    @MockitoBean
    private DiningMenuImageStorageService storageService;

    // Required only so SecurityConfig can be constructed in the slice.
    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;
    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private static final String URL = "https://cdn.example.com/menus/abc.jpg";

    private DiningMenuDto dto() {
        return new DiningMenuDto(1L, "Week Ending 9/20/26", URL, 0, Instant.EPOCH.toString());
    }

    private MockMultipartFile jpeg() {
        return new MockMultipartFile("file", "menu.jpg", MediaType.IMAGE_JPEG_VALUE, "bytes".getBytes());
    }

    @Test
    void create_uploadsToS3ThenPersistsAndReturnsDto() throws Exception {
        when(storageService.storeMenuImage(any())).thenReturn(URL);
        when(menuService.create(eq("Week Ending 9/20/26"), eq(URL), eq(0)))
                .thenReturn(mock(DiningMenu.class));
        when(menuService.toDto(any())).thenReturn(dto());

        mockMvc.perform(multipart("/admin/dining-menus")
                        .file(jpeg())
                        .param("title", "Week Ending 9/20/26")
                        .param("displayOrder", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Week Ending 9/20/26"))
                .andExpect(jsonPath("$.imageUrl").value(URL));

        verify(storageService).storeMenuImage(any());
        verify(menuService).create("Week Ending 9/20/26", URL, 0);
    }

    @Test
    void create_trimsTitle() throws Exception {
        when(storageService.storeMenuImage(any())).thenReturn(URL);
        when(menuService.create(anyString(), anyString(), any())).thenReturn(mock(DiningMenu.class));
        when(menuService.toDto(any())).thenReturn(dto());

        mockMvc.perform(multipart("/admin/dining-menus")
                        .file(jpeg())
                        .param("title", "  Padded Title  "))
                .andExpect(status().isOk());

        verify(menuService).create(eq("Padded Title"), anyString(), any());
    }

    @Test
    void create_rejectsBlankTitleWithoutTouchingS3() throws Exception {
        mockMvc.perform(multipart("/admin/dining-menus")
                        .file(jpeg())
                        .param("title", "   "))
                .andExpect(jsonPath("$.error").value("A menu title is required"));

        verifyNoInteractions(storageService);
        verifyNoInteractions(menuService);
    }

    @Test
    void create_propagatesStorageRejectionOfWrongContentType() throws Exception {
        when(storageService.storeMenuImage(any()))
                .thenThrow(new IllegalArgumentException("Only JPEG, PNG, or WebP images are accepted"));

        mockMvc.perform(multipart("/admin/dining-menus")
                        .file(new MockMultipartFile("file", "x.txt", MediaType.TEXT_PLAIN_VALUE, "no".getBytes()))
                        .param("title", "Bad"))
                .andExpect(jsonPath("$.error").value("Only JPEG, PNG, or WebP images are accepted"));

        verify(menuService, never()).create(anyString(), anyString(), any());
    }

    @Test
    void getAll_returnsSerialisedList() throws Exception {
        when(menuService.getAll()).thenReturn(List.of(mock(DiningMenu.class)));
        when(menuService.toDto(any())).thenReturn(dto());

        mockMvc.perform(get("/admin/dining-menus"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].displayOrder").value(0));
    }

    @Test
    void delete_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/admin/dining-menus/5"))
                .andExpect(status().isNoContent());

        verify(menuService).delete(5L);
    }
}
