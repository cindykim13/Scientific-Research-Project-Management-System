package com.researchsystem.backend.repository;

import com.researchsystem.backend.domain.entity.Council;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * List and detail paths load council members, assigned topics, and nested topic associations in one
 * fetch plan to avoid N+1 lazy loads when computing counts and mapping topics.
 */
@Repository
public interface CouncilRepository extends JpaRepository<Council, Long> {

    @EntityGraph(
            attributePaths = {
                    "councilMembers",
                    "councilMembers.user",
                    "topics",
                    "topics.investigator",
                    "topics.managingDepartment"
            })
    @Override
    Page<Council> findAll(Pageable pageable);

    @EntityGraph(
            attributePaths = {
                    "councilMembers",
                    "councilMembers.user",
                    "topics",
                    "topics.investigator",
                    "topics.managingDepartment"
            })
    @Override
    Optional<Council> findById(Long id);
}
