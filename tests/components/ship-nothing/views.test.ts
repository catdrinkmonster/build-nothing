import { describe, expect, it } from "vitest";

import { getDisplayedCardShellStyle } from "../../../components/ship-nothing/shell-style";

describe("getDisplayedCardShellStyle", () => {
  it("does not leak a middle-card gradient shell into the final card", () => {
    expect(
      getDisplayedCardShellStyle("ugly-gradients", undefined, true),
    ).toBeUndefined();
  });

  it("keeps the gradient shell while the active middle gradient card is showing", () => {
    expect(
      getDisplayedCardShellStyle("ugly-gradients", undefined, false),
    ).toBeDefined();
  });
});
