import { describe, it, expect } from "vitest";
import { classifyHook, classifyHooks, ALL_PATTERNS, PATTERN_LABELS } from "@/lib/hook-classifier";

describe("ALL_PATTERNS — hook taxonomy", () => {
  it("exposes exactly 8 hook patterns", () => {
    expect(ALL_PATTERNS).toHaveLength(8);
  });

  it("contains every documented pattern", () => {
    expect(ALL_PATTERNS).toEqual(
      expect.arrayContaining([
        "contrarian_claim",
        "question",
        "story",
        "statistic",
        "tutorial",
        "listicle",
        "analogy",
        "personal",
      ])
    );
  });

  it("provides a human label for every pattern", () => {
    for (const pattern of ALL_PATTERNS) {
      expect(PATTERN_LABELS[pattern]).toEqual(expect.any(String));
      expect(PATTERN_LABELS[pattern].length).toBeGreaterThan(0);
    }
  });
});

describe("classifyHook — pattern detection", () => {
  it("classifies a contrarian claim", () => {
    const result = classifyHook("Everyone says AI agents are the future. They're wrong.");
    expect(result.pattern).toBe("contrarian_claim");
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.reasoning).toEqual(expect.any(String));
  });

  it("classifies a question hook", () => {
    const result = classifyHook("What if your code could think?");
    expect(result.pattern).toBe("question");
    expect(result.confidence).toBeGreaterThan(0);
  });

  it("classifies a listicle hook", () => {
    const result = classifyHook("5 things every dev should know about AI agents");
    expect(result.pattern).toBe("listicle");
  });

  it("classifies a statistic hook", () => {
    const result = classifyHook("78% of creators report burnout");
    expect(result.pattern).toBe("statistic");
  });

  it("returns an allScores entry for every pattern", () => {
    const result = classifyHook("some random hook text");
    for (const pattern of ALL_PATTERNS) {
      expect(result.allScores[pattern]).toEqual(expect.any(Number));
      expect(result.allScores[pattern]).toBeGreaterThanOrEqual(0);
      expect(result.allScores[pattern]).toBeLessThanOrEqual(1);
    }
  });

  it("keeps confidence within [0, 1]", () => {
    const samples = [
      "Everyone says X. Wrong.",
      "What if code could think?",
      "Last week I shipped 10x faster",
      "78% burnout",
      "Here's how I set up AI agents in 5 min",
      "5 things every dev should know",
      "AI agents are like interns",
      "I almost quit creating",
      "completely neutral text with no markers at all",
    ];
    for (const text of samples) {
      const { confidence } = classifyHook(text);
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(1);
    }
  });
});

describe("classifyHooks — batch", () => {
  it("classifies an array and preserves order", () => {
    const inputs = [
      "What if your code could think?",
      "5 things every dev should know about AI",
    ];
    const results = classifyHooks(inputs);
    expect(results).toHaveLength(inputs.length);
    expect(results[0].pattern).toBe("question");
    expect(results[1].pattern).toBe("listicle");
  });

  it("returns an empty array for empty input", () => {
    expect(classifyHooks([])).toEqual([]);
  });
});
