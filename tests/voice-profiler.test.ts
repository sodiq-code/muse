import { describe, it, expect } from "vitest";
import {
  JULES_VOICE_PROFILE,
  computeVoiceMatch,
  analyzeVoice,
  getVoiceDimensionColor,
  getVoiceDimensionBgColor,
  type VoiceProfile,
} from "@/lib/voice-profiler";

const IDENTICAL: VoiceProfile = { ...JULES_VOICE_PROFILE };

describe("JULES_VOICE_PROFILE — seed profile", () => {
  it("has all 7 dimensions populated", () => {
    const keys = Object.keys(JULES_VOICE_PROFILE) as (keyof VoiceProfile)[];
    expect(keys).toHaveLength(7);
    for (const k of keys) {
      expect(JULES_VOICE_PROFILE[k]).toEqual(expect.any(Number));
      expect(JULES_VOICE_PROFILE[k]).toBeGreaterThanOrEqual(0);
      expect(JULES_VOICE_PROFILE[k]).toBeLessThanOrEqual(100);
    }
  });

  it("matches the documented seed values", () => {
    expect(JULES_VOICE_PROFILE.directness).toBe(91);
    expect(JULES_VOICE_PROFILE.technicalDepth).toBe(88);
    expect(JULES_VOICE_PROFILE.humor).toBe(34);
    expect(JULES_VOICE_PROFILE.hype).toBe(8);
    expect(JULES_VOICE_PROFILE.storytelling).toBe(72);
  });
});

describe("computeVoiceMatch — scoring", () => {
  it("returns a perfect score for identical profiles", () => {
    const result = computeVoiceMatch(IDENTICAL, JULES_VOICE_PROFILE);
    expect(result.score).toBe(1);
    expect(result.mismatches).toHaveLength(0);
  });

  it("returns a score in [0, 1] for divergent profiles", () => {
    const divergent: VoiceProfile = {
      directness: 10,
      technicalDepth: 10,
      humor: 90,
      hype: 95,
      storytelling: 10,
      sentenceLength: 90,
      ctaIntensity: 95,
    };
    const result = computeVoiceMatch(divergent, JULES_VOICE_PROFILE);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
    expect(result.score).toBeLessThan(1);
  });

  it("flags dimensions that differ by more than 30 points", () => {
    const off: VoiceProfile = { ...JULES_VOICE_PROFILE, humor: 90, hype: 90 };
    const result = computeVoiceMatch(off, JULES_VOICE_PROFILE);
    expect(result.mismatches.length).toBeGreaterThan(0);
    expect(result.matchSummary).toContain("Mismatches");
  });

  it("produces a non-empty matchSummary", () => {
    const result = computeVoiceMatch(IDENTICAL, JULES_VOICE_PROFILE);
    expect(result.matchSummary.length).toBeGreaterThan(0);
  });
});

describe("analyzeVoice — text analysis", () => {
  it("returns a 7-dimension profile from text", () => {
    const result = analyzeVoice(
      "We built the agent last week. It ships fast. The latency dropped 40%. Here is how to set it up."
    );
    const keys = Object.keys(result.profile) as (keyof VoiceProfile)[];
    expect(keys).toHaveLength(7);
    expect(result.wordCount).toBeGreaterThan(0);
    expect(result.sentenceCount).toBeGreaterThanOrEqual(1);
  });

  it("clamps the sample text preview to 200 chars", () => {
    const long = "Sentence one. ".repeat(40);
    const result = analyzeVoice(long);
    expect(result.sampleText.length).toBeLessThanOrEqual(203); // 200 + "..."
  });
});

describe("getVoiceDimensionColor / BgColor — thresholds", () => {
  it("colors high values (>=70) as emerald", () => {
    expect(getVoiceDimensionColor(75)).toBe("text-emerald-600");
    expect(getVoiceDimensionBgColor(91)).toBe("bg-emerald-500");
  });

  it("colors mid values (40-69) as amber", () => {
    expect(getVoiceDimensionColor(50)).toBe("text-amber-600");
    expect(getVoiceDimensionBgColor(40)).toBe("bg-amber-500");
  });

  it("colors low values (<40) as rose", () => {
    expect(getVoiceDimensionColor(8)).toBe("text-rose-500");
    expect(getVoiceDimensionBgColor(34)).toBe("bg-rose-400");
  });
});
