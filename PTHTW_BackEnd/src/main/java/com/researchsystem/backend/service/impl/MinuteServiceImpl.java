package com.researchsystem.backend.service.impl;

import com.researchsystem.backend.domain.entity.Council;
import com.researchsystem.backend.domain.entity.CouncilMember;
import com.researchsystem.backend.domain.entity.Evaluation;
import com.researchsystem.backend.domain.entity.Minute;
import com.researchsystem.backend.domain.entity.Topic;
import com.researchsystem.backend.domain.entity.User;
import com.researchsystem.backend.domain.enums.CouncilRole;
import com.researchsystem.backend.domain.enums.SubmissionStatus;
import com.researchsystem.backend.domain.enums.SystemRole;
import com.researchsystem.backend.domain.enums.TopicStatus; // BỔ SUNG IMPORT
import com.researchsystem.backend.dto.request.MinuteRequest;
import com.researchsystem.backend.dto.response.MinuteResponse;
import com.researchsystem.backend.repository.CouncilMemberRepository;
import com.researchsystem.backend.repository.CouncilRepository;
import com.researchsystem.backend.repository.EvaluationRepository;
import com.researchsystem.backend.repository.MinuteRepository;
import com.researchsystem.backend.repository.TopicRepository;
import com.researchsystem.backend.repository.UserRepository;
import com.researchsystem.backend.service.MinuteService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MinuteServiceImpl implements MinuteService {

    private final MinuteRepository minuteRepository;
    private final CouncilRepository councilRepository;
    private final CouncilMemberRepository councilMemberRepository;
    private final EvaluationRepository evaluationRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    @Override
    public MinuteResponse submitMinute(MinuteRequest request, String actorEmail) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Topic not found with id: " + request.getTopicId()));
        if (topic.getAssignedCouncil() == null) {
            throw new IllegalStateException("Topic has no assigned council");
        }

        Long councilId = topic.getAssignedCouncil().getCouncilId();
        CouncilMember membership = councilMemberRepository
                .findByCouncilCouncilIdAndUserEmail(councilId, actorEmail)
                .orElseThrow(() -> new AccessDeniedException("Not a member of this council"));

        if (membership.getCouncilRole() != CouncilRole.SECRETARY) {
            throw new AccessDeniedException("Only the council secretary may submit meeting minutes");
        }

        Council council = councilRepository.findById(councilId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Council not found with id: " + councilId));

        List<CouncilMember> nonSecretaries = councilMemberRepository
                .findByCouncilCouncilId(councilId)
                .stream()
                .filter(m -> m.getCouncilRole() != CouncilRole.SECRETARY)
                .toList();

        if (nonSecretaries.isEmpty()) {
            throw new IllegalStateException("Council has no eligible (non-secretary) members to evaluate");
        }

        List<Evaluation> submittedEvaluations = evaluationRepository
                .findByTopicTopicIdAndCouncilMemberInAndSubmissionStatus(
                        topic.getTopicId(), nonSecretaries, SubmissionStatus.SUBMITTED);

        if (submittedEvaluations.size() != nonSecretaries.size()) {
            throw new IllegalStateException(
                    "Not all council members have submitted their evaluations. " +
                    "Submitted: " + submittedEvaluations.size() + " / " + nonSecretaries.size());
        }

        BigDecimal averageScore = submittedEvaluations.stream()
                .map(Evaluation::getTotalScore)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(submittedEvaluations.size()), 2, RoundingMode.HALF_UP);

        String comments = Optional.ofNullable(request.getSynthesizedComments())
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .orElse("(none)");

        Optional<Minute> existing = minuteRepository.findByTopicTopicId(topic.getTopicId());
        Minute minute;
        if (existing.isPresent()) {
            minute = existing.get();
            minute.setAverageScore(averageScore);
            minute.setSynthesizedComments(comments);
            minute.setFinalDecision(request.getFinalDecision());
            minute.setLegalConfirmation(Boolean.TRUE.equals(request.getLegalConfirmation()));
            minute.setCouncil(council);
            minute.setTopic(topic);
        } else {
            minute = Minute.builder()
                    .council(council)
                    .topic(topic)
                    .averageScore(averageScore)
                    .synthesizedComments(comments)
                    .finalDecision(request.getFinalDecision())
                    .legalConfirmation(Boolean.TRUE.equals(request.getLegalConfirmation()))
                    .build();
        }

        Minute saved = minuteRepository.save(minute);

        // [BỔ SUNG LOGIC MÁY TRẠNG THÁI]: Cập nhật TopicStatus dựa trên FinalDecision
        switch (request.getFinalDecision()) {
            case APPROVED:
                // Nếu điểm cao và hoàn hảo, có thể thông qua luôn (Tùy nghiệp vụ, ở đây ta đặt APPROVED)
                topic.setTopicStatus(TopicStatus.APPROVED);
                break;
            case REVISION_REQUIRED:
                // "Thông qua có chỉnh sửa" hoặc "Xem xét lại" -> Yêu cầu Chủ nhiệm sửa (Chuyển sang Quy trình 4)
                topic.setTopicStatus(TopicStatus.REVISION_REQUIRED);
                break;
            case REJECTED:
                topic.setTopicStatus(TopicStatus.REJECTED);
                break;
            default:
                topic.setTopicStatus(TopicStatus.COUNCIL_REVIEWED);
        }
        topic.setSessionActive(false);
        topicRepository.save(topic); // Lưu lại trạng thái mới của đề tài

        return toMinuteResponse(saved, council, topic);
    }

    @Override
    @Transactional(readOnly = true)
    public MinuteResponse getMinuteForTopic(Long topicId, String actorEmail) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));
        if (topic.getAssignedCouncil() == null) {
            throw new EntityNotFoundException("Topic has no assigned council; minutes are not available yet");
        }

        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + actorEmail));

        if (actor.getSystemRole() == SystemRole.MANAGER || actor.getSystemRole() == SystemRole.ADMIN) {
            // allowed
        } else if (actor.getSystemRole() == SystemRole.RESEARCHER) {
            if (topic.getInvestigator() == null
                    || !Objects.equals(topic.getInvestigator().getEmail(), actor.getEmail())) {
                throw new AccessDeniedException("Only the principal investigator may view minutes for this topic");
            }
        } else if (actor.getSystemRole() == SystemRole.COUNCIL) {
            boolean isMember = councilMemberRepository.findByCouncilCouncilIdAndUserEmail(topic.getAssignedCouncil().getCouncilId(), actorEmail).isPresent();
            if (!isMember) {
                throw new AccessDeniedException("Only council members assigned to this topic can view its minutes");
            }
        } else {
            throw new AccessDeniedException("Not allowed to view meeting minutes for this topic");
        }

        Council council = topic.getAssignedCouncil();
        Minute minute = minuteRepository.findByTopicTopicId(topic.getTopicId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "No meeting minutes recorded for this topic yet"));

        return toMinuteResponse(minute, council, topic);
    }

    private MinuteResponse toMinuteResponse(Minute minute, Council council, Topic topic) {
        return MinuteResponse.builder()
                .minuteId(minute.getMinuteId())
                .topicId(topic.getTopicId())
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