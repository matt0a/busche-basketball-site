package org.buscheacademy.basketball.dining;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiningMenuRepository extends JpaRepository<DiningMenu, Long> {

    List<DiningMenu> findAllByOrderByDisplayOrderAscUploadedAtDesc();
}
