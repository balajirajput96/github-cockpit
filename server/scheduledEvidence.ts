import type { Request, Response } from "express";
import { recordDailyEvidenceCallback } from "./db";
import { sdk } from "./_core/sdk";

export async function recordDailyEvidence(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }
    const record = await recordDailyEvidenceCallback(user.taskUid);
    if (!record) return res.json({ ok: true, skipped: "orphan" });
    return res.json({ ok: true, status: record.status, recordedAt: record.lastRecordedAt });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "scheduled evidence callback failed",
      timestamp: new Date().toISOString(),
    });
  }
}
