import { describe, expect, it } from "vitest";
import { getImageLifecycle } from "./imageLifecycle";

describe("getImageLifecycle", () => {
  it("returns the correct safe status and action label for each image request state", () => {
    expect(getImageLifecycle({ hasError: false, isPending: false })).toEqual({
      actionLabel: "Create image",
      label: "Ready for an on-demand image request. No browser credential is used.",
      tone: "is-idle",
    });

    expect(getImageLifecycle({ hasError: false, isPending: true })).toMatchObject({
      actionLabel: "Creating",
      label: expect.stringContaining("45-second safety limit"),
      tone: "is-pending",
    });

    expect(getImageLifecycle({ hasError: true, isPending: false })).toEqual({
      actionLabel: "Retry image",
      label: "Image request did not complete. You can safely retry with the same prompt.",
      tone: "is-error",
    });

    expect(getImageLifecycle({ hasError: false, imageUrl: "https://example.com/image.png", isPending: false })).toMatchObject({
      actionLabel: "Create image",
      label: expect.stringContaining("Image ready in protected storage"),
      tone: "is-ready",
    });
  });
});
