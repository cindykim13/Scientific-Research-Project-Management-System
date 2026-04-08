package com.researchsystem.backend.notification;

import com.researchsystem.backend.domain.enums.TopicStatus;

public record TopicStatusChangedEvent(Long topicId, TopicStatus newStatus, String actorEmail) {
}

