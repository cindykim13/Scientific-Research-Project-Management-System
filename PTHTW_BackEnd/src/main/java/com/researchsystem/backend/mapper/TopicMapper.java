package com.researchsystem.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.researchsystem.backend.domain.entity.Topic;
import com.researchsystem.backend.dto.request.TopicCreationRequest;
import com.researchsystem.backend.dto.response.TopicDetailResponse;
import com.researchsystem.backend.dto.response.TopicListResponse;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {AuditLogMapper.class})
public interface TopicMapper {

    @Mapping(target = "id", source = "topicId")
    @Mapping(target = "investigatorFullName", source = "investigator.fullName")
    @Mapping(target = "managingDepartmentName", source = "managingDepartment.departmentName")
    TopicListResponse toListResponse(Topic topic);

    @Mapping(target = "id", source = "topicId")
    @Mapping(target = "investigatorFullName", source = "investigator.fullName")
    @Mapping(target = "managingDepartmentName", source = "managingDepartment.departmentName")
    TopicDetailResponse toDetailResponse(Topic topic);

    @Mapping(target = "topicId", ignore = true)
    @Mapping(target = "topicStatus", ignore = true)
    @Mapping(target = "fileVersion", ignore = true)
    @Mapping(target = "submissionDate", ignore = true)
    @Mapping(target = "investigator", ignore = true)
    @Mapping(target = "managingDepartment", ignore = true)
    @Mapping(target = "assignedCouncil", ignore = true)
    @Mapping(target = "topicAttachments", ignore = true)
    @Mapping(target = "auditLogs", ignore = true)
    Topic toEntity(TopicCreationRequest request);
}
