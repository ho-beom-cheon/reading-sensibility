import { describe, expect, it } from "vitest";
import { QUOTE_MAX_LENGTH, activeCardTemplates } from "@/contracts";
import {
  MockTemplateRecommendationProvider,
  getTextLengthBucket,
  recommendTemplates
} from ".";

describe("getTextLengthBucket", () => {
  it("buckets quote lengths by unicode characters", () => {
    expect(getTextLengthBucket("가".repeat(40))).toBe("short");
    expect(getTextLengthBucket("🙂".repeat(41))).toBe("medium");
    expect(getTextLengthBucket("나".repeat(91))).toBe("long");
    expect(getTextLengthBucket("다".repeat(QUOTE_MAX_LENGTH + 1))).toBe(
      "blocked"
    );
  });
});

describe("recommendTemplates", () => {
  it("ranks templates with the design scoring formula", () => {
    const recommendations = recommendTemplates({
      selectedQuote:
        "비 오는 날 창가에 남겨 둔 문장을 다시 읽으며 오래된 장면을 천천히 떠올렸다.",
      ratio: "4:5",
      moods: ["회상", "쓸쓸함"],
      genre: "소설",
      emphasis: "reflection"
    });

    expect(recommendations[0]).toEqual(
      expect.objectContaining({
        score: 100,
        template: expect.objectContaining({ id: "rainy_window_01" })
      })
    );
  });

  it("blocks recommendations when the quote exceeds the policy limit", () => {
    const recommendations = recommendTemplates({
      selectedQuote: "가".repeat(QUOTE_MAX_LENGTH + 1),
      ratio: "1:1",
      moods: ["차분함"],
      genre: "문학",
      emphasis: "quote"
    });

    expect(recommendations).toEqual([]);
  });

  it("excludes templates that do not support the selected ratio", () => {
    const recommendations = recommendTemplates({
      selectedQuote: "짧은 문장을 잠금화면에 남긴다.",
      ratio: "9:16",
      moods: ["기록성", "아카이브"],
      genre: "에세이",
      emphasis: "source",
      limit: activeCardTemplates.length
    });

    expect(recommendations.map((candidate) => candidate.template.id)).not.toContain(
      "library_card_01"
    );
  });

  it("prefers less recently used templates on equal scores", () => {
    const equalScoreTemplates = activeCardTemplates.filter((template) =>
      ["quiet_margin_01", "night_desk_01"].includes(template.id)
    );
    const [first, second] = recommendTemplates({
      selectedQuote: "짧은 문장",
      ratio: "1:1",
      moods: [],
      genre: "없는장르",
      emphasis: "reflection",
      recentTemplateIds: ["quiet_margin_01"],
      limit: 2
    }, equalScoreTemplates);

    expect(first?.template.id).toBe("night_desk_01");
    expect(second?.template.id).toBe("quiet_margin_01");
  });
});

describe("MockTemplateRecommendationProvider", () => {
  it("returns fallback recommendations without calling an external AI", async () => {
    const provider = new MockTemplateRecommendationProvider();
    const result = await provider.recommend({
      selectedQuote: "조용히 멈춘 문장이 오늘을 바꾼다.",
      reflection: "차분하게 남기고 싶은 기록이다.",
      bookTitle: "작은 독서의 기록",
      author: "문장수집가",
      ratio: "1:1",
      forceFallback: true
    });

    expect(result).toEqual(
      expect.objectContaining({
        mode: "fallback",
        fallbackUsed: true,
        textLength: "short"
      })
    );
    expect(result.classification.moods).toEqual(["차분함"]);
    expect(result.candidates[0]?.template.id).toBe("quiet_margin_01");
  });
});
