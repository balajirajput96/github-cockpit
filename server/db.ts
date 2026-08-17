import { drizzle } from "drizzle-orm/mysql2";
import { desc, eq } from "drizzle-orm";
import { cockpitEvidence, cockpitReviewRecords, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export const DAILY_EVIDENCE_KEY = "daily-github-jules-evidence";
export const PR46_REVIEW_KEY = "github-mcp-server-pr-46";

export async function getDailyEvidence() {
  const db = await getDb();
  if (!db) return null;
  const [record] = await db.select().from(cockpitEvidence)
    .where(eq(cockpitEvidence.evidenceKey, DAILY_EVIDENCE_KEY)).limit(1);
  return record ?? null;
}

export async function createDailyEvidenceScheduleRecord(taskUid: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable for evidence schedule registration");
  await db.insert(cockpitEvidence).values({
    evidenceKey: DAILY_EVIDENCE_KEY,
    scheduleCronTaskUid: taskUid,
    status: "scheduled",
    source: "project-heartbeat",
  }).onDuplicateKeyUpdate({
    set: { scheduleCronTaskUid: taskUid, status: "scheduled", source: "project-heartbeat" },
  });
  return getDailyEvidence();
}

export async function recordDailyEvidenceCallback(taskUid: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable for evidence callback");
  const [record] = await db.select().from(cockpitEvidence)
    .where(eq(cockpitEvidence.scheduleCronTaskUid, taskUid)).limit(1);
  if (!record) return null;
  await db.update(cockpitEvidence).set({ status: "recorded", lastRecordedAt: new Date() })
    .where(eq(cockpitEvidence.id, record.id));
  return getDailyEvidence();
}

export async function getLatestPr46Review() {
  const db = await getDb();
  if (!db) return null;
  const [record] = await db.select().from(cockpitReviewRecords)
    .where(eq(cockpitReviewRecords.reviewKey, PR46_REVIEW_KEY))
    .orderBy(desc(cockpitReviewRecords.createdAt)).limit(1);
  return record ?? null;
}

export async function createPr46Review(ownerOpenId: string, decision: string, note: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable for owner review recording");
  await db.insert(cockpitReviewRecords).values({
    reviewKey: PR46_REVIEW_KEY,
    decision,
    note,
    ownerOpenId,
  });
  return getLatestPr46Review();
}

// TODO: add feature queries here as your schema grows.
