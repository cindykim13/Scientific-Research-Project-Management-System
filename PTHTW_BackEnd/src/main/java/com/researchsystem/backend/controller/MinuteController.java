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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
            summary = "Submit the final meeting minute for a topic",
            description = "Only the user assigned the SECRETARY role on the topic's council may submit or update minutes. " +
                          "All non-secretary members must have submitted evaluations for that same topic first. " +
                          "The average score is computed from SUBMITTED evaluations."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Meeting minute submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — validation error or missing fields"),
            @ApiResponse(responseCode = "403", description = "Forbidden — not the council secretary"),
            @ApiResponse(responseCode = "409", description = "Conflict — not all evaluations have been submitted yet")
    })
    public ResponseEntity<MinuteResponse> submitMinute(
            @Valid @RequestBody MinuteRequest request,
            @Parameter(hidden = true) Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(minuteService.submitMinute(request, principal.getName()));
    }

    @GetMapping("/topic/{topicId}")
    @PreAuthorize("hasAnyRole('RESEARCHER','MANAGER','ADMIN')")
    @Operation(
            summary = "Get meeting minutes for a topic",
            description = "Principal investigators may read minutes for their own topics once a council is assigned. " +
                          "MANAGER and ADMIN may read minutes for any topic."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Minutes returned"),
            @ApiResponse(responseCode = "403", description = "Forbidden — not the investigator"),
            @ApiResponse(responseCode = "404", description = "Topic, council, or minutes not found")
    })
    public ResponseEntity<MinuteResponse> getMinuteForTopic(
            @PathVariable("topicId") Long topicId,
            @Parameter(hidden = true) Principal principal) {
        return ResponseEntity.ok(minuteService.getMinuteForTopic(topicId, principal.getName()));
    }
}
