import { describe, expect, it } from "vitest";
import { appendImageRequestEvent } from "./imageRequestHistory";

describe("appendImageRequestEvent", () => {
  it("keeps only the four newest non-sensitive lifecycle events", () => {
    const events = ["one", "two", "three", "four", "five"].reduce(
      (history, id) => appendImageRequestEvent(history, { at: "13:30", id, label: `Image ${id}`, tone: "ready" }),
      [] as ReturnType<typeof appendImageRequestEvent>,
    );

    expect(events).toHaveLength(4);
    expect(events.map((event) => event.id)).toEqual(["five", "four", "three", "two"]);
    expect(events.every((event) => "label" in event && "at" in event && "tone" in event)).toBe(true);
    expect(events.some((event) => "prompt" in event || "url" in event)).toBe(false);
  });

  it("records bounded request outcomes for retry and success without retaining prompt or URL data", () => {
    const pending = appendImageRequestEvent([], {
      at: "13:31",
      id: "attempt-1",
      label: "Request sent to the protected image provider",
      tone: "pending",
    });
    const retryableError = appendImageRequestEvent(pending, {
      at: "13:32",
      id: "attempt-1-error",
      label: "Request did not complete; retry is available",
      tone: "error",
    });

    expect(retryableError.map((event) => [event.tone, event.label])).toEqual([
      ["error", "Request did not complete; retry is available"],
      ["pending", "Request sent to the protected image provider"],
    ]);

    const completedAttempt = appendImageRequestEvent(retryableError, {
      at: "13:33",
      id: "attempt-2-ready",
      label: "Image stored and ready to open",
      tone: "ready",
    });

    expect(completedAttempt[0]).toMatchObject({ tone: "ready", label: "Image stored and ready to open" });
    expect(JSON.stringify(completedAttempt)).not.toContain("prompt");
    expect(JSON.stringify(completedAttempt)).not.toContain("https://");
  });
});
