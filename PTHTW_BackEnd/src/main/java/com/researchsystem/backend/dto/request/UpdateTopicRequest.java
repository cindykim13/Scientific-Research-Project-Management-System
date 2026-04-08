package com.researchsystem.backend.dto.request;

import com.researchsystem.backend.domain.enums.ResearchType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTopicRequest {

    @Size(max = 255)
    private String titleVn;

    private ResearchType researchType;

    @Size(max = 100)
    private String researchField;

    @Min(value = 1, message = "Duration must be at least 1 month")
    @Max(value = 60, message = "Duration must not exceed 60 months")
    private Integer durationMonths;

    private BigDecimal expectedBudget;
}
