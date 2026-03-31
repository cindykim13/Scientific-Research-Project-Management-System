package com.researchsystem.backend.service;

import com.researchsystem.backend.dto.request.LoginRequest;
import com.researchsystem.backend.dto.request.RegisterTestRequest;
import com.researchsystem.backend.dto.request.UpdatePasswordRequest;
import com.researchsystem.backend.dto.response.AuthResponse;
import com.researchsystem.backend.dto.response.UserResponse;

public interface AuthService {

    /**
     * Authenticates a user with email and password, returning a signed JWT.
     */
    AuthResponse login(LoginRequest request);

    /**
     * Returns the profile of the currently authenticated user.
     *
     * @param email email extracted from the JWT subject
     */
    UserResponse getCurrentUser(String email);

    /**
     * Updates the password for the authenticated user after verifying the current one.
     * Clears the first-login flag upon success.
     *
     * @param email   email of the authenticated user
     * @param request payload with currentPassword and newPassword
     */
    void updatePassword(String email, UpdatePasswordRequest request);

    /**
     * Temporary bootstrap: creates a user with an encoded password for local/testing when seed hashes mismatch.
     */
    void registerTestUser(RegisterTestRequest request);
}
