package com.researchsystem.backend.service.impl;

import com.researchsystem.backend.domain.entity.Council;
import com.researchsystem.backend.domain.entity.CouncilMember;
import com.researchsystem.backend.domain.entity.Topic;
import com.researchsystem.backend.domain.entity.User;
import com.researchsystem.backend.domain.enums.CouncilRole;
import com.researchsystem.backend.domain.enums.SubmissionStatus;
import com.researchsystem.backend.domain.enums.SystemRole;
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
import java.util.Objects;
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

        if (!councilRepository.existsById(councilId)) {
            throw new EntityNotFoundException("Council not found with id: " + councilId);
        }
        Council councilRef = councilRepository.getReferenceById(councilId);

        List<CouncilAssignmentRequest.ExpertAssignment> assignments = request.getMembers();
        Set<Long> uniqueIds = new HashSet<>();
        for (CouncilAssignmentRequest.ExpertAssignment ea : assignments) {
            if (!uniqueIds.add(ea.getUserId())) {
                throw new IllegalArgumentException("Duplicate user IDs in the request");
            }
        }

        List<CouncilMember> existing = councilMemberRepository.findByCouncilCouncilId(councilId);
        Set<Long> existingUserIds = new HashSet<>();
        for (CouncilMember cm : existing) {
            existingUserIds.add(cm.getUser().getUserId());
        }

        long presidentsInRequest = assignments.stream()
                .filter(a -> a.getCouncilRole() == CouncilRole.PRESIDENT)
                .count();
        long secretariesInRequest = assignments.stream()
                .filter(a -> a.getCouncilRole() == CouncilRole.SECRETARY)
                .count();
        if (presidentsInRequest > 1 || secretariesInRequest > 1) {
            throw new IllegalArgumentException("At most one PRESIDENT and one SECRETARY may be assigned per request batch");
        }

        long existingPresidents = existing.stream().filter(m -> m.getCouncilRole() == CouncilRole.PRESIDENT).count();
        long existingSecretaries = existing.stream().filter(m -> m.getCouncilRole() == CouncilRole.SECRETARY).count();
        if (existingPresidents + presidentsInRequest > 1) {
            throw new IllegalArgumentException("Council already has a PRESIDENT");
        }
        if (existingSecretaries + secretariesInRequest > 1) {
            throw new IllegalArgumentException("Council already has a SECRETARY");
        }

        for (CouncilAssignmentRequest.ExpertAssignment ea : assignments) {
            if (existingUserIds.contains(ea.getUserId())) {
                throw new IllegalArgumentException("User " + ea.getUserId() + " is already assigned to this council");
            }
        }

        for (Topic topic : topicRepository.findByAssignedCouncilCouncilId(councilId, Pageable.unpaged()).getContent()) {
            Long investigatorId = topic.getInvestigator().getUserId();
            for (CouncilAssignmentRequest.ExpertAssignment ea : assignments) {
                if (Objects.equals(ea.getUserId(), investigatorId)) {
                    throw new IllegalArgumentException("Investigator cannot be in their own council");
                }
            }
        }

        List<CouncilMember> newMembers = new ArrayList<>();
        for (CouncilAssignmentRequest.ExpertAssignment ea : assignments) {
            User expert = userRepository.findById(ea.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "User not found with id: " + ea.getUserId()));
            if (expert.getSystemRole() != SystemRole.COUNCIL) {
                throw new IllegalArgumentException("User " + ea.getUserId() + " must have system role COUNCIL");
            }

            newMembers.add(CouncilMember.builder()
                    .council(councilRef)
                    .user(expert)
                    .councilRole(ea.getCouncilRole())
                    .build());
        }

        councilMemberRepository.saveAll(newMembers);
    }

    @Override
    public void removeCouncilMember(Long councilId, Long userId) {
        councilRepository.findById(councilId)
                .orElseThrow(() -> new EntityNotFoundException("Council not found with id: " + councilId));
        CouncilMember member = councilMemberRepository
                .findByCouncilCouncilIdAndUserUserId(councilId, userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No council membership for user " + userId + " on council " + councilId));
        councilMemberRepository.delete(member);
    }

    @Override
    public void removeTopicFromCouncil(Long councilId, Long topicId) {
        councilRepository.findById(councilId)
                .orElseThrow(() -> new EntityNotFoundException("Council not found with id: " + councilId));
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));
        if (topic.getAssignedCouncil() == null
                || !Objects.equals(topic.getAssignedCouncil().getCouncilId(), councilId)) {
            throw new IllegalStateException("Topic " + topicId + " is not assigned to council " + councilId);
        }
        if (topic.getTopicStatus() != TopicStatus.PENDING_COUNCIL) {
            throw new IllegalStateException(
                    "Only topics in PENDING_COUNCIL status can be unassigned from a council. Current: "
                            + topic.getTopicStatus());
        }
        topic.setAssignedCouncil(null);
        topic.setTopicStatus(TopicStatus.DEPT_APPROVED);
        topicRepository.save(topic);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkCouncilReadiness(Long councilId, Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));
        if (topic.getAssignedCouncil() == null
                || !Objects.equals(topic.getAssignedCouncil().getCouncilId(), councilId)) {
            throw new IllegalStateException("Topic " + topicId + " is not assigned to council " + councilId);
        }

        List<CouncilMember> allMembers = councilMemberRepository.findByCouncilCouncilId(councilId);
        List<CouncilMember> nonSecretaries = allMembers.stream()
                .filter(m -> m.getCouncilRole() != CouncilRole.SECRETARY)
                .toList();

        if (nonSecretaries.isEmpty()) {
            return false;
        }

        long submittedCount = evaluationRepository.countByTopicTopicIdAndCouncilMemberInAndSubmissionStatus(
                topicId, nonSecretaries, SubmissionStatus.SUBMITTED);

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

            for (CouncilMember cm : council.getCouncilMembers()) {
                if (cm.getUser().getUserId().equals(topic.getInvestigator().getUserId())) {
                    throw new org.springframework.security.access.AccessDeniedException("Conflict of Interest: Investigator is a member of the assigned council.");
                }
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
    public CouncilReadinessResponse getEvaluationStatus(Long councilId, Long topicId) {
        councilRepository.findById(councilId)
                .orElseThrow(() -> new EntityNotFoundException("Council not found with id: " + councilId));
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));
        if (topic.getAssignedCouncil() == null
                || !Objects.equals(topic.getAssignedCouncil().getCouncilId(), councilId)) {
            throw new IllegalStateException("Topic " + topicId + " is not assigned to council " + councilId);
        }

        List<CouncilMember> allMembers = councilMemberRepository.findByCouncilCouncilId(councilId);
        List<CouncilMember> nonSecretaries = allMembers.stream()
                .filter(m -> m.getCouncilRole() != CouncilRole.SECRETARY)
                .toList();

        long submittedCount = evaluationRepository.countByTopicTopicIdAndCouncilMemberInAndSubmissionStatus(
                topicId, nonSecretaries, SubmissionStatus.SUBMITTED);

        boolean ready = !nonSecretaries.isEmpty() && nonSecretaries.size() == submittedCount;
        String message = ready
                ? "All evaluations submitted. Council is ready for minute submission."
                : String.format("Waiting for %d more evaluation(s).",
                        nonSecretaries.size() - submittedCount);

        return CouncilReadinessResponse.builder()
                .councilId(councilId)
                .topicId(topicId)
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
