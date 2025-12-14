package org.buscheacademy.basketball.team;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.CreateOrUpdateTeamRequest;
import org.buscheacademy.basketball.dto.TeamDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public Team getByIdOrThrow(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + id));
    }

    // 👉 NEW: return a single TeamDto (useful for public / admin)
    public TeamDto getTeamDto(Long id) {
        return toDto(getByIdOrThrow(id));
    }

    // 👉 NEW: create team
    public TeamDto createTeam(CreateOrUpdateTeamRequest request) {
        Team team = new Team();
        apply(request, team);
        if (team.getSeason() == null || team.getSeason().isBlank()) {
            team.setSeason(computeCurrentSeason());
        }
        Team saved = teamRepository.save(team);
        return toDto(saved);
    }

    // 👉 NEW: update team
    public TeamDto updateTeam(Long id, CreateOrUpdateTeamRequest request) {
        Team team = getByIdOrThrow(id);
        apply(request, team);
        if (team.getSeason() == null || team.getSeason().isBlank()) {
            team.setSeason(computeCurrentSeason());
        }
        Team saved = teamRepository.save(team);
        return toDto(saved);
    }

    // 👉 NEW: delete team
    public void deleteTeam(Long id) {
        if (!teamRepository.existsById(id)) {
            return; // silently ignore if not found
        }
        teamRepository.deleteById(id);
    }

    // --- helpers ---

    private void apply(CreateOrUpdateTeamRequest request, Team team) {
        team.setName(request.getName().trim());
        team.setLevel(request.getLevel());

        // OPTIONAL: if/when you add season/description to the DTO,
        // you can also set them here, e.g.:
        // team.setSeason(request.getSeason());
        // team.setDescription(request.getDescription());
    }

    private TeamDto toDto(Team team) {
        return new TeamDto(
                team.getId(),
                team.getName(),
                team.getLevel(),
                team.getSeason(),
                team.getDescription()
        );
    }

    private String computeCurrentSeason() {
        LocalDate now  = LocalDate.now();
        int year = now.getYear();
        int month = now.getMonthValue();

        if(month >= 8){
            return year + "-" + (year + 1);
        } else {
            return (year - 1) + "-" + year;
        }
    }
}
