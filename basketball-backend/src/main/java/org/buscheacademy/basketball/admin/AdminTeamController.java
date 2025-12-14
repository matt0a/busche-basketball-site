package org.buscheacademy.basketball.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.CreateOrUpdateTeamRequest;
import org.buscheacademy.basketball.dto.TeamDto;
import org.buscheacademy.basketball.team.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/teams")
public class AdminTeamController {

    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<List<TeamDto>> listTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDto> getTeam(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamDto(id));
    }

    @PostMapping
    public ResponseEntity<TeamDto> createTeam(
            @Valid @RequestBody CreateOrUpdateTeamRequest request
    ) {
        TeamDto created = teamService.createTeam(request);
        return ResponseEntity
                .created(URI.create("/admin/teams/" + created.id()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamDto> updateTeam(
            @PathVariable Long id,
            @Valid @RequestBody CreateOrUpdateTeamRequest request
    ) {
        TeamDto updated = teamService.updateTeam(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}
