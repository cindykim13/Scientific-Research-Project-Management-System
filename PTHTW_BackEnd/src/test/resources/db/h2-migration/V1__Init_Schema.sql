-- ==============================================================================
-- H2 TEST MIGRATION — mirrors V1__Init_Schema.sql from production.
-- Key differences vs. the production MySQL script:
--   1. ENGINE / CHARSET / COLLATE table options are omitted (H2 ignores them,
--      but including them can cause parse errors outside MySQL-mode edge cases).
--   2. All DELIMITER // ... END // trigger blocks are removed.
--      H2 does not support the MySQL-client DELIMITER directive.
--   3. is_active column is added to the users table to satisfy the @Column
--      mapping added to the User entity in a previous session.
-- Column names, types, and constraints are intentionally identical to
-- production so Hibernate's ddl-auto: validate passes without errors.
-- ==============================================================================

-- 1. DEPARTMENTS
CREATE TABLE departments (
    department_id   BIGINT AUTO_INCREMENT,
    department_code VARCHAR(50)  NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    contact_email   VARCHAR(255) NULL,
    contact_phone   VARCHAR(20)  NULL,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (department_id),
    UNIQUE KEY uq_dept_code (department_code)
);

-- 2. COUNCILS
CREATE TABLE councils (
    council_id       BIGINT AUTO_INCREMENT,
    council_name     VARCHAR(255) NOT NULL,
    meeting_date     DATE         NOT NULL,
    meeting_time     TIME         NOT NULL,
    meeting_location VARCHAR(255) NOT NULL,
    PRIMARY KEY (council_id)
);

-- 3. USERS  (includes is_active, absent from the original production V1)
CREATE TABLE users (
    user_id        BIGINT AUTO_INCREMENT,
    email          VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(60)  NOT NULL,
    full_name      VARCHAR(150) NOT NULL,
    academic_title VARCHAR(50)  NULL,
    system_role    VARCHAR(50)  NOT NULL,
    is_first_login BOOLEAN      NOT NULL DEFAULT TRUE,
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    department_id  BIGINT       NULL,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_user_email (email),
    CONSTRAINT fk_user_department FOREIGN KEY (department_id)
        REFERENCES departments(department_id) ON DELETE RESTRICT
);

-- 4. TOPICS
CREATE TABLE topics (
    topic_id               BIGINT AUTO_INCREMENT,
    topic_code             VARCHAR(50)   NOT NULL,
    title_vn               VARCHAR(255)  NOT NULL,
    title_en               VARCHAR(255)  NULL,
    research_type          VARCHAR(50)   NOT NULL,
    research_field         VARCHAR(100)  NOT NULL,
    duration_months        INT           NOT NULL,
    expected_budget        DECIMAL(15,2) NOT NULL,
    submission_date        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    topic_status           VARCHAR(50)   NOT NULL,
    file_version           INT           NOT NULL DEFAULT 1,
    investigator_id        BIGINT        NOT NULL,
    managing_department_id BIGINT        NOT NULL,
    assigned_council_id    BIGINT        NULL,
    PRIMARY KEY (topic_id),
    UNIQUE KEY uq_topic_code (topic_code),
    CONSTRAINT fk_topic_investigator FOREIGN KEY (investigator_id)
        REFERENCES users(user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_topic_department FOREIGN KEY (managing_department_id)
        REFERENCES departments(department_id) ON DELETE RESTRICT,
    CONSTRAINT fk_topic_council FOREIGN KEY (assigned_council_id)
        REFERENCES councils(council_id) ON DELETE SET NULL
);

-- 5. TOPIC_ATTACHMENTS
CREATE TABLE topic_attachments (
    attachment_id BIGINT AUTO_INCREMENT,
    document_type VARCHAR(50)  NOT NULL,
    file_uri      VARCHAR(500) NOT NULL,
    uploaded_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    topic_id      BIGINT       NOT NULL,
    file_version  INT          NOT NULL,
    PRIMARY KEY (attachment_id),
    CONSTRAINT fk_attachment_topic FOREIGN KEY (topic_id)
        REFERENCES topics(topic_id) ON DELETE CASCADE
);

-- 6. COUNCIL_MEMBERS
CREATE TABLE council_members (
    council_member_id BIGINT AUTO_INCREMENT,
    council_role      VARCHAR(50) NOT NULL,
    council_id        BIGINT      NOT NULL,
    user_id           BIGINT      NOT NULL,
    PRIMARY KEY (council_member_id),
    UNIQUE KEY uq_council_user (council_id, user_id),
    CONSTRAINT fk_member_council FOREIGN KEY (council_id)
        REFERENCES councils(council_id) ON DELETE CASCADE,
    CONSTRAINT fk_member_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE
);

-- 7. MINUTES
CREATE TABLE minutes (
    minute_id            BIGINT AUTO_INCREMENT,
    average_score        DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    synthesized_comments TEXT         NOT NULL,
    final_decision       VARCHAR(50)  NOT NULL,
    legal_confirmation   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    council_id           BIGINT       NOT NULL,
    PRIMARY KEY (minute_id),
    UNIQUE KEY uq_minute_council (council_id),
    CONSTRAINT fk_minute_council FOREIGN KEY (council_id)
        REFERENCES councils(council_id) ON DELETE CASCADE
);

-- 8. EVALUATIONS
CREATE TABLE evaluations (
    evaluation_id        BIGINT AUTO_INCREMENT,
    score_urgency        DECIMAL(5,2) NOT NULL,
    score_content        DECIMAL(5,2) NOT NULL,
    score_objectives     DECIMAL(5,2) NOT NULL,
    score_methodology    DECIMAL(5,2) NOT NULL,
    score_feasibility    DECIMAL(5,2) NOT NULL,
    score_capacity       DECIMAL(5,2) NOT NULL,
    score_products       DECIMAL(5,2) NOT NULL,
    total_score          DECIMAL(5,2) NOT NULL,
    general_comment      TEXT         NULL,
    recommended_decision VARCHAR(50)  NULL,
    submission_status    VARCHAR(50)  NOT NULL,
    council_member_id    BIGINT       NOT NULL,
    PRIMARY KEY (evaluation_id),
    CONSTRAINT fk_evaluation_member FOREIGN KEY (council_member_id)
        REFERENCES council_members(council_member_id) ON DELETE CASCADE
);

-- 9. AUDIT_LOGS
CREATE TABLE audit_logs (
    audit_log_id     BIGINT AUTO_INCREMENT,
    previous_status  VARCHAR(50) NULL,
    new_status       VARCHAR(50) NOT NULL,
    action_timestamp TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    feedback_message TEXT        NULL,
    topic_id         BIGINT      NOT NULL,
    actor_id         BIGINT      NOT NULL,
    PRIMARY KEY (audit_log_id),
    CONSTRAINT fk_audit_topic FOREIGN KEY (topic_id)
        REFERENCES topics(topic_id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id)
        REFERENCES users(user_id) ON DELETE RESTRICT
);
-- NOTE: The three trigger blocks (trg_evaluations_after_insert/update/delete)
-- from the production schema are intentionally omitted.
-- H2 does not support the MySQL-client DELIMITER // directive,
-- and these triggers handle denormalisation of average_score in minutes —
-- a concern outside the scope of the service-layer tests covered here.
