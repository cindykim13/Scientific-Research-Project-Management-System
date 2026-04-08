package com.researchsystem.backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.researchsystem.backend.domain.enums.FinalDecision;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "minutes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Minute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "minute_id")
    private Long minuteId;

    @Column(name = "average_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal averageScore;

    @Column(name = "synthesized_comments", nullable = false, columnDefinition = "TEXT")
    private String synthesizedComments;

    @Enumerated(EnumType.STRING)
    @Column(name = "final_decision", nullable = false, length = 50)
    private FinalDecision finalDecision;

    @Column(name = "legal_confirmation", nullable = false)
    private boolean legalConfirmation;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // -----------------------------------------------------------------------
    // Topic-scoped minute: each topic has exactly one final minute.
    // -----------------------------------------------------------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "council_id", nullable = false)
    @JsonIgnoreProperties({"councilMembers", "topics"})
    private Council council;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"assignedCouncil", "investigator", "managingDepartment", "topicAttachments", "auditLogs", "evaluations"})
    private Topic topic;
}
