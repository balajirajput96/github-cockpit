import { describe, it, expect } from "vitest";
import { loadContinuationState, advanceContinuationCycle } from "./autonomousContinuation";

describe("Autonomous Continuation State", () => {
  it("loads default state and advances cycle correctly", () => {
    const initial = loadContinuationState();
    expect(initial.currentCycle).toBeGreaterThanOrEqual(1);
    expect(initial.maxCycles).toBe(2400);

    const advanced = advanceContinuationCycle("Test cycle execution");
    expect(advanced.currentCycle).toBeGreaterThan(0);
    expect(advanced.lastAction).toBe("Test cycle execution");
  });
});
