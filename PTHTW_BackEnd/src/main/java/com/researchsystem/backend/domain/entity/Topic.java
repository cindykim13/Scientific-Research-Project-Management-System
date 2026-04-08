package com.researchsystem.backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.researchsystem.backend.domain.enums.ResearchType;
import com.researchsystem.backend.domain.enums.TopicStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topic_id")
    private Long topicId;

    @Column(name = "topic_code", nullable = false, unique = true, length = 50)
    private String topicCode;

    @Column(name = "title_vn", nullable = false, length = 255)
    private String titleVn;

    @Column(name = "title_en", nullable = true, length = 255)
    private String titleEn;

    @Enumerated(EnumType.STRING)
    @Column(name = "research_type", nullable = false, length = 50)
    private ResearchType researchType;

    @Column(name = "research_field", nullable = false, length = 100)
    private String researchField;

    @Column(name = "duration_months", nullable = false)
    private int durationMonths;

    @Column(name = "expected_budget", nullable = false, precision = 15, scale = 2)
    private BigDecimal expectedBudget;

    @CreationTimestamp
    @Column(name = "submission_date", nullable = false, updatable = false)
    private LocalDateTime submissionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "topic_status", nullable = false, length = 50)
    private TopicStatus topicStatus;

    @Column(name = "file_version", nullable = false)
    private int fileVersion;

    // -----------------------------------------------------------------------
    // Many-to-one foreign keys
    // -----------------------------------------------------------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigator_id", nullable = false)
    @JsonIgnoreProperties({"topics", "councilMembers", "auditLogs", "passwordHash", "department"})
    private User investigator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "managing_department_id", nullable = false)
    @JsonIgnoreProperties({"users", "topics"})
    private Department managingDepartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_council_id", nullable = true)
    @JsonIgnoreProperties({"topics", "councilMembers"})
    private Council assignedCouncil;

    // -----------------------------------------------------------------------
    // Bidirectional relationships
    // -----------------------------------------------------------------------

    @Builder.Default
    @OneToMany(
            mappedBy = "topic",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnoreProperties({"topic"})
    private List<TopicAttachment> topicAttachments = new ArrayList<>();

    @Builder.Default
    @OneToMany(
            mappedBy = "topic",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnoreProperties({"topic"})
    private List<AuditLog> auditLogs = new ArrayList<>();

    @Builder.Default
    @OneToMany(
            mappedBy = "topic",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnoreProperties({"topic", "councilMember"})
    private List<Evaluation> evaluations = new ArrayList<>();
}
