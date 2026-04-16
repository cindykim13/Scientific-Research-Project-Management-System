package com.researchsystem.backend.service.impl;

import com.researchsystem.backend.domain.entity.CouncilMember;
import com.researchsystem.backend.domain.entity.Department;
import com.researchsystem.backend.domain.entity.Evaluation;
import com.researchsystem.backend.domain.entity.Notification;
import com.researchsystem.backend.domain.entity.Topic;
import com.researchsystem.backend.domain.entity.TopicAttachment;
import com.researchsystem.backend.domain.entity.TopicMember;
import com.researchsystem.backend.domain.entity.User;
import com.researchsystem.backend.domain.enums.CouncilRole;
import com.researchsystem.backend.domain.enums.SubmissionStatus;
import com.researchsystem.backend.domain.enums.SystemRole;
import com.researchsystem.backend.domain.enums.TopicStatus;
import com.researchsystem.backend.dto.request.TopicCreationRequest;
import com.researchsystem.backend.dto.request.TopicStatusChangeRequest;
import com.researchsystem.backend.dto.request.UpdateTopicRequest;
import com.researchsystem.backend.dto.response.AttachmentDownloadPayload;
import com.researchsystem.backend.dto.response.AttachmentResponse;
import com.researchsystem.backend.dto.response.AuditLogResponse;
import com.researchsystem.backend.dto.response.TopicDetailResponse;
import com.researchsystem.backend.dto.response.TopicListResponse;
import com.researchsystem.backend.mapper.AuditLogMapper;
import com.researchsystem.backend.mapper.TopicMapper;
import com.researchsystem.backend.notification.TopicStatusChangedEvent;
import com.researchsystem.backend.repository.CouncilMemberRepository;
import com.researchsystem.backend.repository.DepartmentRepository;
import com.researchsystem.backend.repository.EvaluationRepository;
import com.researchsystem.backend.repository.NotificationRepository;
import com.researchsystem.backend.repository.TopicRepository;
import com.researchsystem.backend.repository.UserRepository;
import com.researchsystem.backend.service.AuditLogService;
import com.researchsystem.backend.service.TopicService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.dao.DataIntegrityViolationException;
import com.researchsystem.backend.util.LevenshteinSimilarity;
import com.researchsystem.backend.util.AttachmentUploadWhitelist;
import com.researchsystem.backend.util.AttachmentUploadWhitelist.ValidatedBinaryPayload;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AuditLogService auditLogService;
    private final ApplicationEventPublisher eventPublisher;
    private final TopicMapper topicMapper;
    private final AuditLogMapper auditLogMapper;
    private final CouncilMemberRepository councilMemberRepository;
    private final EvaluationRepository evaluationRepository;
    private final NotificationRepository notificationRepository;

    @Value("${app.upload.dir:uploads/attachments}")
    private String uploadDir;

    private static final Map<TopicStatus, Set<TopicStatus>> VALID_TRANSITIONS;

    static {
        VALID_TRANSITIONS = new EnumMap<>(TopicStatus.class);
        VALID_TRANSITIONS.put(TopicStatus.DRAFT,
                EnumSet.of(TopicStatus.PENDING_REVIEW));
        VALID_TRANSITIONS.put(TopicStatus.PENDING_REVIEW,
                EnumSet.of(TopicStatus.DEPT_APPROVED, TopicStatus.DEPT_REJECTED));
        VALID_TRANSITIONS.put(TopicStatus.DEPT_APPROVED,
                EnumSet.of(TopicStatus.PENDING_COUNCIL, TopicStatus.REVISION_REQUIRED));
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

        enforceSemanticLexicalDuplication(request.getTitleVn());

        Topic topic = topicMapper.toEntity(request);
        topic.setTopicCode("TOPIC-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        topic.setTopicStatus(TopicStatus.DRAFT);
        topic.setInvestigator(investigator);
        topic.setManagingDepartment(department);
        topic.setFileVersion(1);

        if (request.getMemberNames() != null && !request.getMemberNames().isEmpty()) {
            for (String name : request.getMemberNames()) {
                if (name != null && !name.trim().isEmpty()) {
                    TopicMember tm = TopicMember.builder()
                            .topic(topic)
                            .memberName(name.trim())
                            .build();
                    topic.getMembers().add(tm);
                }
            }
        }

        Topic saved = topicRepository.save(topic);

        return topicMapper.toDetailResponse(saved);
    }

    private void enforceSemanticLexicalDuplication(String incomingTitleVn) {
        String safeIncoming = incomingTitleVn == null ? "" : incomingTitleVn;
        double threshold = 0.85d;
        List<String> existingTitles = topicRepository.findAllTitleVn();

        for (String existing : existingTitles) {
            double similarity = LevenshteinSimilarity.normalizedSimilarity(safeIncoming, existing);
            if (similarity > threshold) {
                throw new DataIntegrityViolationException(
                        "Semantic duplicate topic title detected (similarity=" + similarity +
                                "). Please revise your research direction and provide a more distinct title."
                );
            }
        }
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
        TopicStatus targetStatus = request.getTargetStatus();

        Set<TopicStatus> allowedTargets = VALID_TRANSITIONS.getOrDefault(
                currentStatus, EnumSet.noneOf(TopicStatus.class));

        if (!allowedTargets.contains(targetStatus)) {
            throw new IllegalStateException(
                    String.format("Invalid state transition: cannot move from %s to %s.",
                            currentStatus, targetStatus));
        }

        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + actorEmail));
        enforceStatusChangeAuthorization(actor, topic, currentStatus, targetStatus);

        auditLogService.recordLog(topicId, currentStatus, targetStatus,
                request.getFeedbackMessage(), actorEmail);

        topic.setTopicStatus(targetStatus);
        Topic saved = topicRepository.save(topic);

        // ==============================================================================
        // BỔ SUNG LOGIC 1: THÔNG BÁO KHI TRƯỞNG KHOA XỬ LÝ HỒ SƠ (DEPT_APPROVED / DEPT_REJECTED)
        // ==============================================================================
        if (actor.getSystemRole() == SystemRole.DEPT_HEAD) {
            if (targetStatus == TopicStatus.DEPT_APPROVED) {
                // 1. Thông báo cho chính Trưởng khoa (Lưu vết lịch sử hộp thoại)
                notificationRepository.save(Notification.builder()
                        .recipient(actor)
                        .notificationType("TOPIC_APPROVED_DEPT")
                        .title("Đã phê duyệt đề tài")
                        .body("Ngài đã phê duyệt thành công đề tài mã số: " + topic.getTopicCode())
                        .resourceType("TOPIC")
                        .resourceId(topicId)
                        .build());

                // 2. Thông báo cho Chủ nhiệm
                notificationRepository.save(Notification.builder()
                        .recipient(topic.getInvestigator())
                        .notificationType("TOPIC_APPROVED_DEPT")
                        .title("Đề tài đã được Khoa phê duyệt")
                        .body("Đề tài " + topic.getTopicCode() + " đã được Khoa thông qua và chuyển lên Phòng QLKH.")
                        .resourceType("TOPIC")
                        .resourceId(topicId)
                        .build());
            } else if (targetStatus == TopicStatus.DEPT_REJECTED) {
                // 1. Thông báo cho chính Trưởng khoa
                notificationRepository.save(Notification.builder()
                        .recipient(actor)
                        .notificationType("TOPIC_REJECTED_DEPT")
                        .title("Đã trả hồ sơ đề tài")
                        .body("Ngài đã yêu cầu chỉnh sửa đề tài mã số: " + topic.getTopicCode())
                        .resourceType("TOPIC")
                        .resourceId(topicId)
                        .build());

                // 2. Thông báo cho Chủ nhiệm
                notificationRepository.save(Notification.builder()
                        .recipient(topic.getInvestigator())
                        .notificationType("TOPIC_REJECTED_DEPT")
                        .title("Đề tài cần chỉnh sửa cấp Khoa")
                        .body("Đề tài " + topic.getTopicCode() + " bị Khoa yêu cầu chỉnh sửa. Lý do: " + request.getFeedbackMessage())
                        .resourceType("TOPIC")
                        .resourceId(topicId)
                        .build());
            }
        }

        // ==============================================================================
        // BỔ SUNG LOGIC 2: THÔNG BÁO KHI PHÒNG QLKH TRẢ HỒ SƠ VỀ (REVISION_REQUIRED)
        // ==============================================================================
        if (targetStatus == TopicStatus.REVISION_REQUIRED && actor.getSystemRole() == SystemRole.MANAGER) {
            // 1. Gửi thông báo cho Chủ nhiệm
            Notification invNotif = Notification.builder()
                    .recipient(topic.getInvestigator())
                    .notificationType("TOPIC_REVISION")
                    .title("Yêu cầu bổ sung thủ tục đề tài")
                    .body("Phòng QLKH yêu cầu bổ sung đề tài: " + topic.getTitleVn() + ". Lý do: " + request.getFeedbackMessage())
                    .resourceType("TOPIC")
                    .resourceId(topicId)
                    .build();
            notificationRepository.save(invNotif);

            log.info("=================================================================");
            log.info("[SMTP MOCK] Email to Investigator ({}): Đề tài {} cần bổ sung thủ tục.", 
                    topic.getInvestigator().getEmail(), topic.getTopicCode());
            log.info("Lý do: {}", request.getFeedbackMessage());
            log.info("=================================================================");

            // 2. Gửi thông báo cho Phụ trách Khoa liên quan
            List<User> deptHeads = userRepository.findByDepartmentDepartmentIdAndSystemRole(
                    topic.getManagingDepartment().getDepartmentId(), SystemRole.DEPT_HEAD);
            
            for (User head : deptHeads) {
                Notification headNotif = Notification.builder()
                        .recipient(head)
                        .notificationType("TOPIC_REVISION_DEPT")
                        .title("Đề tài của Khoa bị trả về")
                        .body("Đề tài " + topic.getTopicCode() + " bị Phòng QLKH trả về. Lý do: " + request.getFeedbackMessage())
                        .resourceType("TOPIC")
                        .resourceId(topicId)
                        .build();
                notificationRepository.save(headNotif);
                
                log.info("=================================================================");
                log.info("[SMTP MOCK] Email to Dept Head ({}): Đề tài {} của khoa bị trả về.", 
                        head.getEmail(), topic.getTopicCode());
                log.info("=================================================================");
            }
        }

        eventPublisher.publishEvent(new TopicStatusChangedEvent(topicId, targetStatus, actorEmail));

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
    public TopicDetailResponse getTopicById(Long id, String actorEmail) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + id));

        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + actorEmail));

        if (!mayReadTopicViaOwnershipMatrix(actor, topic)) {
            throw new AccessDeniedException("Not authorized to access this topic.");
        }

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

        if (!actorEmail.equals(topic.getInvestigator().getEmail())) {
            throw new org.springframework.security.access.AccessDeniedException("User is not the owner of this topic");
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

        if (!actorEmail.equals(topic.getInvestigator().getEmail())) {
            throw new org.springframework.security.access.AccessDeniedException("User is not the owner of this topic");
        }

        if (request.getTitleVn() != null) {
            topic.setTitleVn(request.getTitleVn());
        }
        if (request.getResearchType() != null) {
            topic.setResearchType(request.getResearchType());
        }
        if (request.getResearchField() != null) {
            topic.setResearchField(request.getResearchField());
        }
        if (request.getDurationMonths() != null) {
            topic.setDurationMonths(request.getDurationMonths());
        }
        if (request.getExpectedBudget() != null) {
            topic.setExpectedBudget(request.getExpectedBudget());
        }
        if (request.getTitleEn() != null) {
            topic.setTitleEn(request.getTitleEn());
        }
        if (request.getUrgencyStatement() != null) {
            topic.setUrgencyStatement(request.getUrgencyStatement());
        }
        if (request.getGeneralObjective() != null) {
            topic.setGeneralObjective(request.getGeneralObjective());
        }
        if (request.getSpecificObjectives() != null) {
            topic.setSpecificObjectives(request.getSpecificObjectives());
        }
        if (request.getResearchApproach() != null) {
            topic.setResearchApproach(request.getResearchApproach());
        }
        if (request.getResearchMethods() != null) {
            topic.setResearchMethods(request.getResearchMethods());
        }
        if (request.getResearchScope() != null) {
            topic.setResearchScope(request.getResearchScope());
        }
        if (request.getExpectedProductsType1() != null) {
            topic.setExpectedProductsType1(request.getExpectedProductsType1());
        }
        if (request.getExpectedProductsType2() != null) {
            topic.setExpectedProductsType2(request.getExpectedProductsType2());
        }
        if (request.getBudgetExplanation() != null) {
            topic.setBudgetExplanation(request.getBudgetExplanation());
        }
        if (request.getTrainingPlan() != null) {
            topic.setTrainingPlan(request.getTrainingPlan());
        }
        if (request.getImplementationPlan() != null) {
            topic.setImplementationPlan(request.getImplementationPlan());
        }

        Topic saved = topicRepository.save(topic);
        return topicMapper.toDetailResponse(saved);
    }

    @Override
    @Transactional
    public AttachmentResponse uploadAttachment(Long topicId, MultipartFile file, String actorEmail) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));

        if (!actorEmail.equals(topic.getInvestigator().getEmail())) {
            throw new org.springframework.security.access.AccessDeniedException("User is not the owner of this topic");
        }

        ValidatedBinaryPayload validatedPayload = AttachmentUploadWhitelist.validateMultipartBinary(file);
        String validatedContentType = validatedPayload.normalizedContentType();

        String originalFilename = file.getOriginalFilename() != null
                ? Paths.get(file.getOriginalFilename()).getFileName().toString() : "unknown";
        String storedFileName = UUID.randomUUID() + "_" + originalFilename;
        Path targetPath = Paths.get(uploadDir).resolve(storedFileName);

        try {
            Files.createDirectories(targetPath.getParent());
            Files.copy(new ByteArrayInputStream(validatedPayload.bytes()), targetPath);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store file: " + ex.getMessage(), ex);
        }

        int newVersion = topic.getFileVersion() + 1;
        topic.setFileVersion(newVersion);

        String contentType = validatedContentType;

        TopicAttachment attachment = TopicAttachment.builder()
                .topic(topic)
                .documentType(contentType)
                .fileUri(targetPath.toString())
                .fileVersion(newVersion)
                .build();

        topic.getTopicAttachments().add(attachment);
        Topic saved = topicRepository.saveAndFlush(topic);
        TopicAttachment savedAttachment = saved.getTopicAttachments().get(saved.getTopicAttachments().size() - 1);

        return AttachmentResponse.builder()
                .attachmentId(savedAttachment.getAttachmentId())
                .documentType(savedAttachment.getDocumentType())
                .fileUri(savedAttachment.getFileUri())
                .uploadedAt(savedAttachment.getUploadedAt())
                .fileVersion(savedAttachment.getFileVersion())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogs(Long topicId, String actorEmail) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));

        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + actorEmail));

        if (actor.getSystemRole() != SystemRole.ADMIN
                && actor.getSystemRole() != SystemRole.MANAGER) {
            if (actor.getSystemRole() != SystemRole.RESEARCHER
                    || !investigatorMatches(actor, topic)) {
                throw new AccessDeniedException(
                        "You are not authorized to view audit logs for this topic.");
            }
        }

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
            throw new IllegalStateException(
                    "Đề tài chưa được gán hội đồng xét duyệt; không thể tính điểm trung bình.");
        }

        Long councilId = topic.getAssignedCouncil().getCouncilId();
        List<CouncilMember> members = councilMemberRepository.findByCouncilCouncilId(councilId);
        List<CouncilMember> votingMembers = members.stream()
                .filter(m -> m.getCouncilRole() != CouncilRole.SECRETARY)
                .toList();

        if (votingMembers.isEmpty()) {
            throw new IllegalStateException(
                    "Không có thành viên hội đồng đủ điều kiện chấm điểm (vai trò thư ký được loại trừ) "
                            + "để tính điểm trung bình cho đề tài này.");
        }

        List<Evaluation> submitted = evaluationRepository
                .findByTopicTopicIdAndCouncilMemberInAndSubmissionStatus(
                        topicId, votingMembers, SubmissionStatus.SUBMITTED);

        if (submitted.isEmpty()) {
            throw new IllegalStateException(
                    "Chưa có phiếu chấm đã gửi từ thành viên hội đồng (không tính thư ký) "
                            + "để tính điểm trung bình cho đề tài này.");
        }

        List<BigDecimal> scores = submitted.stream()
                .map(Evaluation::getTotalScore)
                .filter(Objects::nonNull)
                .toList();

        if (scores.isEmpty()) {
            throw new IllegalStateException(
                    "Không có điểm tổng hợp hợp lệ trên các phiếu chấm đã gửi để tính điểm trung bình.");
        }

        return scores.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(scores.size()), 2, RoundingMode.HALF_UP);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TopicListResponse> getTopicsByDepartment(Long departmentId, Pageable pageable) {
        return topicRepository.findByManagingDepartmentDepartmentId(departmentId, pageable)
                .map(topicMapper::toListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AttachmentDownloadPayload loadAttachmentForDownload(Long topicId, Long attachmentId, String actorEmail) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));

        TopicAttachment attachment = topic.getTopicAttachments().stream()
                .filter(a -> Objects.equals(a.getAttachmentId(), attachmentId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException(
                        "Attachment not found with id: " + attachmentId + " for topic: " + topicId));

        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + actorEmail));

        if (!mayReadTopicViaOwnershipMatrix(actor, topic)) {
            throw new AccessDeniedException("Not allowed to download this attachment");
        }

        try {
            Path path = Paths.get(attachment.getFileUri()).normalize();
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new EntityNotFoundException("File no longer available on disk");
            }
            String filename = path.getFileName().toString();
            String contentType = attachment.getDocumentType() != null ? attachment.getDocumentType() : "application/octet-stream";
            return new AttachmentDownloadPayload(resource, contentType, filename);
        } catch (MalformedURLException e) {
            throw new IllegalStateException("Invalid stored file path", e);
        }
    }

    private void enforceStatusChangeAuthorization(User actor, Topic topic,
                                                  TopicStatus from, TopicStatus to) {
        if (actor.getSystemRole() == SystemRole.ADMIN) {
            return;
        }

        boolean allowed = false;
        if (from == TopicStatus.DRAFT && to == TopicStatus.PENDING_REVIEW) {
            allowed = actor.getSystemRole() == SystemRole.RESEARCHER && investigatorMatches(actor, topic);
        } else if (from == TopicStatus.PENDING_REVIEW
                && (to == TopicStatus.DEPT_APPROVED || to == TopicStatus.DEPT_REJECTED)) {
            allowed = actor.getSystemRole() == SystemRole.DEPT_HEAD && sameDepartment(actor, topic);
        } 
        else if (from == TopicStatus.DEPT_APPROVED && 
                (to == TopicStatus.PENDING_COUNCIL || to == TopicStatus.REVISION_REQUIRED)) {
            allowed = actor.getSystemRole() == SystemRole.MANAGER;
        } 
        else if (from == TopicStatus.DEPT_REJECTED && to == TopicStatus.DRAFT) {
            allowed = actor.getSystemRole() == SystemRole.RESEARCHER && investigatorMatches(actor, topic);
        } else if (from == TopicStatus.PENDING_COUNCIL && to == TopicStatus.COUNCIL_REVIEWED) {
            allowed = actor.getSystemRole() == SystemRole.MANAGER;
        } else if (from == TopicStatus.COUNCIL_REVIEWED
                && (to == TopicStatus.APPROVED || to == TopicStatus.REJECTED
                || to == TopicStatus.REVISION_REQUIRED)) {
            allowed = actor.getSystemRole() == SystemRole.MANAGER;
        } else if (from == TopicStatus.REVISION_REQUIRED && to == TopicStatus.PENDING_REVIEW) {
            allowed = actor.getSystemRole() == SystemRole.RESEARCHER && investigatorMatches(actor, topic);
        }

        if (!allowed) {
            throw new AccessDeniedException("Current role is not permitted for this status transition.");
        }
    }

    private static boolean investigatorMatches(User actor, Topic topic) {
        return topic.getInvestigator() != null
                && actor.getEmail().equals(topic.getInvestigator().getEmail());
    }

    private static boolean sameDepartment(User actor, Topic topic) {
        if (actor.getDepartment() == null || topic.getManagingDepartment() == null) {
            return false;
        }
        return Objects.equals(
                actor.getDepartment().getDepartmentId(),
                topic.getManagingDepartment().getDepartmentId());
    }

    /**
     * Zero-trust read matrix for topic intellectual property (detail view and attachments).
     */
    private boolean mayReadTopicViaOwnershipMatrix(User actor, Topic topic) {
        if (actor.getSystemRole() == SystemRole.ADMIN || actor.getSystemRole() == SystemRole.MANAGER) {
            return true;
        }
        if (actor.getSystemRole() == SystemRole.RESEARCHER && investigatorMatches(actor, topic)) {
            return true;
        }
        if (actor.getSystemRole() == SystemRole.DEPT_HEAD && sameDepartment(actor, topic)) {
            return true;
        }
        if (actor.getSystemRole() == SystemRole.COUNCIL && topic.getAssignedCouncil() != null) {
            return councilMemberRepository
                    .findByCouncilCouncilIdAndUserEmail(
                            topic.getAssignedCouncil().getCouncilId(), actor.getEmail())
                    .isPresent();
        }
        return false;
    }
}