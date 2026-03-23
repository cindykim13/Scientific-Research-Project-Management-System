package com.researchsystem.backend.controller;

import com.researchsystem.backend.dto.request.AssignTopicsRequest;
import com.researchsystem.backend.dto.request.CouncilAssignmentRequest;
import com.researchsystem.backend.dto.request.CouncilCreateRequest;
import com.researchsystem.backend.dto.response.CouncilDetailResponse;
import com.researchsystem.backend.dto.response.CouncilListResponse;
import com.researchsystem.backend.dto.response.CouncilReadinessResponse;
import com.researchsystem.backend.dto.response.TopicListResponse;
import com.researchsystem.backend.service.CouncilService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/councils")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Councils", description = "Evaluation council creation, membership assignment, and readiness tracking")
public class CouncilController {

    private final CouncilService councilService;

    @PostMapping("/")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(
            summary = "Create a new evaluation council",
            description = "MANAGER creates an evaluation council with meeting schedule metadata. " +
                          "Members and topics are assigned in subsequent calls."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Council created successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — validation error on payload"),
            @ApiResponse(responseCode = "403", description = "Forbidden — MANAGER role required")
    })
    public ResponseEntity<CouncilDetailResponse> createCouncil(@Valid @RequestBody CouncilCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(councilService.createCouncil(request));
    }

    @GetMapping("/")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @Operation(
            summary = "List all evaluation councils (paginated)",
            description = "Returns a paginated summary of all councils including member and topic counts. " +
                          "Accessible by MANAGER and ADMIN."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Council list returned successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — invalid pagination parameters"),
            @ApiResponse(responseCode = "403", description = "Forbidden — MANAGER or ADMIN role required")
    })
    public ResponseEntity<Page<CouncilListResponse>> getAllCouncils(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(councilService.getAllCouncils(pageable));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get full details of a council",
            description = "Returns complete council information including all members with roles " +
                          "and all assigned topics. Accessible by all authenticated users."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Council detail returned successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "403", description = "Forbidden — authentication required")
    })
    public ResponseEntity<CouncilDetailResponse> getCouncilById(@PathVariable Long id) {
        return ResponseEntity.ok(councilService.getCouncilById(id));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(
            summary = "Assign expert members to a council",
            description = "MANAGER assigns a list of user IDs as MEMBER-role council experts. " +
                          "Enforces uniqueness and the investigator-exclusion rule."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Members assigned successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — duplicate IDs or investigator-exclusion violation"),
            @ApiResponse(responseCode = "403", description = "Forbidden — MANAGER role required")
    })
    public ResponseEntity<Void> assignMembers(@PathVariable Long id,
                                              @Valid @RequestBody CouncilAssignmentRequest request) {
        councilService.assignCouncilMembers(id, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/topics")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(
            summary = "Assign DEPT_APPROVED topics to a council for evaluation",
            description = "MANAGER assigns a batch of department-approved topics to this council. " +
                          "Each topic's status transitions from DEPT_APPROVED → PENDING_COUNCIL."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Topics assigned to council successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — a topic is not in DEPT_APPROVED status"),
            @ApiResponse(responseCode = "403", description = "Forbidden — MANAGER role required")
    })
    public ResponseEntity<Void> assignTopics(@PathVariable Long id,
                                             @Valid @RequestBody AssignTopicsRequest request) {
        councilService.assignTopics(id, request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/topics")
    @PreAuthorize("hasRole('COUNCIL')")
    @Operation(
            summary = "Expert views all topics assigned to their councils",
            description = "Returns all research topics that belong to any council the authenticated " +
                          "COUNCIL expert is a member of."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Assigned topics returned successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — invalid pagination parameters"),
            @ApiResponse(responseCode = "403", description = "Forbidden — COUNCIL role required")
    })
    public ResponseEntity<Page<TopicListResponse>> getMyTopics(
            @PageableDefault(size = 20) Pageable pageable,
            Principal principal) {
        return ResponseEntity.ok(councilService.getExpertTopics(principal.getName(), pageable));
    }

    @GetMapping("/{id}/evaluations/status")
    @PreAuthorize("hasRole('COUNCIL')")
    @Operation(
            summary = "Check evaluation readiness status of a council",
            description = "Returns a readiness summary showing how many non-secretary members have " +
                          "submitted their evaluations and whether the council is ready for minute submission."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Readiness status returned successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "403", description = "Forbidden — COUNCIL role required")
    })
    public ResponseEntity<CouncilReadinessResponse> getEvaluationStatus(@PathVariable Long id) {
        return ResponseEntity.ok(councilService.getEvaluationStatus(id));
    }
}
