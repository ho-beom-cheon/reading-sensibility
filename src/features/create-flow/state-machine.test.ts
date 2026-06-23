import { describe, expect, it } from "vitest";
import { ErrorCode } from "@/contracts";
import {
  applyCreateCardEvent,
  initialCreateCardState,
  nextCreateCardState,
  patchCreateCardState,
  previousCreateCardState,
  type CreateCardState
} from ".";

function unwrap(result: ReturnType<typeof nextCreateCardState>): CreateCardState {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error("Expected transition to succeed");
  }

  return result.value;
}

describe("create flow state machine", () => {
  it("moves through the normal create-card step order", () => {
    let state = initialCreateCardState;

    state = unwrap(nextCreateCardState(state));
    expect(state.step).toBe("ocr");
    expect(state.status).toBe("ocr_processing");

    state = unwrap(nextCreateCardState(state));
    expect(state.step).toBe("selectQuote");
    expect(state.status).toBe("quote_selecting");

    state = unwrap(
      nextCreateCardState(
        patchCreateCardState(state, {
          selectedQuote: "짧은 문장이 하루의 온도를 바꾼다."
        })
      )
    );
    expect(state.step).toBe("details");

    state = unwrap(nextCreateCardState(state));
    expect(state.step).toBe("templates");
    expect(state.status).toBe("template_recommending");

    state = unwrap(
      nextCreateCardState(
        patchCreateCardState(state, {
          selectedTemplateId: "quiet_margin_01"
        })
      )
    );
    expect(state.step).toBe("preview");
    expect(state.status).toBe("preview_rendering");

    state = unwrap(applyCreateCardEvent(state, "PREVIEW_READY"));
    state = unwrap(nextCreateCardState(state));
    expect(state.step).toBe("done");
    expect(state.status).toBe("complete");
  });

  it("moves back to the previous step without losing selected quote", () => {
    const detailsState = patchCreateCardState(initialCreateCardState, {
      step: "details",
      status: "details_editing",
      selectedQuote: "돌아가도 유지되어야 하는 문장"
    });

    const previous = previousCreateCardState(detailsState);

    expect(previous.step).toBe("selectQuote");
    expect(previous.status).toBe("quote_selecting");
    expect(previous.selectedQuote).toBe(detailsState.selectedQuote);
  });

  it("blocks details transition when no quote has been selected", () => {
    const selectQuoteState = patchCreateCardState(initialCreateCardState, {
      step: "selectQuote",
      status: "quote_selecting",
      selectedQuote: ""
    });

    const result = nextCreateCardState(selectQuoteState);

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        field: "selectedQuote",
        code: ErrorCode.QUOTE_REQUIRED
      })
    );
  });

  it("supports OCR failure fallback into manual quote selection", () => {
    const ocrState = unwrap(nextCreateCardState(initialCreateCardState));
    const failed = unwrap(applyCreateCardEvent(ocrState, "OCR_FAILED"));

    expect(failed.step).toBe("ocr");
    expect(failed.status).toBe("ocr_failed");
    expect(failed.lastErrorCode).toBe(ErrorCode.OCR_FAILED);

    const manual = unwrap(applyCreateCardEvent(failed, "MANUAL_INPUT"));

    expect(manual.step).toBe("selectQuote");
    expect(manual.status).toBe("quote_selecting");
    expect(manual.mode).toBe("manual");
  });

  it("falls back to template selection when AI recommendation fails", () => {
    const templateState = patchCreateCardState(initialCreateCardState, {
      step: "templates",
      status: "template_recommending"
    });

    const result = unwrap(applyCreateCardEvent(templateState, "AI_FAILED"));

    expect(result.step).toBe("templates");
    expect(result.status).toBe("template_selecting");
    expect(result.useFallbackRecommendation).toBe(true);
    expect(result.lastErrorCode).toBe(ErrorCode.AI_CLASSIFY_FAILED);
  });

  it("captures render failure and allows retry", () => {
    const renderingState = patchCreateCardState(initialCreateCardState, {
      step: "preview",
      status: "preview_rendering"
    });

    const failed = unwrap(applyCreateCardEvent(renderingState, "RENDER_FAILED"));
    expect(failed.status).toBe("render_failed");
    expect(failed.lastErrorCode).toBe(ErrorCode.RENDER_FAILED);

    const retry = unwrap(applyCreateCardEvent(failed, "RETRY_RENDER"));
    expect(retry.status).toBe("preview_rendering");
    expect(retry.lastErrorCode).toBeNull();
  });
});
