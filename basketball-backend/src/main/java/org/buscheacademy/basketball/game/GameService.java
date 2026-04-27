package org.buscheacademy.basketball.game;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.CreateOrUpdateGameRequest;
import org.buscheacademy.basketball.dto.GameDto;
import org.buscheacademy.basketball.team.Team;
import org.buscheacademy.basketball.team.TeamService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final TeamService teamService;

    // ---------- Public read methods ----------

    @Cacheable("scheduleFull")
    public List<GameDto> getFullSchedule() {
        return gameRepository.findAllByOrderByGameDateTimeAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Cacheable(cacheNames = "scheduleUpcoming", key = "#limit")
    public List<GameDto> getUpcomingGames(int limit) {
        LocalDateTime now = LocalDateTime.now();
        return gameRepository.findByGameDateTimeAfterOrderByGameDateTimeAsc(now)
                .stream()
                .limit(limit)
                .map(this::toDto)
                .toList();
    }

    @Cacheable(cacheNames = "scheduleRecent", key = "#limit")
    public List<GameDto> getRecentGames(int limit) {
        LocalDateTime now = LocalDateTime.now();
        return gameRepository.findByGameDateTimeBeforeOrderByGameDateTimeDesc(now)
                .stream()
                .limit(limit)
                .map(this::toDto)
                .toList();
    }

    // ---------- Admin CRUD methods ----------

    @Caching(evict = {
            @CacheEvict(cacheNames = "scheduleFull", allEntries = true),
            @CacheEvict(cacheNames = "scheduleUpcoming", allEntries = true),
            @CacheEvict(cacheNames = "scheduleRecent", allEntries = true)
    })
    public GameDto createGame(CreateOrUpdateGameRequest request) {
        Team team = teamService.getByIdOrThrow(request.teamId());

        Game game = Game.builder()
                .team(team)
                .opponent(request.opponent())
                .gameDateTime(request.gameDateTime())
                .homeAway(request.homeAway())
                .location(request.location())
                .scoreUs(request.scoreUs())
                .scoreThem(request.scoreThem())
                .conferenceGame(request.conferenceGame())
                .notes(request.notes())
                .build();

        return toDto(gameRepository.save(game));
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "scheduleFull", allEntries = true),
            @CacheEvict(cacheNames = "scheduleUpcoming", allEntries = true),
            @CacheEvict(cacheNames = "scheduleRecent", allEntries = true)
    })
    public GameDto updateGame(Long id, CreateOrUpdateGameRequest request) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Game not found: " + id));

        Team team = teamService.getByIdOrThrow(request.teamId());

        game.setTeam(team);
        game.setOpponent(request.opponent());
        game.setGameDateTime(request.gameDateTime());
        game.setHomeAway(request.homeAway());
        game.setLocation(request.location());
        game.setScoreUs(request.scoreUs());
        game.setScoreThem(request.scoreThem());
        game.setConferenceGame(request.conferenceGame());
        game.setNotes(request.notes());

        return toDto(gameRepository.save(game));
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "scheduleFull", allEntries = true),
            @CacheEvict(cacheNames = "scheduleUpcoming", allEntries = true),
            @CacheEvict(cacheNames = "scheduleRecent", allEntries = true)
    })
    public void deleteGame(Long id) {
        if (!gameRepository.existsById(id)) {
            throw new IllegalArgumentException("Game not found: " + id);
        }
        gameRepository.deleteById(id);
    }

    // ---------- Mapper ----------

    private GameDto toDto(Game game) {
        Integer us = game.getScoreUs();
        Integer them = game.getScoreThem();
        Boolean win = null;
        if (us != null && them != null) {
            win = us > them;
        }

        return new GameDto(
                game.getId(),
                game.getTeam().getId(),
                game.getTeam().getName(),
                game.getOpponent(),
                game.getGameDateTime(),
                game.getHomeAway(),
                game.getLocation(),
                us,
                them,
                win,
                game.isConferenceGame(),
                game.getNotes()
        );
    }
}
