import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const repoDetailSource = readFileSync(new URL("./RepoDetail.tsx", import.meta.url), "utf8");

describe("repository workflow snapshot guidance", () => {
  it("labels rerun help as guidance and preserves the non-write boundary", () => {
    expect(repoDetailSource).toContain("Rerun guidance");
    expect(repoDetailSource).toContain("can only be rerun from GitHub Actions after a reviewer confirms the branch");
    expect(repoDetailSource).toContain("This cockpit does not trigger workflow writes.");
    expect(repoDetailSource).not.toContain("Queued ${run.name}");
  });
});
