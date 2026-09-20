package org.buscheacademy.basketball.api;

import org.buscheacademy.basketball.auth.CustomUserDetailsService;
import org.buscheacademy.basketball.auth.JwtAuthenticationFilter;
import org.buscheacademy.basketball.dining.DiningMenu;
import org.buscheacademy.basketball.dining.DiningMenuService;
import org.buscheacademy.basketball.document.SiteDocumentService;
import org.buscheacademy.basketball.dto.DiningMenuDto;
import org.buscheacademy.basketball.game.GameService;
import org.buscheacademy.basketball.player.PlayerService;
import org.buscheacademy.basketball.staff.StaffMemberService;
import org.buscheacademy.basketball.team.TeamService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PublicApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class PublicDiningMenuEndpointTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean private DiningMenuService diningMenuService;
    @MockitoBean private TeamService teamService;
    @MockitoBean private PlayerService playerService;
    @MockitoBean private GameService gameService;
    @MockitoBean private StaffMemberService staffMemberService;
    @MockitoBean private SiteDocumentService documentService;

    @MockitoBean private CustomUserDetailsService customUserDetailsService;
    @MockitoBean private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void returnsEmptyArrayBeforeAnyMenuIsPosted() throws Exception {
        when(diningMenuService.getAll()).thenReturn(List.of());

        mockMvc.perform(get("/public/dining-menus"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void preservesServiceOrderingAndExposesOnlyPublicFields() throws Exception {
        DiningMenu weekly = mock(DiningMenu.class);
        DiningMenu special = mock(DiningMenu.class);
        when(diningMenuService.getAll()).thenReturn(List.of(weekly, special));
        when(diningMenuService.toDto(weekly))
                .thenReturn(new DiningMenuDto(1L, "Week Ending 9/20/26",
                        "https://cdn.example.com/menus/a.jpg", 0, Instant.EPOCH.toString()));
        when(diningMenuService.toDto(special))
                .thenReturn(new DiningMenuDto(2L, "Labor Day Cook-In",
                        "https://cdn.example.com/menus/b.jpg", 1, Instant.EPOCH.toString()));

        mockMvc.perform(get("/public/dining-menus"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Week Ending 9/20/26"))
                .andExpect(jsonPath("$[0].displayOrder").value(0))
                .andExpect(jsonPath("$[1].title").value("Labor Day Cook-In"))
                .andExpect(jsonPath("$[1].displayOrder").value(1));

        verify(diningMenuService).getAll();
    }
}
