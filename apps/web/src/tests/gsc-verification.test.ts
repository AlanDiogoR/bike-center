import { describe, expect, it } from "vitest";
import { metadata } from "@/app/layout";

describe("Google Search Console", () => {
  it("expõe metadata.verification.google com o token da tag", () => {
    expect(metadata.verification?.google).toBe(
      "0aBLdNiqLXMh5L-7dHjGAvO64lSPhQgBBNo9G_o7zuw",
    );
  });
});
