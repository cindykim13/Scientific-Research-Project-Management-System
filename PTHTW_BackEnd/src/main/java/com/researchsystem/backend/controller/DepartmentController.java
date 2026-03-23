package com.researchsystem.backend.controller;

import com.researchsystem.backend.dto.response.DepartmentResponse;
import com.researchsystem.backend.dto.response.TopicListResponse;
import com.researchsystem.backend.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Departments", description = "Department master data and department-scoped topic views")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping("/")
    @Operation(
            summary = "Get master data list of all departments",
            description = "Returns the complete list of departments available in the system. " +
                          "Accessible by all authenticated users (used for dropdown population, etc.)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Department list returned successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "403", description = "Forbidden — authentication required")
    })
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/me/topics")
    @PreAuthorize("hasRole('DEPT_HEAD')")
    @Operation(
            summary = "List topics under the current department head's department",
            description = "Returns all research topics belonging to the department managed by " +
                          "the authenticated DEPT_HEAD, regardless of topic status."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Department topics returned successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — invalid pagination parameters"),
            @ApiResponse(responseCode = "403", description = "Forbidden — DEPT_HEAD role required")
    })
    public ResponseEntity<Page<TopicListResponse>> getDeptTopics(
            @PageableDefault(size = 20) Pageable pageable,
            Principal principal) {
        return ResponseEntity.ok(departmentService.getDeptTopics(principal.getName(), pageable));
    }
}
