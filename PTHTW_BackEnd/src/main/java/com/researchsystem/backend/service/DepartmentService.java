package com.researchsystem.backend.service;

import com.researchsystem.backend.dto.response.DepartmentResponse;
import com.researchsystem.backend.dto.response.TopicListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DepartmentService {

    /**
     * Returns the complete master data list of all active departments.
     */
    List<DepartmentResponse> getAllDepartments();

    /**
     * Returns all topics belonging to the department managed by the current DEPT_HEAD user.
     *
     * @param deptHeadEmail email of the authenticated DEPT_HEAD
     * @param pageable      pagination parameters
     */
    Page<TopicListResponse> getDeptTopics(String deptHeadEmail, Pageable pageable);
}
