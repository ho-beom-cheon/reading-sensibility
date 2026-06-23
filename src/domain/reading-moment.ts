import {
  DEFAULT_VISIBILITY,
  ErrorCode,
  QUOTE_MAX_LENGTH,
  REFLECTION_MAX_LENGTH,
  type Visibility
} from "@/contracts";
import {
  enforceMaxLength,
  invalid,
  ok,
  requireText,
  type ValidationIssue,
  type ValidationResult
} from "./validation";

export type ReadingMomentSourceType = "ocr" | "manual";

export type ReadingMoment = {
  id: string;
  userId?: string;
  bookId: string;
  selectedQuote: string;
  quoteLength: number;
  reflection: string;
  pageNumber?: string;
  readAt: string;
  placeLabel?: string;
  mood?: string;
  genre?: string;
  visibility: Visibility;
  sourceType: ReadingMomentSourceType;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type ReadingMomentDraftInput = {
  id: string;
  userId?: string;
  bookId: string;
  selectedQuote: string;
  reflection: string;
  pageNumber?: string;
  readAt: string;
  placeLabel?: string;
  mood?: string;
  genre?: string;
  sourceType: ReadingMomentSourceType;
  createdAt: string;
  updatedAt: string;
};

export function validateSelectedQuote(value: string): ValidationIssue[] {
  return [
    requireText(
      "selectedQuote",
      value,
      ErrorCode.QUOTE_REQUIRED,
      "저장할 문장을 선택해 주세요."
    ),
    enforceMaxLength(
      "selectedQuote",
      value,
      QUOTE_MAX_LENGTH,
      ErrorCode.QUOTE_TOO_LONG,
      `${QUOTE_MAX_LENGTH}자 이내로 줄여 주세요.`
    )
  ].filter((issue): issue is ValidationIssue => issue !== null);
}

export function validateReflection(value: string): ValidationIssue[] {
  return [
    requireText(
      "reflection",
      value,
      ErrorCode.REFLECTION_REQUIRED,
      "이 문장을 만난 감상을 적어 주세요."
    ),
    enforceMaxLength(
      "reflection",
      value,
      REFLECTION_MAX_LENGTH,
      ErrorCode.REQUIRED_FIELD_MISSING,
      `${REFLECTION_MAX_LENGTH}자 이내로 줄여 주세요.`
    )
  ].filter((issue): issue is ValidationIssue => issue !== null);
}

export function validateReadingMomentDraft(
  input: ReadingMomentDraftInput
): ValidationIssue[] {
  return [
    ...validateSelectedQuote(input.selectedQuote),
    ...validateReflection(input.reflection),
    ...requireRequiredFields(input)
  ];
}

export function createReadingMoment(
  input: ReadingMomentDraftInput
): ValidationResult<ReadingMoment> {
  const issues = validateReadingMomentDraft(input);

  if (issues.length > 0) {
    return invalid(issues);
  }

  return ok({
    ...input,
    selectedQuote: input.selectedQuote.trim(),
    reflection: input.reflection.trim(),
    quoteLength: input.selectedQuote.trim().length,
    visibility: DEFAULT_VISIBILITY
  });
}

function requireRequiredFields(input: ReadingMomentDraftInput): ValidationIssue[] {
  const fields = [
    ["id", input.id],
    ["bookId", input.bookId],
    ["readAt", input.readAt],
    ["createdAt", input.createdAt],
    ["updatedAt", input.updatedAt]
  ] as const;

  return fields.flatMap(([field, value]) => {
    const issue = requireText(
      field,
      value,
      ErrorCode.REQUIRED_FIELD_MISSING,
      "필수 정보를 입력해 주세요."
    );

    return issue ? [issue] : [];
  });
}
