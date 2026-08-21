import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const panelSource = readFileSync(new URL("./AutomationStatusPanel.tsx", import.meta.url), "utf8");

describe("automation execution record rendering", () => {
  it("uses fields provided by the hourly continuation query", () => {
    expect(panelSource).toContain("rec.cycleNumber");
    expect(panelSource).toContain("rec.actionDescription");
    expect(panelSource).not.toContain("{rec.task}");
    expect(panelSource).not.toContain("{rec.actionPerformed}");
  });
});
