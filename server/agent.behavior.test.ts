import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn(),
}));

import { generateImage } from "./_core/imageGeneration";
import { invokeLLM } from "./_core/llm";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const authenticatedCaller = () => appRouter.createCaller({
  user: {
    id: 1,
    openId: "test-user",
    name: "Test User",
    email: "test@example.com",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("hybrid agent protected behavior", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a bounded structured plan from the server-side planner", async () => {
    vi.mocked(invokeLLM).mockResolvedValue({
      id: "plan-test",
      created: 0,
      model: "gpt-5-mini",
      choices: [{
        index: 0,
        finish_reason: "stop",
        message: {
          role: "assistant",
          content: JSON.stringify({
            title: "Review open pull requests",
            summary: "Inspect current pull requests and prepare a reviewable recommendation for each.",
            steps: [
              { title: "Inspect evidence", detail: "Read pull request scope, checks, and current review state.", mode: "inspect" },
              { title: "Draft next action", detail: "Prepare a concise review comment or PR-based change proposal.", mode: "draft" },
            ],
            guardrails: ["Do not merge automatically.", "Keep repository changes reviewable in a pull request."],
          }),
        },
      }],
    });

    const result = await authenticatedCaller().agent.plan({
      intent: "repository",
      prompt: "Review the currently open pull requests and prepare the smallest safe next action.",
    });

    expect(result.title).toBe("Review open pull requests");
    expect(result.steps).toHaveLength(2);
    expect(invokeLLM).toHaveBeenCalledWith(expect.objectContaining({
      model: "gpt-5-mini",
      outputSchema: expect.objectContaining({ name: "hybrid_agent_plan", strict: true }),
    }));
  });

  it("returns a review-safe fallback when the provider supplies empty structured output", async () => {
    vi.mocked(invokeLLM).mockResolvedValue({
      id: "empty-plan-test",
      created: 0,
      model: "gpt-5-mini",
      choices: [{
        index: 0,
        finish_reason: "stop",
        message: { role: "assistant", content: "" },
      }],
    });

    const result = await authenticatedCaller().agent.plan({
      intent: "repository",
      prompt: "Review the currently open pull requests and prepare the smallest safe next action.",
    });

    expect(result.title).toBe("Review-safe fallback plan");
    expect(result.steps).toHaveLength(3);
    expect(result.guardrails).toContain("Do not merge, push, retry workflows, or modify repository settings automatically.");
  });

  it("returns a server-generated image URL without exposing a provider key", async () => {
    vi.mocked(generateImage).mockResolvedValue({ url: "https://example.test/generated/agent-image.png" });

    const result = await authenticatedCaller().agent.image({
      prompt: "An editorial illustration of a safe software automation desk.",
    });

    expect(result).toEqual({ url: "https://example.test/generated/agent-image.png" });
    expect(generateImage).toHaveBeenCalledWith(expect.objectContaining({
      prompt: expect.stringContaining("Do not include credentials"),
    }));
  });
});
