import { describe, expect, it } from "vitest";
import { QUOTE_MAX_LENGTH } from "@/contracts";
import {
  MockOcrProvider,
  MOCK_OCR_SENTENCE_TEXTS,
  createOcrSentence
} from ".";

describe("MockOcrProvider", () => {
  it("returns sentence candidates with confidence and length metadata", async () => {
    const provider = new MockOcrProvider({
      now: () => new Date("2026-06-23T10:00:00.000Z")
    });

    const result = await provider.recognize({
      fileName: "sample-page.png",
      mimeType: "image/png",
      size: 1024,
      sourceType: "album"
    });

    expect(result.ocrSessionId).toBe("mock_ocr_sample_page_png");
    expect(result.language).toBe("ko");
    expect(result.expiresAt).toBe("2026-06-23T11:00:00.000Z");
    expect(result.sentences).toHaveLength(MOCK_OCR_SENTENCE_TEXTS.length);
    expect(result.sentences[0]).toEqual(
      expect.objectContaining({
        id: "mock_sentence_1",
        confidence: 0.96,
        length: [...MOCK_OCR_SENTENCE_TEXTS[0]].length
      })
    );
  });

  it("keeps one overlong candidate for quote limit UI testing", async () => {
    const provider = new MockOcrProvider();
    const result = await provider.recognize({ sourceType: "album" });

    expect(result.sentences.some((sentence) => sentence.length > QUOTE_MAX_LENGTH))
      .toBe(true);
  });
});

describe("createOcrSentence", () => {
  it("counts unicode characters for sentence length", () => {
    const sentence = createOcrSentence("sentence_1", "문장🙂", 0.9);

    expect(sentence.length).toBe(3);
  });
});
