package com.researchsystem.backend.service.impl;

import com.researchsystem.backend.domain.entity.CouncilMember;
import com.researchsystem.backend.domain.entity.Evaluation;
import com.researchsystem.backend.domain.enums.SubmissionStatus;
import com.researchsystem.backend.dto.request.EvaluationRequest;
import com.researchsystem.backend.dto.response.EvaluationResponse;
import com.researchsystem.backend.repository.CouncilMemberRepository;
import com.researchsystem.backend.repository.EvaluationRepository;
import com.researchsystem.backend.service.EvaluationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final CouncilMemberRepository councilMemberRepository;

    @Override
    public EvaluationResponse submitEvaluation(EvaluationRequest request, String actorEmail) {
        CouncilMember member = councilMemberRepository.findById(request.getCouncilMemberId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Council member not found with id: " + request.getCouncilMemberId()));

        Optional<Evaluation> existing = evaluationRepository
                .findByCouncilMemberCouncilMemberId(member.getCouncilMemberId());

        if (existing.isPresent() && existing.get().getSubmissionStatus() == SubmissionStatus.SUBMITTED) {
            throw new IllegalStateException(
                    "Evaluation already submitted for council member id: " + member.getCouncilMemberId());
        }

        BigDecimal total = request.getScoreUrgency()
                .add(request.getScoreContent())
                .add(request.getScoreObjectives())
                .add(request.getScoreMethodology())
                .add(request.getScoreFeasibility())
                .add(request.getScoreCapacity())
                .add(request.getScoreProducts());

        Evaluation evaluation = existing.map(e -> {
            e.setScoreUrgency(request.getScoreUrgency());
            e.setScoreContent(request.getScoreContent());
            e.setScoreObjectives(request.getScoreObjectives());
            e.setScoreMethodology(request.getScoreMethodology());
            e.setScoreFeasibility(request.getScoreFeasibility());
            e.setScoreCapacity(request.getScoreCapacity());
            e.setScoreProducts(request.getScoreProducts());
            e.setTotalScore(total);
            e.setGeneralComment(request.getGeneralComment());
            e.setRecommendedDecision(request.getRecommendedDecision());
            e.setSubmissionStatus(SubmissionStatus.SUBMITTED);
            return e;
        }).orElseGet(() -> Evaluation.builder()
                .councilMember(member)
                .scoreUrgency(request.getScoreUrgency())
                .scoreContent(request.getScoreContent())
                .scoreObjectives(request.getScoreObjectives())
                .scoreMethodology(request.getScoreMethodology())
                .scoreFeasibility(request.getScoreFeasibility())
                .scoreCapacity(request.getScoreCapacity())
                .scoreProducts(request.getScoreProducts())
                .totalScore(total)
                .generalComment(request.getGeneralComment())
                .recommendedDecision(request.getRecommendedDecision())
                .submissionStatus(SubmissionStatus.SUBMITTED)
                .build());

        Evaluation saved = evaluationRepository.save(evaluation);
        return toEvaluationResponse(saved);
    }

    private EvaluationResponse toEvaluationResponse(Evaluation eval) {
        return EvaluationResponse.builder()
                .evaluationId(eval.getEvaluationId())
                .councilMemberId(eval.getCouncilMember().getCouncilMemberId())
                .evaluatorFullName(eval.getCouncilMember().getUser().getFullName())
                .scoreUrgency(eval.getScoreUrgency())
                .scoreContent(eval.getScoreContent())
                .scoreObjectives(eval.getScoreObjectives())
                .scoreMethodology(eval.getScoreMethodology())
                .scoreFeasibility(eval.getScoreFeasibility())
                .scoreCapacity(eval.getScoreCapacity())
                .scoreProducts(eval.getScoreProducts())
                .totalScore(eval.getTotalScore())
                .generalComment(eval.getGeneralComment())
                .recommendedDecision(eval.getRecommendedDecision())
                .submissionStatus(eval.getSubmissionStatus())
                .build();
    }
}
