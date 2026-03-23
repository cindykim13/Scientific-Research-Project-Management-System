package com.researchsystem.backend.dto.response;

import com.researchsystem.backend.domain.enums.ResearchType;
import com.researchsystem.backend.domain.enums.TopicStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicDetailResponse {

    // --- Fields inherited from TopicListResponse ---
    private Long id;
    private String topicCode;
    private String titleVn;
    private TopicStatus topicStatus;
    private BigDecimal expectedBudget;
    private String investigatorFullName;
    private String managingDepartmentName;

    // --- Additional scalar fields ---
    private ResearchType researchType;
    private String researchField;
    private int durationMonths;
    private LocalDateTime submissionDate;

    // --- Audit history ---
    private List<AuditLogResponse> auditLogs;
}
