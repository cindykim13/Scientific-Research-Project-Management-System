package com.researchsystem.backend.repository;

import com.researchsystem.backend.domain.entity.User;
import com.researchsystem.backend.domain.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    long countByActiveTrue();

    @Query("""
            SELECT cm.user FROM CouncilMember cm
            LEFT JOIN Evaluation e ON cm.id = e.councilMember.id
            WHERE cm.council.id = :councilId
              AND (e.id IS NULL OR e.submissionStatus = :pendingStatus)
            """)
    List<User> findMembersPendingEvaluation(
            @Param("councilId") Long councilId,
            @Param("pendingStatus") SubmissionStatus pendingStatus);
}
