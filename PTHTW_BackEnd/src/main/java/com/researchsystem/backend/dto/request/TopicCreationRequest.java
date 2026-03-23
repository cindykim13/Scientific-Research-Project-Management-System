package com.researchsystem.backend.dto.request;

import com.researchsystem.backend.domain.enums.ResearchType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicCreationRequest {

    @NotBlank
    @Size(max = 50)
    @Pattern(regexp = "^[A-Z0-9-]+$")
    private String topicCode;

    @NotBlank
    @Size(max = 255)
    private String titleVn;

    @NotNull
    private ResearchType researchType;

    @NotBlank
    @Size(max = 100)
    private String researchField;

    @NotNull
    @Min(1)
    @Max(60)
    private Integer durationMonths;

    @NotNull
    private BigDecimal expectedBudget;

    @NotNull
    private Long managingDepartmentId;
}
