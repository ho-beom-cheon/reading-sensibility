import {
  createOcrSentence,
  type OcrProvider,
  type OcrProviderInput,
  type OcrProviderResult
} from "./ocr-provider";

export const MOCK_OCR_SENTENCE_TEXTS = [
  "나는 내가 읽은 문장들이 내 하루의 온도를 바꾼다는 사실을 천천히 배웠다.",
  "좋은 문장은 지나간 시간을 붙잡는 대신, 다시 걸어갈 수 있는 마음을 남긴다.",
  "책장을 덮은 뒤에도 오래 남는 것은 줄거리보다 그 순간의 나 자신이었다.",
  "이 문장은 의도적으로 길게 만든 예시입니다. 사용자가 OCR 후보에서 너무 긴 문장을 선택했을 때 다음 단계로 바로 넘어가지 못하고 짧게 줄이도록 안내하는지 확인하기 위한 테스트 문장입니다. 핵심 문구만 남겨야 합니다."
] as const;

type MockOcrProviderOptions = {
  now?: () => Date;
};

export class MockOcrProvider implements OcrProvider {
  private readonly now: () => Date;

  constructor(options: MockOcrProviderOptions = {}) {
    this.now = options.now ?? (() => new Date());
  }

  async recognize(input: OcrProviderInput): Promise<OcrProviderResult> {
    const createdAt = this.now();
    const expiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000);

    return {
      ocrSessionId: createMockOcrSessionId(input),
      language: input.language ?? "ko",
      expiresAt: expiresAt.toISOString(),
      sentences: MOCK_OCR_SENTENCE_TEXTS.map((text, index) =>
        createOcrSentence(`mock_sentence_${index + 1}`, text, 0.96 - index * 0.04)
      )
    };
  }
}

export const mockOcrProvider = new MockOcrProvider();

function createMockOcrSessionId(input: OcrProviderInput) {
  const fileLabel = input.fileName
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return fileLabel ? `mock_ocr_${fileLabel}` : "mock_ocr_session";
}
