package com.researchsystem.backend.service;

import com.researchsystem.backend.dto.request.MinuteRequest;
import com.researchsystem.backend.dto.response.MinuteResponse;

public interface MinuteService {

    /**
     * Submits the final meeting minute for a council after evaluation is complete.
     * Automatically computes the averageScore from all SUBMITTED evaluations
     * in the council and persists the Minute entity.
     *
     * @param request    validated payload with councilId, comments, finalDecision, and legalConfirmation
     * @param actorEmail email of the authenticated COUNCIL user
     * @return the persisted meeting minute
     * @throws jakarta.persistence.EntityNotFoundException if the council is not found
     * @throws IllegalStateException                       if not all evaluations have been submitted yet
     */
    MinuteResponse submitMinute(MinuteRequest request, String actorEmail);
}
