import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const cockpitEvidence = mysqlTable("cockpit_evidence", {
  id: int("id").autoincrement().primaryKey(),
  evidenceKey: varchar("evidence_key", { length: 96 }).notNull(),
  scheduleCronTaskUid: varchar("schedule_cron_task_uid", { length: 65 }),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  source: varchar("source", { length: 96 }).notNull(),
  lastRecordedAt: timestamp("last_recorded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  evidenceKeyUnique: uniqueIndex("cockpit_evidence_key_unique").on(table.evidenceKey),
  scheduleTaskIndex: index("cockpit_evidence_task_idx").on(table.scheduleCronTaskUid),
}));

export const cockpitReviewRecords = mysqlTable("cockpit_review_records", {
  id: int("id").autoincrement().primaryKey(),
  reviewKey: varchar("review_key", { length: 96 }).notNull(),
  decision: varchar("decision", { length: 48 }).notNull(),
  note: text("note").notNull(),
  ownerOpenId: varchar("owner_open_id", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  reviewKeyIndex: index("cockpit_review_key_idx").on(table.reviewKey),
}));

export const workflowSignalSnapshots = mysqlTable("workflow_signal_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  signalKey: varchar("signal_key", { length: 160 }).notNull(),
  repository: varchar("repository", { length: 128 }).notNull(),
  workflowName: varchar("workflow_name", { length: 160 }).notNull(),
  runId: varchar("run_id", { length: 32 }).notNull(),
  event: varchar("event", { length: 48 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  conclusion: varchar("conclusion", { length: 32 }),
  classification: varchar("classification", { length: 32 }).notNull(),
  runUrl: varchar("run_url", { length: 512 }).notNull(),
  observedAt: timestamp("observed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  signalKeyUnique: uniqueIndex("workflow_signal_key_unique").on(table.signalKey),
  observedAtIndex: index("workflow_signal_observed_idx").on(table.observedAt),
  classificationIndex: index("workflow_signal_classification_idx").on(table.classification),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
