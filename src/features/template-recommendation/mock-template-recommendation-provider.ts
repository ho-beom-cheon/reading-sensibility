import { activeCardTemplates, type CardTemplate } from "@/contracts";
import {
  getTextLengthBucket,
  recommendTemplates
} from "./recommend-templates";
import type {
  TemplateRecommendationClassification,
  TemplateRecommendationProvider,
  TemplateRecommendationProviderInput,
  TemplateRecommendationResult
} from "./template-recommendation-provider";

export const FALLBACK_TEMPLATE_CLASSIFICATION: TemplateRecommendationClassification = {
  moods: ["차분함"],
  genre: "문학",
  emphasis: "quote",
  confidence: 0.4
};

type MockTemplateRecommendationProviderOptions = {
  templates?: CardTemplate[];
  limit?: number;
};

export class MockTemplateRecommendationProvider
  implements TemplateRecommendationProvider
{
  private readonly templates: CardTemplate[];
  private readonly limit: number;

  constructor(options: MockTemplateRecommendationProviderOptions = {}) {
    this.templates = options.templates ?? activeCardTemplates;
    this.limit = options.limit ?? 3;
  }

  async recommend(
    input: TemplateRecommendationProviderInput
  ): Promise<TemplateRecommendationResult> {
    const classification = input.forceFallback
      ? createFallbackClassification(input)
      : createMockClassification(input);
    const textLength = getTextLengthBucket(input.selectedQuote);
    const candidates = recommendTemplates(
      {
        selectedQuote: input.selectedQuote,
        ratio: input.ratio,
        moods: classification.moods,
        genre: classification.genre,
        emphasis: classification.emphasis,
        recentTemplateIds: input.recentTemplateIds,
        limit: input.limit ?? this.limit
      },
      this.templates
    );

    return {
      mode: input.forceFallback ? "fallback" : "mock_ai",
      fallbackUsed: Boolean(input.forceFallback),
      textLength,
      classification,
      candidates
    };
  }
}

export const mockTemplateRecommendationProvider =
  new MockTemplateRecommendationProvider();

function createFallbackClassification(
  input: TemplateRecommendationProviderInput
): TemplateRecommendationClassification {
  return {
    ...FALLBACK_TEMPLATE_CLASSIFICATION,
    genre: input.genre ?? FALLBACK_TEMPLATE_CLASSIFICATION.genre,
    emphasis: input.emphasis ?? FALLBACK_TEMPLATE_CLASSIFICATION.emphasis
  };
}

function createMockClassification(
  input: TemplateRecommendationProviderInput
): TemplateRecommendationClassification {
  const text = `${input.selectedQuote} ${input.reflection} ${input.bookTitle}`;
  const preferredMood = input.preferredMood ? [input.preferredMood] : [];

  if (/비|창가|흐림|회상|쓸쓸/.test(text)) {
    return createClassification({
      moods: [...preferredMood, "회상", "쓸쓸함"],
      genre: input.genre ?? "소설",
      emphasis: input.emphasis ?? "reflection",
      confidence: 0.78
    });
  }

  if (/밤|고독|몰입|철학|어둠/.test(text)) {
    return createClassification({
      moods: [...preferredMood, "고독", "몰입"],
      genre: input.genre ?? "철학",
      emphasis: input.emphasis ?? "quote",
      confidence: 0.74
    });
  }

  if (/기록|도서관|쪽|페이지|archive|p\./i.test(text)) {
    return createClassification({
      moods: [...preferredMood, "기록성", "아카이브"],
      genre: input.genre ?? "에세이",
      emphasis: input.emphasis ?? "source",
      confidence: 0.72
    });
  }

  return createClassification({
    moods: [...preferredMood, "차분함", "위로", "사색"],
    genre: input.genre ?? "문학",
    emphasis: input.emphasis ?? "quote",
    confidence: 0.68
  });
}

function createClassification(
  classification: TemplateRecommendationClassification
): TemplateRecommendationClassification {
  return {
    ...classification,
    moods: [...new Set(classification.moods)]
  };
}
