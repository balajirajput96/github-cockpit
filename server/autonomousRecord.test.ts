import { describe, it, expect } from "vitest";
import { recordAutonomousRun, getRecentAutonomousRecords } from "./autonomousRecord";

describe("Autonomous Execution Record", () => {
  it("records and retrieves autonomous run entries", () => {
    recordAutonomousRun({
      timestamp: new Date().toISOString(),
      repository: "balajirajput96/github-cockpit",
      task: "Mission Audit",
      toolUsed: "shell",
      actionPerformed: "audit environment",
      result: "success",
      validationStatus: "passed",
    });

    const records = getRecentAutonomousRecords(10);
    expect(records.length).toBeGreaterThan(0);
    const latest = records[records.length - 1];
    expect(latest.task).toBe("Mission Audit");
    expect(latest.result).toBe("success");
  });
});
