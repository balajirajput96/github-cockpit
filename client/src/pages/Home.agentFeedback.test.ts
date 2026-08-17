import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("agent operation feedback", () => {
  it("renders visible inline errors for both protected agent actions", () => {
    expect(homeSource).toContain("Planner error");
    expect(homeSource).toContain("Image generation error");
    expect(homeSource.match(/role="alert"/g)).toHaveLength(2);
  });

  it("handles planner and image mutation failures without unhandled promises", () => {
    expect(homeSource).not.toContain("void planner.mutateAsync");
    expect(homeSource).not.toContain("void imageMaker.mutateAsync");
    expect(homeSource).toContain("await planner.mutateAsync");
    expect(homeSource).toContain("await imageMaker.mutateAsync");
    expect(homeSource.match(/type="button"/g)?.length).toBeGreaterThanOrEqual(4);
  });

  it("renders successful protected planner content including review guardrails", () => {
    expect(homeSource).toContain("planner.data.title");
    expect(homeSource).toContain("planner.data.summary");
    expect(homeSource).toContain("planner.data.steps.map");
    expect(homeSource).toContain("planner.data.guardrails.map");
    expect(homeSource).toContain("agent-plan-result");
  });

  it("communicates bounded image lifecycle states and a safe retry path", () => {
    expect(homeSource).toContain("const imageLifecycle");
    expect(homeSource).toContain("getImageLifecycle");
    expect(homeSource).toContain("imageLifecycle.actionLabel");
    expect(homeSource).toContain("media-request-status");
    expect(homeSource).toContain('role="status"');
  });
});
