-- H2 test mirror of production topic-scoped evaluations/minutes (V5 semantics, no MySQL triggers).

ALTER TABLE evaluations ADD COLUMN topic_id BIGINT;
DELETE FROM evaluations;

ALTER TABLE evaluations ALTER COLUMN topic_id BIGINT NOT NULL;
ALTER TABLE evaluations ADD CONSTRAINT fk_evaluation_topic FOREIGN KEY (topic_id)
    REFERENCES topics (topic_id) ON DELETE CASCADE;
ALTER TABLE evaluations ADD CONSTRAINT idx_unique_eval_topic_member UNIQUE (topic_id, council_member_id);

ALTER TABLE minutes DROP CONSTRAINT fk_minute_council;
ALTER TABLE minutes DROP CONSTRAINT uq_minute_council;

ALTER TABLE minutes ADD COLUMN topic_id BIGINT;
DELETE FROM minutes;

ALTER TABLE minutes ALTER COLUMN topic_id BIGINT NOT NULL;
ALTER TABLE minutes ADD CONSTRAINT fk_minute_council FOREIGN KEY (council_id)
    REFERENCES councils (council_id) ON DELETE CASCADE;
ALTER TABLE minutes ADD CONSTRAINT fk_minute_topic FOREIGN KEY (topic_id)
    REFERENCES topics (topic_id) ON DELETE CASCADE;
ALTER TABLE minutes ADD CONSTRAINT uq_minute_topic UNIQUE (topic_id);
