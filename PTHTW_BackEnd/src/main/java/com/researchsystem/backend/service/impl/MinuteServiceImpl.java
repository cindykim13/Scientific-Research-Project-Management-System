package com.researchsystem.backend.service.impl;

import com.researchsystem.backend.domain.entity.Council;
import com.researchsystem.backend.domain.entity.CouncilMember;
import com.researchsystem.backend.domain.entity.Evaluation;
import com.researchsystem.backend.domain.entity.Minute;
import com.researchsystem.backend.domain.enums.CouncilRole;
import com.researchsystem.backend.domain.enums.SubmissionStatus;
import com.researchsystem.backend.dto.request.MinuteRequest;
import com.researchsystem.backend.dto.response.MinuteResponse;
import com.researchsystem.backend.repository.CouncilMemberRepository;
import com.researchsystem.backend.repository.CouncilRepository;
import com.researchsystem.backend.repository.EvaluationRepository;
import com.researchsystem.backend.repository.MinuteRepository;
import com.researchsystem.backend.service.MinuteService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MinuteServiceImpl implements MinuteService {

    private final MinuteRepository minuteRepository;
    private final CouncilRepository councilRepository;
    private final CouncilMemberRepository councilMemberRepository;
    private final EvaluationRepository evaluationRepository;

    @Override
    public MinuteResponse submitMinute(MinuteRequest request, String actorEmail) {
        Council council = councilRepository.findById(request.getCouncilId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Council not found with id: " + request.getCouncilId()));

        List<CouncilMember> nonSecretaries = councilMemberRepository
                .findByCouncilCouncilId(request.getCouncilId())
                .stream()
                .filter(m -> m.getCouncilRole() != CouncilRole.SECRETARY)
                .toList();

        if (nonSecretaries.isEmpty()) {
            throw new IllegalStateException("Council has no eligible (non-secretary) members to evaluate");
        }

        List<Evaluation> submittedEvaluations = evaluationRepository
                .findByCouncilMemberInAndSubmissionStatus(nonSecretaries, SubmissionStatus.SUBMITTED);

        if (submittedEvaluations.size() != nonSecretaries.size()) {
            throw new IllegalStateException(
                    "Not all council members have submitted their evaluations. " +
                    "Submitted: " + submittedEvaluations.size() + " / " + nonSecretaries.size());
        }

        BigDecimal averageScore = submittedEvaluations.stream()
                .map(Evaluation::getTotalScore)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(submittedEvaluations.size()), 2, RoundingMode.HALF_UP);

        Minute minute = Minute.builder()
                .council(council)
                .averageScore(averageScore)
                .synthesizedComments(request.getSynthesizedComments())
                .finalDecision(request.getFinalDecision())
                .legalConfirmation(Boolean.TRUE.equals(request.getLegalConfirmation()))
                .build();

        Minute saved = minuteRepository.save(minute);
        return toMinuteResponse(saved, council);
    }

    private MinuteResponse toMinuteResponse(Minute minute, Council council) {
        return MinuteResponse.builder()
                .minuteId(minute.getMinuteId())
                .councilId(council.getCouncilId())
                .councilName(council.getCouncilName())
                .averageScore(minute.getAverageScore())
                .synthesizedComments(minute.getSynthesizedComments())
                .finalDecision(minute.getFinalDecision())
                .legalConfirmation(minute.isLegalConfirmation())
                .createdAt(minute.getCreatedAt())
                .build();
    }
}
