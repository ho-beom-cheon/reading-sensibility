export type OcrSessionStatus = "processing" | "success" | "failed" | "expired";
export type OcrLanguage = "ko" | "en" | "mixed";

export type OcrBlock = {
  id: string;
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type OcrSentence = {
  id: string;
  text: string;
  confidence: number;
  length: number;
};

export type OcrSession = {
  id: string;
  userId?: string;
  status: OcrSessionStatus;
  language: OcrLanguage;
  blocks: OcrBlock[];
  sentences: OcrSentence[];
  expiresAt: string;
  createdAt: string;
};
