import type { OcrLanguage, OcrSentence } from "@/domain";

export type OcrSourceType = "camera" | "album";

export type OcrProviderInput = {
  fileName?: string;
  mimeType?: string;
  size?: number;
  language?: OcrLanguage;
  sourceType: OcrSourceType;
};

export type OcrProviderResult = {
  ocrSessionId: string;
  language: OcrLanguage;
  expiresAt: string;
  sentences: OcrSentence[];
};

export type OcrProvider = {
  recognize(input: OcrProviderInput): Promise<OcrProviderResult>;
};

export function createOcrSentence(
  id: string,
  text: string,
  confidence: number
): OcrSentence {
  return {
    id,
    text,
    confidence,
    length: [...text].length
  };
}
