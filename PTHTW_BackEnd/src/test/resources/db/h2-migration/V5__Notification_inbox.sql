-- H2 test mirror of V7__Notification_inbox.sql

CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_user_id BIGINT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    resource_type VARCHAR(50),
    resource_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_user_id)
        REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_recipient_created ON notifications (recipient_user_id, created_at);
CREATE INDEX idx_notifications_recipient_read ON notifications (recipient_user_id, read_at);

