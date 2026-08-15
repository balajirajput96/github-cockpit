import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("cockpit access boundary", () => {
  it("rejects a portfolio request without an authenticated user", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    await expect(caller.cockpit.portfolio()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
