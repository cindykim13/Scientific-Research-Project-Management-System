package com.researchsystem.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouncilReadinessResponse {

    private Long councilId;
    private Long topicId;
    private boolean ready;
    private int totalNonSecretaries;
    private long submittedCount;
    private String message;
}
