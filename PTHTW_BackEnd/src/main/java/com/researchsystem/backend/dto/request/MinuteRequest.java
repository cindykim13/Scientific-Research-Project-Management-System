package com.researchsystem.backend.dto.request;

import com.researchsystem.backend.domain.enums.FinalDecision;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MinuteRequest {

    @NotNull(message = "Council ID must not be null")
    private Long councilId;

    private String synthesizedComments;

    @NotNull(message = "Final decision must not be null")
    private FinalDecision finalDecision;

    @NotNull(message = "Legal confirmation must not be null")
    private Boolean legalConfirmation;
}
