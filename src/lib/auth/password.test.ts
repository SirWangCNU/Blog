// @vitest-environment node

import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password hashing", () => {
  it("uses unique salts and verifies without storing plaintext", async () => {
    const first = await hashPassword("correct horse battery staple");
    const second = await hashPassword("correct horse battery staple");

    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toContain("correct horse");
    await expect(verifyPassword("correct horse battery staple", first.hash, first.salt)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", first.hash, first.salt)).resolves.toBe(false);
  });
});
