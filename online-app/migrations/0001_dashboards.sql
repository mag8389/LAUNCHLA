CREATE TABLE dashboards (
 owner_id TEXT NOT NULL,
 workspace TEXT NOT NULL,
 revision INTEGER NOT NULL,
 state TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (owner_id, workspace)
);
