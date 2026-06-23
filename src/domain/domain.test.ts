import { describe, expect, it } from "vitest";
import { ErrorCode, QUOTE_MAX_LENGTH, REFLECTION_MAX_LENGTH } from "@/contracts";
import {
  createReadingMoment,
  validateCardRatio,
  validateReflection,
  validateSelectedQuote,
  type Book,
  type GeneratedCard,
  type OcrSession,
  type ReadingMomentDraftInput
} from ".";

const validDraft: ReadingMomentDraftInput = {
  id: "moment_1",
  bookId: "book_1",
  selectedQuote: "짧은 문장이 하루의 온도를 바꾼다.",
  reflection: "오늘의 감상을 남긴다.",
  readAt: "2026-06-23T10:00:00.000Z",
  sourceType: "ocr",
  createdAt: "2026-06-23T10:01:00.000Z",
  updatedAt: "2026-06-23T10:01:00.000Z"
};

describe("domain types", () => {
  it("keeps Book, GeneratedCard, and OcrSession compatible with the design model", () => {
    const book = {
      id: "book_1",
      title: "문장순간",
      author: "작가",
      createdAt: "2026-06-23T10:00:00.000Z",
      updatedAt: "2026-06-23T10:00:00.000Z"
    } satisfies Book;

    const generatedCard = {
      id: "card_1",
      readingMomentId: "moment_1",
      templateId: "quiet_margin_01",
      ratio: "1:1",
      width: 1200,
      height: 1200,
      renderOptions: {
        emphasis: "quote",
        showPublisher: true,
        showPageNumber: true,
        showReadAt: true,
        fontScale: 1
      },
      createdAt: "2026-06-23T10:00:00.000Z"
    } satisfies GeneratedCard;

    const ocrSession = {
      id: "ocr_1",
      status: "success",
      language: "ko",
      blocks: [],
      sentences: [],
      expiresAt: "2026-06-23T10:10:00.000Z",
      createdAt: "2026-06-23T10:00:00.000Z"
    } satisfies OcrSession;

    expect(book.title).toBe("문장순간");
    expect(generatedCard.ratio).toBe("1:1");
    expect(ocrSession.status).toBe("success");
  });
});

describe("reading moment validation", () => {
  it("blocks selectedQuote values over the policy limit", () => {
    const issues = validateSelectedQuote("가".repeat(QUOTE_MAX_LENGTH + 1));

    expect(issues).toContainEqual(
      expect.objectContaining({
        field: "selectedQuote",
        code: ErrorCode.QUOTE_TOO_LONG
      })
    );
  });

  it("blocks reflection values over the policy limit", () => {
    const issues = validateReflection("나".repeat(REFLECTION_MAX_LENGTH + 1));

    expect(issues).toContainEqual(
      expect.objectContaining({
        field: "reflection"
      })
    );
  });

  it("creates private reading moments and derives quoteLength", () => {
    const result = createReadingMoment(validDraft);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.visibility).toBe("private");
    expect(result.value.quoteLength).toBe(validDraft.selectedQuote.length);
  });

  it("returns validation issues instead of creating invalid reading moments", () => {
    const result = createReadingMoment({
      ...validDraft,
      selectedQuote: "",
      reflection: ""
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        ErrorCode.QUOTE_REQUIRED,
        ErrorCode.REFLECTION_REQUIRED
      ])
    );
  });
});

describe("generated card validation", () => {
  it("accepts supported card ratios", () => {
    const result = validateCardRatio("9:16");

    expect(result).toEqual({ ok: true, value: "9:16" });
  });

  it("blocks unsupported card ratios", () => {
    const result = validateCardRatio("16:9");

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        field: "ratio",
        code: ErrorCode.TEMPLATE_UNSUPPORTED_RATIO
      })
    );
  });
});
