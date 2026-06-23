import type { CardRatio, TemplateEmphasis } from "@/contracts";
import type {
  TemplateRecommendationCandidate,
  TemplateTextLengthBucket
} from "./recommend-templates";

export type TemplateRecommendationMode = "mock_ai" | "fallback";

export type TemplateRecommendationProviderInput = {
  selectedQuote: string;
  reflection: string;
  bookTitle: string;
  author: string;
  ratio: CardRatio;
  genre?: string;
  preferredMood?: string;
  emphasis?: TemplateEmphasis;
  forceFallback?: boolean;
  recentTemplateIds?: string[];
  limit?: number;
};

export type TemplateRecommendationClassification = {
  moods: string[];
  genre: string;
  emphasis: TemplateEmphasis;
  confidence: number;
};

export type TemplateRecommendationResult = {
  mode: TemplateRecommendationMode;
  fallbackUsed: boolean;
  textLength: TemplateTextLengthBucket;
  classification: TemplateRecommendationClassification;
  candidates: TemplateRecommendationCandidate[];
};

export interface TemplateRecommendationProvider {
  recommend(
    input: TemplateRecommendationProviderInput
  ): Promise<TemplateRecommendationResult>;
}
