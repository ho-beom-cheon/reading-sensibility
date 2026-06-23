import {
  activeCardTemplates,
  QUOTE_MAX_LENGTH,
  type CardRatio,
  type CardTemplate,
  type TemplateEmphasis,
  type TextLengthBucket
} from "@/contracts";

export type TemplateTextLengthBucket = TextLengthBucket | "blocked";

export type TemplateRecommendationInput = {
  selectedQuote: string;
  ratio: CardRatio;
  moods: string[];
  genre: string;
  emphasis: TemplateEmphasis;
  recentTemplateIds?: string[];
  limit?: number;
};

export type TemplateRecommendationScoreBreakdown = {
  moodMatch: number;
  genreMatch: number;
  textLengthFit: number;
  ratioSupport: number;
  emphasisMatch: number;
  total: number;
};

export type TemplateRecommendationCandidate = {
  template: CardTemplate;
  score: number;
  scoreBreakdown: TemplateRecommendationScoreBreakdown;
  textLength: TextLengthBucket;
  reasons: string[];
};

const DEFAULT_RECOMMENDATION_LIMIT = 3;

export function getTextLengthBucket(text: string): TemplateTextLengthBucket {
  const length = [...text].length;

  if (length <= 40) {
    return "short";
  }

  if (length <= 90) {
    return "medium";
  }

  if (length <= QUOTE_MAX_LENGTH) {
    return "long";
  }

  return "blocked";
}

export function recommendTemplates(
  input: TemplateRecommendationInput,
  templates: CardTemplate[] = activeCardTemplates
): TemplateRecommendationCandidate[] {
  const textLength = getTextLengthBucket(input.selectedQuote);

  if (textLength === "blocked") {
    return [];
  }

  const recentTemplateIds = new Set(input.recentTemplateIds ?? []);

  return templates
    .filter(
      (template) =>
        template.status === "active" && template.ratios.includes(input.ratio)
    )
    .map((template, index) => ({
      candidate: createRecommendationCandidate(input, template, textLength),
      index
    }))
    .sort((left, right) => {
      const scoreDelta = right.candidate.score - left.candidate.score;

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      const recentDelta =
        Number(recentTemplateIds.has(left.candidate.template.id)) -
        Number(recentTemplateIds.has(right.candidate.template.id));

      return recentDelta || left.index - right.index;
    })
    .slice(0, input.limit ?? DEFAULT_RECOMMENDATION_LIMIT)
    .map(({ candidate }) => candidate);
}

export function calculateTemplateRecommendationScore(
  input: TemplateRecommendationInput,
  template: CardTemplate,
  textLength: TextLengthBucket
): TemplateRecommendationScoreBreakdown {
  const moodMatch = matchRatio(input.moods, template.moods);
  const genreMatch = template.genres.includes(input.genre) ? 1 : 0;
  const textLengthFit = template.textLength.includes(textLength) ? 1 : 0;
  const ratioSupport = template.ratios.includes(input.ratio) ? 1 : 0;
  const emphasisMatch = template.emphasis.includes(input.emphasis) ? 1 : 0;
  const total =
    moodMatch * 40 +
    genreMatch * 15 +
    textLengthFit * 20 +
    ratioSupport * 15 +
    emphasisMatch * 10;

  return {
    moodMatch,
    genreMatch,
    textLengthFit,
    ratioSupport,
    emphasisMatch,
    total: roundScore(total)
  };
}

function createRecommendationCandidate(
  input: TemplateRecommendationInput,
  template: CardTemplate,
  textLength: TextLengthBucket
): TemplateRecommendationCandidate {
  const scoreBreakdown = calculateTemplateRecommendationScore(
    input,
    template,
    textLength
  );

  return {
    template,
    score: scoreBreakdown.total,
    scoreBreakdown,
    textLength,
    reasons: createRecommendationReasons(input, template, textLength)
  };
}

function createRecommendationReasons(
  input: TemplateRecommendationInput,
  template: CardTemplate,
  textLength: TextLengthBucket
) {
  const moodMatches = findMatches(input.moods, template.moods);
  const reasons: string[] = [];

  if (moodMatches.length > 0) {
    reasons.push(`분위기 ${moodMatches.join(", ")} 일치`);
  }

  if (template.genres.includes(input.genre)) {
    reasons.push(`장르 ${input.genre} 일치`);
  }

  if (template.textLength.includes(textLength)) {
    reasons.push(`문장 길이 ${textLength} 적합`);
  }

  if (template.emphasis.includes(input.emphasis)) {
    reasons.push(`강조 ${input.emphasis} 적합`);
  }

  return reasons.length > 0 ? reasons : ["선택 조건과 일부 항목 일치"];
}

function matchRatio(expected: string[], actual: string[]) {
  if (expected.length === 0) {
    return 0;
  }

  return findMatches(expected, actual).length / expected.length;
}

function findMatches(expected: string[], actual: string[]) {
  const actualValues = new Set(actual);

  return expected.filter((value) => actualValues.has(value));
}

function roundScore(value: number) {
  return Number(value.toFixed(2));
}
