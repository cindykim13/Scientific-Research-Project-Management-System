package com.researchsystem.backend.service;

import com.researchsystem.backend.dto.request.AssignTopicsRequest;
import com.researchsystem.backend.dto.request.CouncilAssignmentRequest;
import com.researchsystem.backend.dto.request.CouncilCreateRequest;
import com.researchsystem.backend.dto.response.CouncilDetailResponse;
import com.researchsystem.backend.dto.response.CouncilListResponse;
import com.researchsystem.backend.dto.response.CouncilReadinessResponse;
import com.researchsystem.backend.dto.response.TopicListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CouncilService {

    /**
     * Creates a new evaluation council with the provided metadata.
     *
     * @param request validated creation payload
     * @return the persisted council detail
     */
    CouncilDetailResponse createCouncil(CouncilCreateRequest request);

    /**
     * Returns a paginated list of all councils. Accessible by MANAGER and ADMIN.
     */
    Page<CouncilListResponse> getAllCouncils(Pageable pageable);

    /**
     * Returns the full detail view of a council, including its members and assigned topics.
     *
     * @throws jakarta.persistence.EntityNotFoundException if the council does not exist
     */
    CouncilDetailResponse getCouncilById(Long id);

    /**
     * Assigns experts with explicit {@link com.researchsystem.backend.domain.enums.CouncilRole}
     * values (PRESIDENT, SECRETARY, MEMBER). Enforces at most one PRESIDENT and one SECRETARY per council,
     * COUNCIL system role for each user, uniqueness, and the investigator-exclusion rule.
     */
    void assignCouncilMembers(Long councilId, CouncilAssignmentRequest request);

    /**
     * Removes a member from a council (e.g. mistaken assignment).
     */
    void removeCouncilMember(Long councilId, Long userId);

    /**
     * Unassigns a topic from a council and returns it to {@code DEPT_APPROVED} status.
     */
    void removeTopicFromCouncil(Long councilId, Long topicId);

    /**
     * Assigns a list of DEPT_APPROVED topics to the specified council for evaluation.
     *
     * @throws IllegalStateException if a topic is not in the correct status for council assignment
     */
    void assignTopics(Long councilId, AssignTopicsRequest request);

    /**
     * Returns all topics assigned to any council that the expert (COUNCIL role) belongs to.
     *
     * @param expertEmail email of the authenticated expert user
     * @param pageable    pagination parameters
     */
    Page<TopicListResponse> getExpertTopics(String expertEmail, Pageable pageable);

    /**
     * Checks whether all non-secretary council members have submitted their evaluations
     * and returns a detailed readiness status object.
     *
     * @param councilId ID of the council to inspect
     * @return readiness summary including counts and the ready flag
     */
    CouncilReadinessResponse getEvaluationStatus(Long councilId, Long topicId);

    /**
     * Low-level readiness check returning a simple boolean.
     *
     * @return {@code true} if every non-secretary member has exactly one SUBMITTED evaluation
     */
    boolean checkCouncilReadiness(Long councilId, Long topicId);
}
