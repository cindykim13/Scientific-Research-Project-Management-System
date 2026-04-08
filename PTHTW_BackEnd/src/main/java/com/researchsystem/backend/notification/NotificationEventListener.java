package com.researchsystem.backend.notification;

import com.researchsystem.backend.domain.entity.Notification;
import com.researchsystem.backend.domain.entity.Topic;
import com.researchsystem.backend.repository.NotificationRepository;
import com.researchsystem.backend.repository.TopicRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationRepository notificationRepository;
    private final TopicRepository topicRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onTopicStatusChanged(TopicStatusChangedEvent event) {
        Topic topic = topicRepository.findById(event.topicId())
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + event.topicId()));

        String title = "Topic status changed: " + topic.getTopicCode();
        String body = "Topic " + topic.getTopicCode() + " transitioned to " + event.newStatus()
                + " (actor=" + event.actorEmail() + ")";

        notificationRepository.save(Notification.builder()
                .recipient(topic.getInvestigator())
                .notificationType("TOPIC_STATUS_CHANGED")
                .title(title)
                .body(body)
                .resourceType("TOPIC")
                .resourceId(topic.getTopicId())
                .build());
    }
}

