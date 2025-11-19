package org.buscheacademy.basketball.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.CreateOrUpdateGameRequest;
import org.buscheacademy.basketball.dto.GameDto;
import org.buscheacademy.basketball.game.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/games")
@RequiredArgsConstructor
public class AdminGameController {

    private final GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameDto>> listAllGames() {
        return ResponseEntity.ok(gameService.getFullSchedule());
    }

    @PostMapping
    public ResponseEntity<GameDto> createGame(@RequestBody @Valid CreateOrUpdateGameRequest request) {
        return ResponseEntity.ok(gameService.createGame(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameDto> updateGame(@PathVariable Long id,
                                              @RequestBody @Valid CreateOrUpdateGameRequest request) {
        return ResponseEntity.ok(gameService.updateGame(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.noContent().build();
    }
}
