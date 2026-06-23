import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  ERROR_CODE_DEFINITIONS,
  ERROR_CODES,
  QUOTE_MAX_LENGTH,
  REFLECTION_MAX_LENGTH,
  SUPPORTED_CARD_RATIOS,
  activeCardTemplates,
  cardTemplates
} from ".";

const designSpecsPath = path.resolve(
  process.cwd(),
  "docs/design/munjang-sungan-design-v1.0/specs"
);

function readDesignSpec(fileName: string) {
  return readFileSync(path.join(designSpecsPath, fileName), "utf8");
}

function parseErrorCodeRows(markdown: string) {
  return [...markdown.matchAll(/^\| ([A-Z_]+) \| (\d{3}) \| .* \| (.*) \| (.*) \|$/gm)].map(
    ([, code, httpStatus, userMessage, recovery]) => ({
      code,
      httpStatus: Number(httpStatus),
      userMessage,
      recovery
    })
  );
}

describe("design contracts", () => {
  it("loads the template catalog from the design artifact", () => {
    const sourceCatalog = JSON.parse(readDesignSpec("template_catalog.json"));

    expect(cardTemplates).toHaveLength(sourceCatalog.length);
    expect(activeCardTemplates).toHaveLength(5);
    expect(activeCardTemplates.map((template) => template.id)).toEqual([
      "quiet_margin_01",
      "rainy_window_01",
      "night_desk_01",
      "library_card_01",
      "bookmark_01"
    ]);
  });

  it("keeps template ratios inside the supported policy set", () => {
    const supportedRatios = new Set(SUPPORTED_CARD_RATIOS);
    const templateRatios = cardTemplates.flatMap((template) => template.ratios);

    expect(templateRatios.every((ratio) => supportedRatios.has(ratio))).toBe(
      true
    );
  });

  it("keeps error code definitions aligned with the design document", () => {
    const designErrorCodes = parseErrorCodeRows(readDesignSpec("error_codes.md"));

    expect(ERROR_CODES).toEqual(designErrorCodes.map((row) => row.code));

    for (const row of designErrorCodes) {
      const definition = ERROR_CODE_DEFINITIONS[row.code as keyof typeof ERROR_CODE_DEFINITIONS];

      expect(definition.httpStatus).toBe(row.httpStatus);
      expect(definition.userMessage).toBe(row.userMessage);
      expect(definition.recovery).toBe(row.recovery);
    }
  });

  it("centralizes OpenAPI policy limits for downstream validation", () => {
    const openApi = readDesignSpec("openapi.yaml");

    expect(QUOTE_MAX_LENGTH).toBe(120);
    expect(REFLECTION_MAX_LENGTH).toBe(150);
    expect(openApi).toContain(
      `selectedQuote: { type: string, maxLength: ${QUOTE_MAX_LENGTH} }`
    );
    expect(openApi).toContain(
      `reflection: { type: string, maxLength: ${REFLECTION_MAX_LENGTH} }`
    );
    expect(openApi).toContain("enum: ['1:1', '4:5', '9:16']");
  });
});
