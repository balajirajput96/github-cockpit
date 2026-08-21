import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, expect, it } from "vitest";
import { recordAutonomousRun, getRecentAutonomousRecords } from "./autonomousRecord";

const recordsPath = `${process.cwd()}/.manus-logs/autonomous-execution-records.jsonl`;

type FileSnapshot = { exists: boolean; contents?: string };

function snapshot(path: string): FileSnapshot {
  return existsSync(path) ? { exists: true, contents: readFileSync(path, "utf8") } : { exists: false };
}

function restore(path: string, file: FileSnapshot) {
  if (file.exists) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, file.contents ?? "", "utf8");
  } else if (existsSync(path)) {
    unlinkSync(path);
  }
}

describe("Autonomous Execution Record", () => {
  it("records and retrieves autonomous run entries", () => {
    const records = snapshot(recordsPath);

    try {
      recordAutonomousRun({
        timestamp: new Date().toISOString(),
        repository: "balajirajput96/github-cockpit",
        task: "Mission Audit",
        toolUsed: "shell",
        actionPerformed: "audit environment",
        result: "success",
        validationStatus: "passed",
      });

      const entries = getRecentAutonomousRecords(10);
      expect(entries.length).toBeGreaterThan(0);
      const latest = entries[entries.length - 1];
      expect(latest.task).toBe("Mission Audit");
      expect(latest.result).toBe("success");
    } finally {
      restore(recordsPath, records);
    }
  });
});
