import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn — className combiner", () => {
  it("merges plain class strings", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("deduplicates conflicting tailwind classes (last wins)", () => {
    // tailwind-merge: px-2 then px-4 → px-4
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values (undefined, null, false)", () => {
    expect(cn("base", undefined, null, false && "x", "tail")).toBe("base tail");
  });

  it("handles conditional objects and arrays", () => {
    expect(cn({ hidden: false, visible: true }, ["a", "b"])).toBe("visible a b");
  });

  it("returns an empty string for no input", () => {
    expect(cn()).toBe("");
  });
});
