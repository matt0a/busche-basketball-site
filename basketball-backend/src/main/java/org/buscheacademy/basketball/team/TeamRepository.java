package org.buscheacademy.basketball.team;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
    // Optional, if useful:
    java.util.List<Team> findByLevel(TeamLevel level);

}
