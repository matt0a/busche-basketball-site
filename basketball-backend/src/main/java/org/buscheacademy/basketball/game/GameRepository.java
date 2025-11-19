package org.buscheacademy.basketball.game;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {

    // Full schedule ordered by date/time
    List<Game> findAllByOrderByGameDateTimeAsc();

    // Upcoming games (all teams)
    List<Game> findByGameDateTimeAfterOrderByGameDateTimeAsc(LocalDateTime now);

    // Recent games (all teams), limited by service layer
    List<Game> findByGameDateTimeBeforeOrderByGameDateTimeDesc(LocalDateTime now);

    // If you want per-team versions:
    List<Game> findByTeamIdOrderByGameDateTimeAsc(Long teamId);

    List<Game> findByTeamIdAndGameDateTimeAfterOrderByGameDateTimeAsc(Long teamId, LocalDateTime now);

    List<Game> findByTeamIdAndGameDateTimeBeforeOrderByGameDateTimeDesc(Long teamId, LocalDateTime now);
}
