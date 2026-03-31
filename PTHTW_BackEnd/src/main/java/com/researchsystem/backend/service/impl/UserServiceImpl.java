package com.researchsystem.backend.service.impl;

import com.researchsystem.backend.domain.entity.Department;
import com.researchsystem.backend.domain.entity.User;
import com.researchsystem.backend.domain.enums.SystemRole;
import com.researchsystem.backend.dto.request.CreateDeptHeadRequest;
import com.researchsystem.backend.dto.request.CreateManagerRequest;
import com.researchsystem.backend.dto.request.CreateResearcherRequest;
import com.researchsystem.backend.dto.request.UpdateUserStatusRequest;
import com.researchsystem.backend.dto.response.UserResponse;
import com.researchsystem.backend.repository.DepartmentRepository;
import com.researchsystem.backend.repository.UserRepository;
import com.researchsystem.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createManager(CreateManagerRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use: " + request.getEmail());
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Department not found with id: " + request.getDepartmentId()));

        User manager = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getInitialPassword()))
                .fullName(request.getFullName())
                .academicTitle(request.getAcademicTitle())
                .systemRole(SystemRole.MANAGER)
                .isFirstLogin(true)
                .active(true)
                .department(department)
                .build();

        User saved = userRepository.save(manager);
        return toUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse createResearcher(CreateResearcherRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use: " + request.getEmail());
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Department not found with id: " + request.getDepartmentId()));

        User researcher = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getInitialPassword()))
                .fullName(request.getFullName())
                .academicTitle(request.getAcademicTitle())
                .systemRole(SystemRole.RESEARCHER)
                .isFirstLogin(true)
                .active(true)
                .department(department)
                .build();

        User saved = userRepository.save(researcher);
        return toUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse createDeptHead(CreateDeptHeadRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use: " + request.getEmail());
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Department not found with id: " + request.getDepartmentId()));

        User head = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getInitialPassword()))
                .fullName(request.getFullName())
                .academicTitle(request.getAcademicTitle())
                .systemRole(SystemRole.DEPT_HEAD)
                .isFirstLogin(true)
                .active(true)
                .department(department)
                .build();

        User saved = userRepository.save(head);
        return toUserResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toUserResponse);
    }

    @Override
    @Transactional
    public UserResponse updateUserStatus(Long id, UpdateUserStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        user.setActive(request.getActive());
        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .academicTitle(user.getAcademicTitle())
                .systemRole(user.getSystemRole())
                .firstLogin(user.isFirstLogin())
                .active(user.isActive())
                .departmentName(user.getDepartment() != null
                        ? user.getDepartment().getDepartmentName() : null)
                .build();
    }
}
