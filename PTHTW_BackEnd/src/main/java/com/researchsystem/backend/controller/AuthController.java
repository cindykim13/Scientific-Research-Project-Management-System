package com.researchsystem.backend.controller;

import com.researchsystem.backend.dto.request.LoginRequest;
import com.researchsystem.backend.dto.request.RegisterTestRequest;
import com.researchsystem.backend.dto.request.UpdatePasswordRequest;
import com.researchsystem.backend.dto.response.AuthResponse;
import com.researchsystem.backend.dto.response.UserResponse;
import com.researchsystem.backend.service.AuthService;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, profile retrieval, and password management")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(
            summary = "Authenticate user and obtain JWT token",
            description = "Validates email/password credentials and returns a signed JWT for use in subsequent requests."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Authentication successful; JWT returned"),
            @ApiResponse(responseCode = "400", description = "Bad Request — validation error on request body"),
            @ApiResponse(responseCode = "401", description = "Unauthorized — invalid credentials")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register-test")
    @Operation(
            summary = "[Temporary] Register a test user for bootstrap",
            description = "Creates a user with a BCrypt-encoded password. Intended for local/dev when seed data hashes do not match the encoder."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User created"),
            @ApiResponse(responseCode = "400", description = "Validation error or email already in use")
    })
    public ResponseEntity<Void> registerTest(@Valid @RequestBody RegisterTestRequest request) {
        authService.registerTestUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Get current authenticated user's profile",
            description = "Returns the full profile of the user identified by the JWT in the Authorization header."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "403", description = "Forbidden — valid token required")
    })
    public ResponseEntity<UserResponse> getMe(@Parameter(hidden = true) Principal principal) {
        return ResponseEntity.ok(authService.getCurrentUser(principal.getName()));
    }

    @PatchMapping("/password")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Update password for the authenticated user",
            description = "Verifies the current password before setting the new one. " +
                          "Clears the first-login flag upon success."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Password updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request — current password incorrect or validation failure"),
            @ApiResponse(responseCode = "403", description = "Forbidden — valid token required")
    })
    public ResponseEntity<Void> updatePassword(
            @Valid @RequestBody UpdatePasswordRequest request,
            @Parameter(hidden = true) Principal principal) {
        authService.updatePassword(principal.getName(), request);
        return ResponseEntity.noContent().build();
    }
}
