package com.researchsystem.backend.service.impl;

import com.researchsystem.backend.domain.entity.AuditLog;
import com.researchsystem.backend.domain.entity.Council;
import com.researchsystem.backend.domain.entity.CouncilMember;
import com.researchsystem.backend.domain.entity.Department;
import com.researchsystem.backend.domain.entity.Evaluation;
import com.researchsystem.backend.domain.entity.Topic;
import com.researchsystem.backend.domain.entity.User;
import com.researchsystem.backend.domain.enums.CouncilRole;
import com.researchsystem.backend.domain.enums.ResearchType;
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
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link TopicServiceImpl}.
 *
 * <p>Uses Mockito's STRICT_STUBS mode (the default for {@code MockitoExtension})
 * to catch both unnecessary stubs and argument-mismatch bugs.
 *
 * <p>All test fixtures use plain no-arg constructors and setter calls to avoid
 * any dependency on Lombok-generated nested Builder classes at runtime.
 *
 * <p>Coverage targets (enforced by JaCoCo):
 * <ul>
 *   <li>INSTRUCTION ≥ 80 %</li>
 *   <li>BRANCH      ≥ 80 %</li>
 * </ul>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TopicServiceImpl Unit Tests")
class TopicServiceImplTest {

    // -------------------------------------------------------------------------
    // Mocks (injected into the SUT via @InjectMocks constructor injection)
    // -------------------------------------------------------------------------

    @Mock private TopicRepository         topicRepository;
    @Mock private UserRepository          userRepository;
    @Mock private DepartmentRepository    departmentRepository;
    @Mock private AuditLogService         auditLogService;
    @Mock private TopicMapper             topicMapper;
    @Mock private AuditLogMapper          auditLogMapper;
    @Mock private CouncilMemberRepository councilMemberRepository;
    @Mock private EvaluationRepository    evaluationRepository;

    /** Subject Under Test */
    @InjectMocks
    private TopicServiceImpl topicService;

    // -------------------------------------------------------------------------
    // Shared fixtures rebuilt before every test
    // -------------------------------------------------------------------------

    private Topic               draftTopic;
    private TopicDetailResponse detailResponse;
    private TopicListResponse   listResponse;
    private Pageable            pageable;

    @BeforeEach
    void setUp() {
        // Topic — @Builder.Default collections must be initialised manually
        draftTopic = new Topic();
        draftTopic.setTopicId(1L);
        draftTopic.setTopicCode("CS-001");
        draftTopic.setTitleVn("Đề tài nghiên cứu");
        draftTopic.setTopicStatus(TopicStatus.DRAFT);
        draftTopic.setFileVersion(1);
        draftTopic.setTopicAttachments(new ArrayList<>());
        draftTopic.setAuditLogs(new ArrayList<>());

        detailResponse = new TopicDetailResponse();
        detailResponse.setId(1L);
        detailResponse.setTopicCode("CS-001");
        detailResponse.setTopicStatus(TopicStatus.PENDING_REVIEW);

        listResponse = new TopicListResponse();
        listResponse.setId(1L);
        listResponse.setTopicCode("CS-001");

        pageable = PageRequest.of(0, 10);
    }

    // =========================================================================
    // changeTopicStatus — FSM happy paths & guard paths
    // =========================================================================

    @Nested
    @DisplayName("changeTopicStatus")
    class ChangeTopicStatusTests {

        /**
         * Happy-path test case 1 (as specified): DRAFT → PENDING_REVIEW.
         */
        @Test
        @DisplayName("DRAFT → PENDING_REVIEW: persists new status and records audit log")
        void draftToPendingReview_success() {
            // Arrange
            TopicStatusChangeRequest request = new TopicStatusChangeRequest();
            request.setNewStatus(TopicStatus.PENDING_REVIEW);
            request.setFeedbackNote("Initial submission by investigator");

            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));
            when(topicRepository.save(any(Topic.class))).thenReturn(draftTopic);
            when(topicMapper.toDetailResponse(any(Topic.class))).thenReturn(detailResponse);

