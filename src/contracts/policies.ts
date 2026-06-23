export const QUOTE_MAX_LENGTH = 120;
export const REFLECTION_MAX_LENGTH = 150;
export const BOOK_TITLE_MAX_LENGTH = 80;
export const AUTHOR_MAX_LENGTH = 50;

export const SUPPORTED_CARD_RATIOS = ["1:1", "4:5", "9:16"] as const;
export type CardRatio = (typeof SUPPORTED_CARD_RATIOS)[number];

export const DEFAULT_VISIBILITY = "private";
export type Visibility = typeof DEFAULT_VISIBILITY;

export const READING_MOMENT_POLICY = {
  quoteMaxLength: QUOTE_MAX_LENGTH,
  reflectionMaxLength: REFLECTION_MAX_LENGTH,
  bookTitleMaxLength: BOOK_TITLE_MAX_LENGTH,
  authorMaxLength: AUTHOR_MAX_LENGTH,
  supportedRatios: SUPPORTED_CARD_RATIOS,
  defaultVisibility: DEFAULT_VISIBILITY
} as const;
