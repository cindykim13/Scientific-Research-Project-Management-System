package com.researchsystem.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.researchsystem.backend.domain.entity.AuditLog;
import com.researchsystem.backend.dto.response.AuditLogResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AuditLogMapper {

    @Mapping(target = "id", source = "auditLogId")
    @Mapping(target = "actorFullName", source = "actor.fullName")
    @Mapping(target = "feedbackNote", source = "feedbackMessage")
    AuditLogResponse toResponse(AuditLog auditLog);
}
