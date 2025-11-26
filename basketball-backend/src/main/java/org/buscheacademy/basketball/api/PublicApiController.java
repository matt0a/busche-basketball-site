package org.buscheacademy.basketball.api;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.GameDto;
import org.buscheacademy.basketball.dto.PlayerDto;
import org.buscheacademy.basketball.dto.StaffMemberDto;
import org.buscheacademy.basketball.dto.TeamDto;
import org.buscheacademy.basketball.game.GameService;
import org.buscheacademy.basketball.player.PlayerService;
import org.buscheacademy.basketball.staff.StaffMemberService;
import org.buscheacademy.basketball.team.TeamService;
import org.buscheacademy.basketball.team.TeamLevel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicApiController {

    private final TeamService teamService;
    private final PlayerService playerService;
    private final GameService gameService;
    private final StaffMemberService staffMemberService;

    // ---------- Teams & Roster ----------

    @GetMapping("/teams")
    public ResponseEntity<List<TeamDto>> getTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/teams/{teamId}/players")
    public ResponseEntity<List<PlayerDto>> getPlayersByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(playerService.getPlayersByTeam(teamId));
    }

    // ---------- Games / Schedule ----------

    @GetMapping("/games")
    public ResponseEntity<List<GameDto>> getFullSchedule() {
        return ResponseEntity.ok(gameService.getFullSchedule());
    }

    @GetMapping("/games/upcoming")
    public ResponseEntity<List<GameDto>> getUpcomingGames(
            @RequestParam(name = "limit", defaultValue = "3") int limit
    ) {
        return ResponseEntity.ok(gameService.getUpcomingGames(limit));
    }

    @GetMapping("/games/recent")
    public ResponseEntity<List<GameDto>> getRecentGames(
            @RequestParam(name = "limit", defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(gameService.getRecentGames(limit));
    }

    // ---------- Staff ----------
    @GetMapping("/staff")
    public ResponseEntity<List<StaffMemberDto>> getStaff(
            @RequestParam(name = "teamLevel", required = false) TeamLevel teamLevel
    ) {
        return ResponseEntity.ok(staffMemberService.getPublicStaff(teamLevel));
    }

    @GetMapping("/staff/{id}")
    public ResponseEntity<StaffMemberDto> getStaffMember(@PathVariable Long id) {
        return ResponseEntity.ok(staffMemberService.getPublicStaffMember(id));
    }
}
