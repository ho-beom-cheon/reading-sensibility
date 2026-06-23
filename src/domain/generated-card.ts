import {
  ErrorCode,
  SUPPORTED_CARD_RATIOS,
  type CardRatio,
  type TemplateEmphasis
} from "@/contracts";
import { invalid, ok, type ValidationResult } from "./validation";

export type GeneratedCardRenderOptions = {
  emphasis: TemplateEmphasis;
  showPublisher: boolean;
  showPageNumber: boolean;
  showReadAt: boolean;
  fontScale: number;
};

export type GeneratedCard = {
  id: string;
  userId?: string;
  readingMomentId: string;
  templateId: string;
  ratio: CardRatio;
  width: number;
  height: number;
  renderOptions: GeneratedCardRenderOptions;
  imagePath?: string;
  downloadToken?: string;
  expiresAt?: string;
  createdAt: string;
  deletedAt?: string;
};

export type GeneratedCardDraft = Pick<
  GeneratedCard,
  "readingMomentId" | "templateId" | "ratio" | "renderOptions"
>;

export function isSupportedCardRatio(value: string): value is CardRatio {
  return SUPPORTED_CARD_RATIOS.includes(value as CardRatio);
}

export function validateCardRatio(value: string): ValidationResult<CardRatio> {
  if (isSupportedCardRatio(value)) {
    return ok(value);
  }

  return invalid({
    field: "ratio",
    code: ErrorCode.TEMPLATE_UNSUPPORTED_RATIO,
    message: "지원하지 않는 카드 비율입니다."
  });
}
