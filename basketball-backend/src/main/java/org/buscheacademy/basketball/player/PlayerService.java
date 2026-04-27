package org.buscheacademy.basketball.player;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.CreateOrUpdatePlayerRequest;
import org.buscheacademy.basketball.dto.PlayerDto;
import org.buscheacademy.basketball.team.Team;
import org.buscheacademy.basketball.team.TeamService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamService teamService;

    // ---------- Public ----------

    @Cacheable(cacheNames = "playersByTeam", key = "#teamId")
    public List<PlayerDto> getPlayersByTeam(Long teamId) {
        return playerRepository.findByTeamIdOrderByJerseyNumberAsc(teamId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    // ---------- Admin CRUD ----------

    @CacheEvict(cacheNames = "playersByTeam", allEntries = true)
    public PlayerDto createPlayer(CreateOrUpdatePlayerRequest request) {
        Team team = teamService.getByIdOrThrow(request.teamId());

        Player player = Player.builder()
                .team(team)
                .firstName(request.firstName())
                .lastName(request.lastName())
                .jerseyNumber(request.jerseyNumber())
                .position(request.position())
                .height(request.height())
                .gradYear(request.gradYear())
                .country(request.country())
                .photoUrl(request.photoUrl())
                .build();

        return toDto(playerRepository.save(player));
    }

    @CacheEvict(cacheNames = "playersByTeam", allEntries = true)
    public PlayerDto updatePlayer(Long id, CreateOrUpdatePlayerRequest request) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Player not found: " + id));

        Team team = teamService.getByIdOrThrow(request.teamId());

        player.setTeam(team);
        player.setFirstName(request.firstName());
        player.setLastName(request.lastName());
        player.setJerseyNumber(request.jerseyNumber());
        player.setPosition(request.position());
        player.setHeight(request.height());
        player.setGradYear(request.gradYear());
        player.setCountry(request.country());
        player.setPhotoUrl(request.photoUrl());

        return toDto(playerRepository.save(player));
    }

    @CacheEvict(cacheNames = "playersByTeam", allEntries = true)
    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new IllegalArgumentException("Player not found: " + id);
        }
        playerRepository.deleteById(id);
    }

    // ---------- Mapper ----------

    private PlayerDto toDto(Player player) {
        return new PlayerDto(
                player.getId(),
                player.getFirstName(),
                player.getLastName(),
                player.getJerseyNumber(),
                player.getPosition(),
                player.getHeight(),
                player.getGradYear(),
                player.getCountry(),
                player.getPhotoUrl(),
                player.getTeam().getId(),
                player.getTeam().getName()
        );
    }
}
