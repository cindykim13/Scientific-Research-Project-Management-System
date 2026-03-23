package com.researchsystem.backend.service;

import com.researchsystem.backend.dto.request.CreateManagerRequest;
import com.researchsystem.backend.dto.request.UpdateUserStatusRequest;
import com.researchsystem.backend.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    /**
     * Creates a new MANAGER account. Callable only by ADMIN.
     *
     * @param request creation payload with email, fullName, departmentId, and initialPassword
     * @return the persisted manager's profile
     */
    UserResponse createManager(CreateManagerRequest request);

    /**
     * Returns a paginated list of all users in the system.
     * Accessible by ADMIN and MANAGER.
     */
    Page<UserResponse> getAllUsers(Pageable pageable);

    /**
     * Locks or unlocks a user account by toggling the active flag.
     * Callable only by ADMIN.
     *
     * @param id      target user's ID
     * @param request payload carrying the desired active state
     * @return the updated user profile
     */
    UserResponse updateUserStatus(Long id, UpdateUserStatusRequest request);
}
