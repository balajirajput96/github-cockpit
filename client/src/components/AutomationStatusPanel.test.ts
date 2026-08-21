import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const panelSource = readFileSync(new URL("./AutomationStatusPanel.tsx", import.meta.url), "utf8");

describe("automation execution record rendering", () => {
  it("uses fields provided by AutonomousRunRecord", () => {
    expect(panelSource).toContain("{rec.task}");
    expect(panelSource).toContain("{rec.actionPerformed}");
    expect(panelSource).not.toContain("rec.cycleNumber");
    expect(panelSource).not.toContain("rec.actionDescription");
  });
});
