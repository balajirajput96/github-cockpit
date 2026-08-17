import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function regularUserContext(): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "regular-user",
      name: "Regular User",
      email: "regular@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("cockpit evidence schedule registration", () => {
  it("requires an admin user before attempting to create an independent schedule", async () => {
    const caller = appRouter.createCaller(regularUserContext());
    await expect(caller.cockpit.registerDailyEvidenceSchedule()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
