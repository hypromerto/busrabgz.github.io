SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE approves ADD CONSTRAINT fk_editor_id FOREIGN KEY (editor_id) REFERENCES person(person_id)
ON UPDATE CASCADE ON DELETE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;