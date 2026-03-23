package com.researchsystem.backend.controller;

import com.researchsystem.backend.dto.request.CreateManagerRequest;
import com.researchsystem.backend.dto.request.UpdateUserStatusRequest;
import com.researchsystem.backend.dto.response.UserResponse;
import com.researchsystem.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "User Management", description = "Account creation and user status administration")
public class UserController {

    private final UserService userService;

    @PostMapping("/managers")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Create a new MANAGER account",
            description = "Admin-only endpoint that provisions a manager user with an initial password " +
                          "and assigns them to a department."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Manager account created successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — validation error or email already in use"),
            @ApiResponse(responseCode = "403", description = "Forbidden — ADMIN role required")
    })
    public ResponseEntity<UserResponse> createManager(@Valid @RequestBody CreateManagerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createManager(request));
    }

    @GetMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(
            summary = "List all users (paginated)",
            description = "Returns a paginated list of all system users. Accessible by ADMIN and MANAGER roles."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User list returned successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — invalid pagination parameters"),
            @ApiResponse(responseCode = "403", description = "Forbidden — ADMIN or MANAGER role required")
    })
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @ParameterObject @PageableDefault(size = 20, sort = "userId") Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Lock or unlock a user account",
            description = "Admin-only endpoint. Sets the user's active flag to lock (false) or unlock (true) " +
                          "their ability to authenticate."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — validation error"),
            @ApiResponse(responseCode = "403", description = "Forbidden — ADMIN role required")
    })
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        return ResponseEntity.ok(userService.updateUserStatus(id, request));
    }
}
