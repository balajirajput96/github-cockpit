import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, expect, it } from "vitest";
import { loadContinuationState, advanceContinuationCycle } from "./autonomousContinuation";

const statePath = `${process.cwd()}/.manus-logs/autonomous-continuation-state.json`;
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

describe("Autonomous Continuation State", () => {
  it("loads default state and advances cycle correctly", () => {
    const state = snapshot(statePath);
    const records = snapshot(recordsPath);

    try {
      const initial = loadContinuationState();
      expect(initial.currentCycle).toBeGreaterThanOrEqual(1);
      expect(initial.maxCycles).toBe(2400);

      const advanced = advanceContinuationCycle("Test cycle execution");
      expect(advanced.currentCycle).toBeGreaterThan(0);
      expect(advanced.lastAction).toBe("Test cycle execution");
    } finally {
      restore(statePath, state);
      restore(recordsPath, records);
    }
  });
});
