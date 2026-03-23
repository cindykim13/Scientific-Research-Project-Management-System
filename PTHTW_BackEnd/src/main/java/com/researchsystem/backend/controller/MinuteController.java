package com.researchsystem.backend.controller;

import com.researchsystem.backend.dto.request.MinuteRequest;
import com.researchsystem.backend.dto.response.MinuteResponse;
import com.researchsystem.backend.service.MinuteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/minutes")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Meeting Minutes", description = "Final meeting minute submission after all evaluations are complete")
public class MinuteController {

    private final MinuteService minuteService;

    @PostMapping
    @PreAuthorize("hasRole('COUNCIL')")
    @Operation(
            summary = "Submit the final meeting minute for a council",
            description = "COUNCIL member (typically the Chairman or Secretary) submits the final " +
                          "meeting minute after all non-secretary members have submitted their evaluations. " +
                          "The average score is computed automatically from all SUBMITTED evaluations."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Meeting minute submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — validation error or missing fields"),
            @ApiResponse(responseCode = "403", description = "Forbidden — COUNCIL role required"),
            @ApiResponse(responseCode = "409", description = "Conflict — not all evaluations have been submitted yet")
    })
    public ResponseEntity<MinuteResponse> submitMinute(
            @Valid @RequestBody MinuteRequest request,
            @Parameter(hidden = true) Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(minuteService.submitMinute(request, principal.getName()));
    }
}
