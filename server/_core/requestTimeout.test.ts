import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWithTimeout } from "./requestTimeout";

describe("fetchWithTimeout", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("aborts a provider request and returns an actionable timeout error", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_url: string, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    })));

    const request = expect(fetchWithTimeout("https://provider.invalid", { method: "POST" }, 25))
      .rejects.toThrow("Provider request timed out after 25ms");
    await vi.advanceTimersByTimeAsync(25);

    await request;
  });
});
