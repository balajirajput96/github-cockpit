import type { Request, Response } from "express";
import { recordHourlyContinuationCallback } from "./db";
import { sdk } from "./_core/sdk";

export async function recordHourlyContinuation(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    const result = await recordHourlyContinuationCallback(user.taskUid);
    if (!result) return res.json({ ok: true, skipped: "orphan" });
    return res.json({ ok: true, ...result, recordedAt: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "hourly continuation callback failed",
      timestamp: new Date().toISOString(),
    });
  }
}
