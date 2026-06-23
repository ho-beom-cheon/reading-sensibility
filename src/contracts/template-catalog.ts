import templateCatalogJson from "../../docs/design/munjang-sungan-design-v1.0/specs/template_catalog.json";
import type { CardRatio } from "./policies";

export const TEMPLATE_CATALOG_SOURCE =
  "docs/design/munjang-sungan-design-v1.0/specs/template_catalog.json";

export const TEMPLATE_STATUSES = ["active", "hidden", "deprecated"] as const;
export type TemplateStatus = (typeof TEMPLATE_STATUSES)[number];

export const TEXT_LENGTH_BUCKETS = ["short", "medium", "long"] as const;
export type TextLengthBucket = (typeof TEXT_LENGTH_BUCKETS)[number];

export const TEMPLATE_EMPHASIS = [
  "quote",
  "reflection",
  "date",
  "source"
] as const;
export type TemplateEmphasis = (typeof TEMPLATE_EMPHASIS)[number];

export type TemplateSafeArea = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type CardTemplate = {
  id: string;
  name: string;
  description: string;
  status: TemplateStatus;
  moods: string[];
  genres: string[];
  palette: string;
  layout: string;
  textLength: TextLengthBucket[];
  ratios: CardRatio[];
  emphasis: TemplateEmphasis[];
  backgroundStyle: string;
  effects: string[];
  renderConfig: {
    safeArea: TemplateSafeArea;
  };
};

export const cardTemplates = templateCatalogJson as CardTemplate[];

export const activeCardTemplates = cardTemplates.filter(
  (template) => template.status === "active"
);
