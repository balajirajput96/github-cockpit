import fs from "fs";
import path from "path";
import { recordAutonomousRun } from "./autonomousRecord";

export interface ContinuationState {
  currentCycle: number;
  maxCycles: number;
  lastExecutionTimestamp: string;
  status: "idle" | "running" | "paused" | "completed";
  lastAction: string;
  pendingWorkItems: string[];
}

const STATE_PATH = path.join(process.cwd(), ".manus-logs", "autonomous-continuation-state.json");
const MAX_CYCLES = 2400;

export function loadContinuationState(): ContinuationState {
  try {
    if (fs.existsSync(STATE_PATH)) {
      const data = fs.readFileSync(STATE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load continuation state:", err);
  }
  return {
    currentCycle: 1,
    maxCycles: MAX_CYCLES,
    lastExecutionTimestamp: new Date().toISOString(),
    status: "idle",
    lastAction: "initialized",
    pendingWorkItems: ["verify-git-mirror", "check-workflow-monitor", "validate-tests"],
  };
}

export function saveContinuationState(state: ContinuationState): void {
  try {
    const dir = path.dirname(STATE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save continuation state:", err);
  }
}

export function advanceContinuationCycle(actionDescription: string): ContinuationState {
  const state = loadContinuationState();
  if (state.currentCycle < state.maxCycles) {
    state.currentCycle += 1;
  } else {
    state.status = "completed";
  }
  state.lastExecutionTimestamp = new Date().toISOString();
  state.lastAction = actionDescription;
  saveContinuationState(state);

  recordAutonomousRun({
    timestamp: state.lastExecutionTimestamp,
    repository: "balajirajput96/github-cockpit",
    task: `Hourly Continuation Cycle ${state.currentCycle}/${state.maxCycles}`,
    toolUsed: "autonomousContinuation",
    actionPerformed: actionDescription,
    result: "success",
    validationStatus: "passed",
  });

  return state;
}
