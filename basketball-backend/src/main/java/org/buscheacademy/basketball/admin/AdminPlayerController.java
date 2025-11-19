package org.buscheacademy.basketball.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.CreateOrUpdatePlayerRequest;
import org.buscheacademy.basketball.dto.PlayerDto;
import org.buscheacademy.basketball.player.PlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/players")
@RequiredArgsConstructor
public class AdminPlayerController {

    private final PlayerService playerService;

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<PlayerDto>> listPlayersByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(playerService.getPlayersByTeam(teamId));
    }

    @PostMapping
    public ResponseEntity<PlayerDto> createPlayer(@RequestBody @Valid CreateOrUpdatePlayerRequest request) {
        return ResponseEntity.ok(playerService.createPlayer(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerDto> updatePlayer(@PathVariable Long id,
                                                  @RequestBody @Valid CreateOrUpdatePlayerRequest request) {
        return ResponseEntity.ok(playerService.updatePlayer(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }
}
