package com.researchsystem.backend.dto.response;

import com.researchsystem.backend.domain.enums.FinalDecision;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MinuteResponse {

    private Long minuteId;
    private Long councilId;
    private String councilName;
    private BigDecimal averageScore;
    private String synthesizedComments;
    private FinalDecision finalDecision;
    private Boolean legalConfirmation;
    private LocalDateTime createdAt;
}
