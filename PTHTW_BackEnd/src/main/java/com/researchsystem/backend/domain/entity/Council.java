package com.researchsystem.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "councils")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Council {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "council_id")
    private Long councilId;

    @Column(name = "council_name", nullable = false, length = 255)
    private String councilName;

    @Column(name = "meeting_date", nullable = false)
    private LocalDate meetingDate;

    @Column(name = "meeting_time", nullable = false)
    private LocalTime meetingTime;

    @Column(name = "meeting_location", nullable = false, length = 255)
    private String meetingLocation;

    // -----------------------------------------------------------------------
    // Bidirectional relationships
    // -----------------------------------------------------------------------

    @Builder.Default
    @OneToMany(
            mappedBy = "council",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<CouncilMember> councilMembers = new ArrayList<>();

    @Builder.Default
    @OneToMany(
            mappedBy = "assignedCouncil",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Topic> topics = new ArrayList<>();

    @OneToOne(
            mappedBy = "council",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Minute minute;
}
