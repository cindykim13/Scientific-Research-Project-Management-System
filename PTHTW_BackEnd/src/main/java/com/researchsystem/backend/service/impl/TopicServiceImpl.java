package com.researchsystem.backend.service.impl;

import com.researchsystem.backend.domain.entity.CouncilMember;
import com.researchsystem.backend.domain.entity.Department;
import com.researchsystem.backend.domain.entity.Evaluation;
import com.researchsystem.backend.domain.entity.Topic;
import com.researchsystem.backend.domain.entity.TopicAttachment;
import com.researchsystem.backend.domain.entity.User;
import com.researchsystem.backend.domain.enums.SubmissionStatus;
import com.researchsystem.backend.domain.enums.TopicStatus;
import com.researchsystem.backend.dto.request.TopicCreationRequest;
import com.researchsystem.backend.dto.request.TopicStatusChangeRequest;
import com.researchsystem.backend.dto.request.UpdateTopicRequest;
import com.researchsystem.backend.dto.response.AttachmentResponse;
import com.researchsystem.backend.dto.response.AuditLogResponse;
import com.researchsystem.backend.dto.response.TopicDetailResponse;
import com.researchsystem.backend.dto.response.TopicListResponse;
import com.researchsystem.backend.mapper.AuditLogMapper;
import com.researchsystem.backend.mapper.TopicMapper;
import com.researchsystem.backend.repository.CouncilMemberRepository;
import com.researchsystem.backend.repository.DepartmentRepository;
import com.researchsystem.backend.repository.EvaluationRepository;
import com.researchsystem.backend.repository.TopicRepository;
import com.researchsystem.backend.repository.UserRepository;
import com.researchsystem.backend.service.AuditLogService;
import com.researchsystem.backend.service.TopicService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AuditLogService auditLogService;
    private final TopicMapper topicMapper;
    private final AuditLogMapper auditLogMapper;
    private final CouncilMemberRepository councilMemberRepository;
    private final EvaluationRepository evaluationRepository;

    @Value("${app.upload.dir:uploads/attachments}")
    private String uploadDir;

    /**
     * Finite-state machine: defines every legal status transition.
     * Any (current → requested) pair absent from this map is forbidden.
     */
    private static final Map<TopicStatus, Set<TopicStatus>> VALID_TRANSITIONS;

    static {
        VALID_TRANSITIONS = new EnumMap<>(TopicStatus.class);
        VALID_TRANSITIONS.put(TopicStatus.DRAFT,
                EnumSet.of(TopicStatus.PENDING_REVIEW));
        VALID_TRANSITIONS.put(TopicStatus.PENDING_REVIEW,
                EnumSet.of(TopicStatus.DEPT_APPROVED, TopicStatus.DEPT_REJECTED));
        VALID_TRANSITIONS.put(TopicStatus.DEPT_APPROVED,
                EnumSet.of(TopicStatus.PENDING_COUNCIL));
        VALID_TRANSITIONS.put(TopicStatus.DEPT_REJECTED,
                EnumSet.of(TopicStatus.DRAFT));
        VALID_TRANSITIONS.put(TopicStatus.PENDING_COUNCIL,
                EnumSet.of(TopicStatus.COUNCIL_REVIEWED));
        VALID_TRANSITIONS.put(TopicStatus.COUNCIL_REVIEWED,
                EnumSet.of(TopicStatus.APPROVED, TopicStatus.REJECTED, TopicStatus.REVISION_REQUIRED));
        VALID_TRANSITIONS.put(TopicStatus.REVISION_REQUIRED,
                EnumSet.of(TopicStatus.PENDING_REVIEW));
        VALID_TRANSITIONS.put(TopicStatus.APPROVED, EnumSet.noneOf(TopicStatus.class));
        VALID_TRANSITIONS.put(TopicStatus.REJECTED, EnumSet.noneOf(TopicStatus.class));
    }

    @Override
    public TopicDetailResponse createTopic(TopicCreationRequest request, String investigatorEmail) {

        User investigator = userRepository.findByEmail(investigatorEmail)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Investigator not found with email: " + investigatorEmail));

        Department department = departmentRepository.findById(request.getManagingDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Department not found with id: " + request.getManagingDepartmentId()));

        Topic topic = topicMapper.toEntity(request);
        topic.setTopicStatus(TopicStatus.DRAFT);
        topic.setInvestigator(investigator);
        topic.setManagingDepartment(department);
        topic.setFileVersion(1);

        Topic saved = topicRepository.save(topic);

        return topicMapper.toDetailResponse(saved);
    }

    @Override
    @Transactional
    public TopicDetailResponse changeTopicStatus(Long topicId,
                                                  TopicStatusChangeRequest request,
                                                  String actorEmail) {

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Topic not found with id: " + topicId));

        TopicStatus currentStatus = topic.getTopicStatus();
        TopicStatus targetStatus = request.getNewStatus();

        Set<TopicStatus> allowedTargets = VALID_TRANSITIONS.getOrDefault(
                currentStatus, EnumSet.noneOf(TopicStatus.class));

        if (!allowedTargets.contains(targetStatus)) {
            throw new IllegalStateException(
                    String.format("Invalid state transition: cannot move from %s to %s.",
                            currentStatus, targetStatus));
        }

        auditLogService.recordLog(topicId, currentStatus, targetStatus,
                request.getFeedbackNote(), actorEmail);

        topic.setTopicStatus(targetStatus);
        Topic saved = topicRepository.save(topic);

        return topicMapper.toDetailResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TopicListResponse> getTopicsByInvestigator(String email, Pageable pageable) {
        return topicRepository.findByInvestigatorEmail(email, pageable)
                .map(topicMapper::toListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TopicListResponse> getAllTopics(Pageable pageable) {
        return topicRepository.findAll(pageable)
                .map(topicMapper::toListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TopicDetailResponse getTopicById(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + id));
        return topicMapper.toDetailResponse(topic);
    }

    @Override
    @Transactional
    public void deleteTopic(Long id, String actorEmail) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + id));

        if (topic.getTopicStatus() != TopicStatus.DRAFT) {
            throw new IllegalStateException(
                    "Only DRAFT topics can be deleted. Current status: " + topic.getTopicStatus());
        }

        topicRepository.delete(topic);
    }

    @Override
    @Transactional
    public TopicDetailResponse updateTopic(Long id, UpdateTopicRequest request, String actorEmail) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + id));

        if (topic.getTopicStatus() != TopicStatus.DRAFT) {
            throw new IllegalStateException(
                    "Only DRAFT topics can be edited. Current status: " + topic.getTopicStatus());
        }

        topic.setTitleVn(request.getTitleVn());
        topic.setResearchType(request.getResearchType());
        topic.setResearchField(request.getResearchField());
        topic.setDurationMonths(request.getDurationMonths());
        topic.setExpectedBudget(request.getExpectedBudget());

        Topic saved = topicRepository.save(topic);
        return topicMapper.toDetailResponse(saved);
    }

    @Override
    @Transactional
    public AttachmentResponse uploadAttachment(Long topicId, MultipartFile file, String actorEmail) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));

        String originalFilename = file.getOriginalFilename() != null
                ? file.getOriginalFilename() : "unknown";
        String storedFileName = UUID.randomUUID() + "_" + originalFilename;
        Path targetPath = Paths.get(uploadDir).resolve(storedFileName);

        try {
            Files.createDirectories(targetPath.getParent());
            Files.copy(file.getInputStream(), targetPath);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store file: " + ex.getMessage(), ex);
        }

        int newVersion = topic.getFileVersion() + 1;
        topic.setFileVersion(newVersion);

        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        TopicAttachment attachment = TopicAttachment.builder()
                .topic(topic)
                .documentType(contentType)
                .fileUri(targetPath.toString())
                .fileVersion(newVersion)
                .build();

        topic.getTopicAttachments().add(attachment);
        topicRepository.save(topic);

        return AttachmentResponse.builder()
                .documentType(attachment.getDocumentType())
                .fileUri(attachment.getFileUri())
                .fileVersion(attachment.getFileVersion())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogs(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));
        return topic.getAuditLogs().stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getAverageScore(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));

        if (topic.getAssignedCouncil() == null) {
            throw new IllegalStateException("No council has been assigned to topic id: " + topicId);
        }

        Long councilId = topic.getAssignedCouncil().getCouncilId();
        List<CouncilMember> members = councilMemberRepository.findByCouncilCouncilId(councilId);
        List<Evaluation> submitted = evaluationRepository
                .findByCouncilMemberInAndSubmissionStatus(members, SubmissionStatus.SUBMITTED);

        if (submitted.isEmpty()) {
            throw new IllegalStateException("No submitted evaluations found for topic id: " + topicId);
        }

        return submitted.stream()
                .map(Evaluation::getTotalScore)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(submitted.size()), 2, RoundingMode.HALF_UP);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TopicListResponse> getTopicsByDepartment(Long departmentId, Pageable pageable) {
        return topicRepository.findByManagingDepartmentDepartmentId(departmentId, pageable)
                .map(topicMapper::toListResponse);
    }
}
