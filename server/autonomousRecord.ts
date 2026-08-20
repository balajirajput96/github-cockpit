import fs from "fs";
import path from "path";

export interface AutonomousRunRecord {
  timestamp: string;
  repository: string;
  task: string;
  toolUsed: string;
  actionPerformed: string;
  result: "success" | "failure" | "skipped";
  failureCategory?: string;
  recoveryAttempt?: string;
  validationStatus: "passed" | "failed" | "skipped";
  remainingBlocker?: string;
}

const RECORD_PATH = path.join(process.cwd(), ".manus-logs", "autonomous-execution-records.jsonl");

export function recordAutonomousRun(record: AutonomousRunRecord): void {
  try {
    const dir = path.dirname(RECORD_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const line = JSON.stringify({ ...record, loggedAt: new Date().toISOString() }) + "\n";
    fs.appendFileSync(RECORD_PATH, line, "utf-8");
  } catch (err) {
    console.error("Failed to write autonomous execution record:", err);
  }
}

export function getRecentAutonomousRecords(limit = 50): AutonomousRunRecord[] {
  try {
    if (!fs.existsSync(RECORD_PATH)) return [];
    const content = fs.readFileSync(RECORD_PATH, "utf-8");
    const lines = content.trim().split("\n").filter(Boolean);
    return lines.slice(-limit).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}
