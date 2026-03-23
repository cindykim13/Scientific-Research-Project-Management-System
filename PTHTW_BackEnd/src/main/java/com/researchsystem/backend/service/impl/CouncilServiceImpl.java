package com.researchsystem.backend.service.impl;

import com.researchsystem.backend.domain.entity.Council;
import com.researchsystem.backend.domain.entity.CouncilMember;
import com.researchsystem.backend.domain.entity.Topic;
import com.researchsystem.backend.domain.entity.User;
import com.researchsystem.backend.domain.enums.CouncilRole;
import com.researchsystem.backend.domain.enums.SubmissionStatus;
import com.researchsystem.backend.domain.enums.TopicStatus;
import com.researchsystem.backend.dto.request.AssignTopicsRequest;
import com.researchsystem.backend.dto.request.CouncilAssignmentRequest;
import com.researchsystem.backend.dto.request.CouncilCreateRequest;
import com.researchsystem.backend.dto.response.CouncilDetailResponse;
import com.researchsystem.backend.dto.response.CouncilListResponse;
import com.researchsystem.backend.dto.response.CouncilReadinessResponse;
import com.researchsystem.backend.dto.response.TopicListResponse;
import com.researchsystem.backend.mapper.TopicMapper;
import com.researchsystem.backend.repository.CouncilMemberRepository;
import com.researchsystem.backend.repository.CouncilRepository;
import com.researchsystem.backend.repository.EvaluationRepository;
import com.researchsystem.backend.repository.TopicRepository;
import com.researchsystem.backend.repository.UserRepository;
import com.researchsystem.backend.service.CouncilService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class CouncilServiceImpl implements CouncilService {

    private final CouncilRepository councilRepository;
    private final UserRepository userRepository;
    private final CouncilMemberRepository councilMemberRepository;
    private final EvaluationRepository evaluationRepository;
    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    @Override
    public void assignCouncilMembers(Long councilId, CouncilAssignmentRequest request) {

        Council council = councilRepository.findById(councilId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Council not found with id: " + councilId));

        List<Long> expertIds = request.getExpertUserIds();
        Set<Long> uniqueIds = new HashSet<>(expertIds);

        if (uniqueIds.size() < expertIds.size()) {
            throw new IllegalArgumentException("Duplicate experts found in the request");
        }

        // Investigator-exclusion rule: no investigator of any topic assigned to
        // this council may also sit on the council as an expert.
        for (Topic topic : council.getTopics()) {
            Long investigatorId = topic.getInvestigator().getUserId();
            if (uniqueIds.contains(investigatorId)) {
                throw new IllegalArgumentException(
                        "Investigator cannot be in their own council");
            }
        }

        List<CouncilMember> newMembers = new ArrayList<>();
        for (Long userId : expertIds) {
            User expert = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "User not found with id: " + userId));

            newMembers.add(CouncilMember.builder()
                    .council(council)
                    .user(expert)
                    .councilRole(CouncilRole.MEMBER)
                    .build());
        }

        councilMemberRepository.saveAll(newMembers);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkCouncilReadiness(Long councilId) {
        List<CouncilMember> allMembers = councilMemberRepository.findByCouncilCouncilId(councilId);
        List<CouncilMember> nonSecretaries = allMembers.stream()
                .filter(m -> m.getCouncilRole() != CouncilRole.SECRETARY)
                .toList();

        if (nonSecretaries.isEmpty()) {
            return false;
        }

        long submittedCount = evaluationRepository.countByCouncilMemberInAndSubmissionStatus(
                nonSecretaries, SubmissionStatus.SUBMITTED);

        return nonSecretaries.size() == submittedCount;
    }

    @Override
    public CouncilDetailResponse createCouncil(CouncilCreateRequest request) {
        Council council = Council.builder()
                .councilName(request.getCouncilName())
                .meetingDate(request.getMeetingDate())
                .meetingTime(request.getMeetingTime())
                .meetingLocation(request.getMeetingLocation())
                .build();

        Council saved = councilRepository.save(council);
        return toDetailResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CouncilListResponse> getAllCouncils(Pageable pageable) {
        return councilRepository.findAll(pageable).map(this::toListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CouncilDetailResponse getCouncilById(Long id) {
        Council council = councilRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Council not found with id: " + id));
        return toDetailResponse(council);
    }

    @Override
    public void assignTopics(Long councilId, AssignTopicsRequest request) {
        Council council = councilRepository.findById(councilId)
                .orElseThrow(() -> new EntityNotFoundException("Council not found with id: " + councilId));

        for (Long topicId : request.getTopicIds()) {
            Topic topic = topicRepository.findById(topicId)
                    .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));

            if (topic.getTopicStatus() != TopicStatus.DEPT_APPROVED) {
                throw new IllegalStateException(
                        "Topic " + topicId + " must be in DEPT_APPROVED status to be assigned to a council. " +
                        "Current status: " + topic.getTopicStatus());
            }

            topic.setAssignedCouncil(council);
            topic.setTopicStatus(TopicStatus.PENDING_COUNCIL);
            topicRepository.save(topic);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TopicListResponse> getExpertTopics(String expertEmail, Pageable pageable) {
        return topicRepository.findTopicsAssignedToExpert(expertEmail, pageable)
                .map(topicMapper::toListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CouncilReadinessResponse getEvaluationStatus(Long councilId) {
        councilRepository.findById(councilId)
                .orElseThrow(() -> new EntityNotFoundException("Council not found with id: " + councilId));

        List<CouncilMember> allMembers = councilMemberRepository.findByCouncilCouncilId(councilId);
        List<CouncilMember> nonSecretaries = allMembers.stream()
                .filter(m -> m.getCouncilRole() != CouncilRole.SECRETARY)
                .toList();

        long submittedCount = evaluationRepository.countByCouncilMemberInAndSubmissionStatus(
                nonSecretaries, SubmissionStatus.SUBMITTED);

        boolean ready = !nonSecretaries.isEmpty() && nonSecretaries.size() == submittedCount;
        String message = ready
                ? "All evaluations submitted. Council is ready for minute submission."
                : String.format("Waiting for %d more evaluation(s).",
                        nonSecretaries.size() - submittedCount);

        return CouncilReadinessResponse.builder()
                .councilId(councilId)
                .ready(ready)
                .totalNonSecretaries(nonSecretaries.size())
                .submittedCount(submittedCount)
                .message(message)
                .build();
    }

    private CouncilListResponse toListResponse(Council council) {
        return CouncilListResponse.builder()
                .councilId(council.getCouncilId())
                .councilName(council.getCouncilName())
                .meetingDate(council.getMeetingDate())
                .meetingLocation(council.getMeetingLocation())
                .memberCount(council.getCouncilMembers().size())
                .topicCount(council.getTopics().size())
                .build();
    }

    private CouncilDetailResponse toDetailResponse(Council council) {
        List<CouncilDetailResponse.MemberInfo> memberInfos = council.getCouncilMembers().stream()
                .map(cm -> CouncilDetailResponse.MemberInfo.builder()
                        .councilMemberId(cm.getCouncilMemberId())
                        .userId(cm.getUser().getUserId())
                        .fullName(cm.getUser().getFullName())
                        .email(cm.getUser().getEmail())
                        .councilRole(cm.getCouncilRole())
                        .build())
                .toList();

        List<TopicListResponse> topicResponses = council.getTopics().stream()
                .map(topicMapper::toListResponse)
                .toList();

        return CouncilDetailResponse.builder()
                .councilId(council.getCouncilId())
                .councilName(council.getCouncilName())
                .meetingDate(council.getMeetingDate())
                .meetingTime(council.getMeetingTime())
                .meetingLocation(council.getMeetingLocation())
                .members(memberInfos)
                .topics(topicResponses)
                .build();
    }
}