            // Act
            TopicDetailResponse result = topicService.changeTopicStatus(1L, request, "researcher@test.com");

            // Assert
            assertNotNull(result);
            assertEquals(TopicStatus.PENDING_REVIEW, draftTopic.getTopicStatus(),
                    "Entity status must be mutated to PENDING_REVIEW before save");
            verify(auditLogService, times(1)).recordLog(
                    eq(1L),
                    eq(TopicStatus.DRAFT),
                    eq(TopicStatus.PENDING_REVIEW),
                    anyString(),
                    anyString());
            verify(topicRepository, times(1)).save(any(Topic.class));
        }

        /**
         * Fail-fast test case 2 (as specified): terminal APPROVED status —
         * no audit log, no repository save.
         */
        @Test
        @DisplayName("APPROVED → PENDING_REVIEW: fail-fast — no audit log, no save")
        void approvedToAny_throwsIllegalStateException() {
            // Arrange
            Topic approvedTopic = new Topic();
            approvedTopic.setTopicId(2L);
            approvedTopic.setTopicStatus(TopicStatus.APPROVED);
            approvedTopic.setFileVersion(1);

            TopicStatusChangeRequest request = new TopicStatusChangeRequest();
            request.setNewStatus(TopicStatus.PENDING_REVIEW);

            when(topicRepository.findById(2L)).thenReturn(Optional.of(approvedTopic));

            // Act & Assert
            assertThrows(IllegalStateException.class,
                    () -> topicService.changeTopicStatus(2L, request, "manager@test.com"));

            // Verify fail-fast principle
            verifyNoInteractions(auditLogService);
            verify(topicRepository, never()).save(any());
        }

        @Test
        @DisplayName("Topic not found: throws EntityNotFoundException before any downstream call")
        void topicNotFound_throwsEntityNotFoundException() {
            // Arrange
            TopicStatusChangeRequest request = new TopicStatusChangeRequest();
            request.setNewStatus(TopicStatus.PENDING_REVIEW);

            when(topicRepository.findById(99L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EntityNotFoundException.class,
                    () -> topicService.changeTopicStatus(99L, request, "user@test.com"));

            verifyNoInteractions(auditLogService);
            verify(topicRepository, never()).save(any());
        }

        /**
         * Parameterised: walks every legal FSM edge (all 10 valid transitions).
         */
        @ParameterizedTest(name = "[{index}] {0} → {1}")
        @MethodSource("com.researchsystem.backend.service.impl.TopicServiceImplTest#validTransitions")
        @DisplayName("All valid FSM transitions succeed and persist the new status")
        void allValidTransitions_succeed(TopicStatus from, TopicStatus to) {
            // Arrange
            Topic topic = new Topic();
            topic.setTopicId(10L);
            topic.setTopicStatus(from);
            topic.setFileVersion(1);

            TopicStatusChangeRequest request = new TopicStatusChangeRequest();
            request.setNewStatus(to);
            request.setFeedbackNote("review note");

            when(topicRepository.findById(10L)).thenReturn(Optional.of(topic));
            when(topicRepository.save(any())).thenReturn(topic);
            when(topicMapper.toDetailResponse(any())).thenReturn(detailResponse);

            // Act
            TopicDetailResponse result = topicService.changeTopicStatus(10L, request, "actor@test.com");

            // Assert
            assertNotNull(result);
            assertEquals(to, topic.getTopicStatus(),
                    "Entity status must be updated to the target status");
            verify(topicRepository, times(1)).save(any());
        }

        /**
         * Parameterised: selected illegal FSM edges all throw {@code IllegalStateException}
         * and respect the fail-fast principle.
         */
        @ParameterizedTest(name = "[{index}] {0} → {1} (invalid)")
        @MethodSource("com.researchsystem.backend.service.impl.TopicServiceImplTest#invalidTransitions")
        @DisplayName("Invalid FSM transitions throw IllegalStateException without side effects")
        void invalidTransitions_throwIllegalStateException(TopicStatus from, TopicStatus to) {
            // Arrange
            Topic topic = new Topic();
            topic.setTopicId(10L);
            topic.setTopicStatus(from);
            topic.setFileVersion(1);

            TopicStatusChangeRequest request = new TopicStatusChangeRequest();
            request.setNewStatus(to);

            when(topicRepository.findById(10L)).thenReturn(Optional.of(topic));

            // Act & Assert
            assertThrows(IllegalStateException.class,
                    () -> topicService.changeTopicStatus(10L, request, "actor@test.com"));

            verifyNoInteractions(auditLogService);
            verify(topicRepository, never()).save(any());
        }
    }

    // =========================================================================
    // createTopic
    // =========================================================================

    @Nested
    @DisplayName("createTopic")
    class CreateTopicTests {

        @Test
        @DisplayName("Valid request: topic saved in DRAFT status with fileVersion 1")
        void success() {
            // Arrange
            User investigator = new User();
            investigator.setUserId(1L);
            investigator.setEmail("researcher@test.com");

            Department dept = new Department();
            dept.setDepartmentId(10L);
            dept.setDepartmentName("CS Department");

            TopicCreationRequest request = new TopicCreationRequest();
            request.setTopicCode("CS-001");
            request.setTitleVn("Đề tài nghiên cứu");
            request.setResearchType(ResearchType.BASIC);
            request.setResearchField("Computer Science");
            request.setDurationMonths(12);
            request.setExpectedBudget(BigDecimal.valueOf(50_000));
            request.setManagingDepartmentId(10L);

            Topic mappedTopic = new Topic();
            mappedTopic.setTopicId(1L);

            when(userRepository.findByEmail("researcher@test.com")).thenReturn(Optional.of(investigator));
            when(departmentRepository.findById(10L)).thenReturn(Optional.of(dept));
            when(topicMapper.toEntity(request)).thenReturn(mappedTopic);
            when(topicRepository.save(any(Topic.class))).thenReturn(mappedTopic);
            when(topicMapper.toDetailResponse(any(Topic.class))).thenReturn(detailResponse);

            // Act
            TopicDetailResponse result = topicService.createTopic(request, "researcher@test.com");

            // Assert
            assertNotNull(result);
            assertEquals(TopicStatus.DRAFT, mappedTopic.getTopicStatus(),
                    "New topic must always start in DRAFT status");
            assertEquals(1, mappedTopic.getFileVersion(),
                    "Initial fileVersion must be set to 1");
            assertEquals(investigator, mappedTopic.getInvestigator());
            assertEquals(dept, mappedTopic.getManagingDepartment());
            verify(topicRepository, times(1)).save(any(Topic.class));
        }

        @Test
        @DisplayName("Investigator not found: throws EntityNotFoundException, no DB write")
        void investigatorNotFound_throwsEntityNotFoundException() {
            // Arrange
            TopicCreationRequest request = new TopicCreationRequest();
            request.setManagingDepartmentId(10L);

            when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EntityNotFoundException.class,
                    () -> topicService.createTopic(request, "unknown@test.com"));

            verifyNoInteractions(departmentRepository, topicMapper, topicRepository);
        }

        @Test
        @DisplayName("Department not found: throws EntityNotFoundException, no DB write")
        void departmentNotFound_throwsEntityNotFoundException() {
            // Arrange
            User investigator = new User();
            investigator.setUserId(1L);
            investigator.setEmail("researcher@test.com");

            TopicCreationRequest request = new TopicCreationRequest();
            request.setManagingDepartmentId(99L);

            when(userRepository.findByEmail("researcher@test.com")).thenReturn(Optional.of(investigator));
            when(departmentRepository.findById(99L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EntityNotFoundException.class,
                    () -> topicService.createTopic(request, "researcher@test.com"));

            verifyNoInteractions(topicMapper, topicRepository);
        }
    }

    // =========================================================================
    // getTopicById
    // =========================================================================

    @Nested
    @DisplayName("getTopicById")
    class GetTopicByIdTests {

        @Test
        @DisplayName("Existing ID: returns mapped detail response")
        void success() {
            // Arrange
            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));
            when(topicMapper.toDetailResponse(draftTopic)).thenReturn(detailResponse);

            // Act
            TopicDetailResponse result = topicService.getTopicById(1L);

            // Assert
            assertNotNull(result);
            verify(topicMapper, times(1)).toDetailResponse(draftTopic);
        }

        @Test
        @DisplayName("Missing ID: throws EntityNotFoundException")
        void notFound_throwsEntityNotFoundException() {
            // Arrange
            when(topicRepository.findById(99L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EntityNotFoundException.class, () -> topicService.getTopicById(99L));
        }
    }

    // =========================================================================
    // getTopicsByInvestigator
    // =========================================================================

    @Nested
    @DisplayName("getTopicsByInvestigator")
    class GetTopicsByInvestigatorTests {

        @Test
        @DisplayName("Returns paginated list filtered by investigator email")
        void success() {
            // Arrange
            Page<Topic> topicPage = new PageImpl<>(List.of(draftTopic));
            when(topicRepository.findByInvestigatorEmail("researcher@test.com", pageable))
                    .thenReturn(topicPage);
            when(topicMapper.toListResponse(draftTopic)).thenReturn(listResponse);

            // Act
            Page<TopicListResponse> result =
                    topicService.getTopicsByInvestigator("researcher@test.com", pageable);

            // Assert
            assertNotNull(result);
            assertEquals(1, result.getTotalElements());
            assertEquals(listResponse, result.getContent().get(0));
        }
    }

    // =========================================================================
    // getAllTopics
    // =========================================================================

    @Nested
    @DisplayName("getAllTopics")
    class GetAllTopicsTests {

        @Test
        @DisplayName("Returns paginated list of every topic in the system")
        void success() {
            // Arrange
            Page<Topic> topicPage = new PageImpl<>(List.of(draftTopic));
            when(topicRepository.findAll(pageable)).thenReturn(topicPage);
            when(topicMapper.toListResponse(draftTopic)).thenReturn(listResponse);

            // Act
            Page<TopicListResponse> result = topicService.getAllTopics(pageable);

            // Assert
            assertNotNull(result);
            assertEquals(1, result.getTotalElements());
        }
    }

    // =========================================================================
    // deleteTopic
    // =========================================================================

    @Nested
    @DisplayName("deleteTopic")
    class DeleteTopicTests {

        @Test
        @DisplayName("DRAFT topic: deleted successfully")
        void draftTopic_success() {
            // Arrange
            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));

            // Act
            topicService.deleteTopic(1L, "researcher@test.com");

            // Assert
            verify(topicRepository, times(1)).delete(draftTopic);
        }

        @Test
        @DisplayName("Non-DRAFT topic: throws IllegalStateException, no delete")
        void nonDraftTopic_throwsIllegalStateException() {
            // Arrange
            Topic submittedTopic = new Topic();
            submittedTopic.setTopicId(2L);
            submittedTopic.setTopicStatus(TopicStatus.PENDING_REVIEW);
            submittedTopic.setFileVersion(1);

            when(topicRepository.findById(2L)).thenReturn(Optional.of(submittedTopic));

            // Act & Assert
            assertThrows(IllegalStateException.class,
                    () -> topicService.deleteTopic(2L, "researcher@test.com"));

            verify(topicRepository, never()).delete(any());
        }

        @Test
        @DisplayName("Missing ID: throws EntityNotFoundException")
        void notFound_throwsEntityNotFoundException() {
            // Arrange
            when(topicRepository.findById(99L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EntityNotFoundException.class,
                    () -> topicService.deleteTopic(99L, "researcher@test.com"));

            verify(topicRepository, never()).delete(any());
        }
    }

    // =========================================================================
    // updateTopic
    // =========================================================================

    @Nested
    @DisplayName("updateTopic")
    class UpdateTopicTests {

        @Test
        @DisplayName("DRAFT topic: all mutable fields are updated and entity is saved")
        void draftTopic_success() {
            // Arrange
            UpdateTopicRequest request = new UpdateTopicRequest();
            request.setTitleVn("Updated Vietnamese Title");
            request.setResearchType(ResearchType.APPLIED);
            request.setResearchField("Data Science");
            request.setDurationMonths(18);
            request.setExpectedBudget(BigDecimal.valueOf(80_000));

            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));
            when(topicRepository.save(any(Topic.class))).thenReturn(draftTopic);
            when(topicMapper.toDetailResponse(any(Topic.class))).thenReturn(detailResponse);

            // Act
            TopicDetailResponse result = topicService.updateTopic(1L, request, "researcher@test.com");

            // Assert
            assertNotNull(result);
            assertEquals("Updated Vietnamese Title", draftTopic.getTitleVn());
            assertEquals(ResearchType.APPLIED,       draftTopic.getResearchType());
            assertEquals("Data Science",             draftTopic.getResearchField());
            assertEquals(18,                         draftTopic.getDurationMonths());
            assertEquals(BigDecimal.valueOf(80_000), draftTopic.getExpectedBudget());
            verify(topicRepository, times(1)).save(draftTopic);
        }

        @Test
        @DisplayName("Non-DRAFT topic: throws IllegalStateException, no save")
        void nonDraftTopic_throwsIllegalStateException() {
            // Arrange
            Topic lockedTopic = new Topic();
            lockedTopic.setTopicId(2L);
            lockedTopic.setTopicStatus(TopicStatus.PENDING_REVIEW);
            lockedTopic.setFileVersion(1);

            UpdateTopicRequest request = new UpdateTopicRequest();
            request.setTitleVn("Won't be applied");
            request.setResearchType(ResearchType.BASIC);
            request.setResearchField("CS");
            request.setDurationMonths(6);
            request.setExpectedBudget(BigDecimal.TEN);

            when(topicRepository.findById(2L)).thenReturn(Optional.of(lockedTopic));

            // Act & Assert
            assertThrows(IllegalStateException.class,
                    () -> topicService.updateTopic(2L, request, "researcher@test.com"));

            verify(topicRepository, never()).save(any());
        }

        @Test
        @DisplayName("Missing ID: throws EntityNotFoundException")
        void notFound_throwsEntityNotFoundException() {
            // Arrange
            when(topicRepository.findById(99L)).thenReturn(Optional.empty());

            UpdateTopicRequest request = new UpdateTopicRequest();
            request.setTitleVn("x");
            request.setResearchType(ResearchType.BASIC);
            request.setResearchField("x");
            request.setDurationMonths(1);
            request.setExpectedBudget(BigDecimal.ONE);

            // Act & Assert
            assertThrows(EntityNotFoundException.class,
                    () -> topicService.updateTopic(99L, request, "user@test.com"));
        }
    }

    // =========================================================================
    // uploadAttachment
    // =========================================================================

    @Nested
    @DisplayName("uploadAttachment")
    class UploadAttachmentTests {

        @Test
        @DisplayName("Valid file: attachment stored, fileVersion incremented, response returned")
        void success(@TempDir Path tempDir) throws IOException {
            // Arrange
            ReflectionTestUtils.setField(topicService, "uploadDir", tempDir.toString());

            MultipartFile file = mock(MultipartFile.class);
            when(file.getOriginalFilename()).thenReturn("research.pdf");
            when(file.getInputStream())
                    .thenReturn(new ByteArrayInputStream("pdf-content".getBytes()));
            when(file.getContentType()).thenReturn("application/pdf");

            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));
            when(topicRepository.save(any(Topic.class))).thenReturn(draftTopic);

            // Act
            AttachmentResponse response = topicService.uploadAttachment(1L, file, "researcher@test.com");

            // Assert
            assertNotNull(response);
            assertEquals("application/pdf", response.getDocumentType());
            assertEquals(2, response.getFileVersion(),
                    "fileVersion must increment from 1 to 2");
            verify(topicRepository, times(1)).save(any(Topic.class));
        }

        @Test
        @DisplayName("null contentType: defaults to 'application/octet-stream'")
        void nullContentType_usesDefaultContentType(@TempDir Path tempDir) throws IOException {
            // Arrange
            ReflectionTestUtils.setField(topicService, "uploadDir", tempDir.toString());

            MultipartFile file = mock(MultipartFile.class);
            when(file.getOriginalFilename()).thenReturn("binary.bin");
            when(file.getInputStream())
                    .thenReturn(new ByteArrayInputStream("bytes".getBytes()));
            when(file.getContentType()).thenReturn(null);

            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));
            when(topicRepository.save(any(Topic.class))).thenReturn(draftTopic);

            // Act
            AttachmentResponse response = topicService.uploadAttachment(1L, file, "researcher@test.com");

            // Assert
            assertEquals("application/octet-stream", response.getDocumentType());
        }

        @Test
        @DisplayName("null originalFilename: stored file URI contains 'unknown' token")
        void nullFilename_usesUnknownToken(@TempDir Path tempDir) throws IOException {
            // Arrange
            ReflectionTestUtils.setField(topicService, "uploadDir", tempDir.toString());

            MultipartFile file = mock(MultipartFile.class);
            when(file.getOriginalFilename()).thenReturn(null);
            when(file.getInputStream())
                    .thenReturn(new ByteArrayInputStream("bytes".getBytes()));
            when(file.getContentType()).thenReturn("application/pdf");

            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));
            when(topicRepository.save(any(Topic.class))).thenReturn(draftTopic);

            // Act
            AttachmentResponse response = topicService.uploadAttachment(1L, file, "researcher@test.com");

            // Assert
            assertNotNull(response);
            assertTrue(response.getFileUri().contains("unknown"),
                    "fileUri must contain 'unknown' when originalFilename is null");
        }

        @Test
        @DisplayName("IOException from getInputStream: wraps to IllegalStateException")
        void ioException_throwsIllegalStateException(@TempDir Path tempDir) throws IOException {
            // Arrange
            ReflectionTestUtils.setField(topicService, "uploadDir", tempDir.toString());

            MultipartFile file = mock(MultipartFile.class);
            // getOriginalFilename IS called before the try-block; getContentType is NOT reached
            when(file.getOriginalFilename()).thenReturn("test.pdf");
            when(file.getInputStream()).thenThrow(new IOException("Simulated disk failure"));

            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));

            // Act & Assert
            IllegalStateException ex = assertThrows(IllegalStateException.class,
                    () -> topicService.uploadAttachment(1L, file, "researcher@test.com"));

            assertTrue(ex.getMessage().contains("Failed to store file"),
                    "Exception message must contain the service's prefix text");
        }

        @Test
        @DisplayName("Topic not found: throws EntityNotFoundException before any IO")
        void topicNotFound_throwsEntityNotFoundException() {
            // Arrange
            when(topicRepository.findById(99L)).thenReturn(Optional.empty());
            MultipartFile file = mock(MultipartFile.class);

            // Act & Assert
            assertThrows(EntityNotFoundException.class,
                    () -> topicService.uploadAttachment(99L, file, "researcher@test.com"));
        }
    }

    // =========================================================================
    // getAuditLogs
    // =========================================================================

    @Nested
    @DisplayName("getAuditLogs")
    class GetAuditLogsTests {

        @Test
        @DisplayName("Topic with one log: returns correctly mapped AuditLogResponse list")
        void success() {
            // Arrange — AuditLog.previousStatus and newStatus are String (raw VARCHAR, not enum)
            AuditLog log = new AuditLog();
            log.setAuditLogId(1L);
            log.setPreviousStatus("DRAFT");
            log.setNewStatus("PENDING_REVIEW");
            log.setFeedbackMessage("Submitted by researcher");

            draftTopic.getAuditLogs().add(log);

            AuditLogResponse logResponse = new AuditLogResponse();
            logResponse.setId(1L);
            logResponse.setPreviousStatus("DRAFT");
            logResponse.setNewStatus("PENDING_REVIEW");
            logResponse.setFeedbackNote("Submitted by researcher");

            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));
            when(auditLogMapper.toResponse(log)).thenReturn(logResponse);

            // Act
            List<AuditLogResponse> result = topicService.getAuditLogs(1L);

            // Assert
            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(logResponse, result.get(0));
        }

        @Test
        @DisplayName("Topic not found: throws EntityNotFoundException")
        void topicNotFound_throwsEntityNotFoundException() {
            // Arrange
            when(topicRepository.findById(99L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EntityNotFoundException.class, () -> topicService.getAuditLogs(99L));
        }
    }

    // =========================================================================
    // getAverageScore
    // =========================================================================

    @Nested
    @DisplayName("getAverageScore")
    class GetAverageScoreTests {

        @Test
        @DisplayName("Two submitted evaluations: returns correct mean rounded to 2 dp")
        void success() {
            // Arrange
            Council council = new Council();
            council.setCouncilId(5L);
            council.setCouncilName("Test Council");

            Topic topicWithCouncil = new Topic();
            topicWithCouncil.setTopicId(1L);
            topicWithCouncil.setTopicStatus(TopicStatus.COUNCIL_REVIEWED);
            topicWithCouncil.setAssignedCouncil(council);
            topicWithCouncil.setFileVersion(1);

            CouncilMember member1 = new CouncilMember();
            member1.setCouncilMemberId(1L);
            member1.setCouncilRole(CouncilRole.CHAIRMAN);

            CouncilMember member2 = new CouncilMember();
            member2.setCouncilMemberId(2L);
            member2.setCouncilRole(CouncilRole.MEMBER);

            // totalScore1=70, totalScore2=80 → average=75.00
            Evaluation eval1 = new Evaluation();
            eval1.setEvaluationId(1L);
            eval1.setTotalScore(BigDecimal.valueOf(70));
            eval1.setSubmissionStatus(SubmissionStatus.SUBMITTED);

            Evaluation eval2 = new Evaluation();
            eval2.setEvaluationId(2L);
            eval2.setTotalScore(BigDecimal.valueOf(80));
            eval2.setSubmissionStatus(SubmissionStatus.SUBMITTED);

            when(topicRepository.findById(1L)).thenReturn(Optional.of(topicWithCouncil));
            when(councilMemberRepository.findByCouncilCouncilId(5L))
                    .thenReturn(List.of(member1, member2));
            when(evaluationRepository.findByCouncilMemberInAndSubmissionStatus(
                    List.of(member1, member2), SubmissionStatus.SUBMITTED))
                    .thenReturn(List.of(eval1, eval2));

            // Act
            BigDecimal result = topicService.getAverageScore(1L);

            // Assert
            assertNotNull(result);
            assertEquals(0, BigDecimal.valueOf(75.00).compareTo(result),
                    "Expected average of 70 and 80 to be 75.00");
        }

        @Test
        @DisplayName("No council assigned: throws IllegalStateException, no repo calls")
        void noCouncilAssigned_throwsIllegalStateException() {
            // Arrange — draftTopic.assignedCouncil is null (not set in setUp)
            when(topicRepository.findById(1L)).thenReturn(Optional.of(draftTopic));

            // Act & Assert
            assertThrows(IllegalStateException.class,
                    () -> topicService.getAverageScore(1L));

            verifyNoInteractions(councilMemberRepository, evaluationRepository);
        }

        @Test
        @DisplayName("No submitted evaluations: throws IllegalStateException")
        void noSubmittedEvaluations_throwsIllegalStateException() {
            // Arrange
            Council council = new Council();
            council.setCouncilId(5L);

            Topic topicWithCouncil = new Topic();
            topicWithCouncil.setTopicId(1L);
            topicWithCouncil.setAssignedCouncil(council);
            topicWithCouncil.setFileVersion(1);

            when(topicRepository.findById(1L)).thenReturn(Optional.of(topicWithCouncil));
            when(councilMemberRepository.findByCouncilCouncilId(5L)).thenReturn(List.of());
            when(evaluationRepository.findByCouncilMemberInAndSubmissionStatus(
                    anyList(), any(SubmissionStatus.class)))
                    .thenReturn(List.of());

            // Act & Assert
            assertThrows(IllegalStateException.class,
                    () -> topicService.getAverageScore(1L));
        }

        @Test
        @DisplayName("Topic not found: throws EntityNotFoundException")
        void topicNotFound_throwsEntityNotFoundException() {
            // Arrange
            when(topicRepository.findById(99L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(EntityNotFoundException.class,
                    () -> topicService.getAverageScore(99L));
        }
    }

    // =========================================================================
    // getTopicsByDepartment
    // =========================================================================

    @Nested
    @DisplayName("getTopicsByDepartment")
    class GetTopicsByDepartmentTests {

        @Test
        @DisplayName("Returns paginated topics belonging to the specified department")
        void success() {
            // Arrange
            Page<Topic> topicPage = new PageImpl<>(List.of(draftTopic));
            when(topicRepository.findByManagingDepartmentDepartmentId(10L, pageable))
                    .thenReturn(topicPage);
            when(topicMapper.toListResponse(draftTopic)).thenReturn(listResponse);

            // Act
            Page<TopicListResponse> result = topicService.getTopicsByDepartment(10L, pageable);

            // Assert
            assertNotNull(result);
            assertEquals(1, result.getTotalElements());
            assertEquals(listResponse, result.getContent().get(0));
        }
    }

    // =========================================================================
    // Static provider methods for @MethodSource
    // =========================================================================

    /**
     * All 10 legal FSM transitions defined in {@link TopicServiceImpl#VALID_TRANSITIONS}.
     */
    static Stream<Arguments> validTransitions() {
        return Stream.of(
                Arguments.of(TopicStatus.DRAFT,             TopicStatus.PENDING_REVIEW),
                Arguments.of(TopicStatus.PENDING_REVIEW,    TopicStatus.DEPT_APPROVED),
                Arguments.of(TopicStatus.PENDING_REVIEW,    TopicStatus.DEPT_REJECTED),
                Arguments.of(TopicStatus.DEPT_APPROVED,     TopicStatus.PENDING_COUNCIL),
                Arguments.of(TopicStatus.DEPT_REJECTED,     TopicStatus.DRAFT),
                Arguments.of(TopicStatus.PENDING_COUNCIL,   TopicStatus.COUNCIL_REVIEWED),
                Arguments.of(TopicStatus.COUNCIL_REVIEWED,  TopicStatus.APPROVED),
                Arguments.of(TopicStatus.COUNCIL_REVIEWED,  TopicStatus.REJECTED),
                Arguments.of(TopicStatus.COUNCIL_REVIEWED,  TopicStatus.REVISION_REQUIRED),
                Arguments.of(TopicStatus.REVISION_REQUIRED, TopicStatus.PENDING_REVIEW)
        );
    }

    /**
     * Selected illegal FSM edges that must all be rejected.
     * Covers both terminal states and non-sequential jumps.
     */
    static Stream<Arguments> invalidTransitions() {
        return Stream.of(
                Arguments.of(TopicStatus.APPROVED,       TopicStatus.PENDING_REVIEW),
                Arguments.of(TopicStatus.REJECTED,       TopicStatus.DRAFT),
                Arguments.of(TopicStatus.DRAFT,          TopicStatus.APPROVED),
                Arguments.of(TopicStatus.DRAFT,          TopicStatus.DEPT_APPROVED),
                Arguments.of(TopicStatus.PENDING_REVIEW, TopicStatus.DRAFT)
        );
    }
}
