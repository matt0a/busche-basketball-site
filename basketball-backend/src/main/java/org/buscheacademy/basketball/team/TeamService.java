package org.buscheacademy.basketball.team;

import lombok.RequiredArgsConstructor;
import org.buscheacademy.basketball.dto.TeamDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(team -> new TeamDto(
                        team.getId(),
                        team.getName(),
                        team.getLevel(),
                        team.getSeason(),
                        team.getDescription()
                ))
                .toList();
    }

    public Team getByIdOrThrow(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + id));
    }
}
