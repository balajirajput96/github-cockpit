import type { Request, Response } from "express";
import { collectAndRecordWorkflowSignals, recordWorkflowMonitorCallback } from "./db";
import { sdk } from "./_core/sdk";

export async function recordWorkflowMonitor(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    const evidence = await recordWorkflowMonitorCallback(user.taskUid);
    if (!evidence) return res.json({ ok: true, skipped: "orphan" });
    const collection = await collectAndRecordWorkflowSignals();
    return res.json({ ok: true, signalsRecorded: collection.recorded, recordedAt: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "workflow monitor callback failed",
      timestamp: new Date().toISOString(),
    });
  }
}
