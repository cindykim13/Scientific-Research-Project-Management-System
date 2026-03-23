package com.researchsystem.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouncilAssignmentRequest {

    @NotBlank
    @Size(max = 100)
    private String councilName;

    @NotNull
    private LocalDate meetingDate;

    @NotEmpty
    private List<Long> expertUserIds;
}
