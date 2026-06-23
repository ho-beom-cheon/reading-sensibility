import { ErrorCode } from "@/contracts";
import { invalid, ok, type ValidationResult } from "@/domain";

export const CREATE_CARD_STEPS = [
  "upload",
  "ocr",
  "selectQuote",
  "details",
  "templates",
  "preview",
  "done"
] as const;

export type CreateCardStep = (typeof CREATE_CARD_STEPS)[number];

export const CREATE_CARD_STATUSES = [
  "idle",
  "uploading",
  "ocr_processing",
  "ocr_failed",
  "quote_selecting",
  "details_editing",
  "template_recommending",
  "template_selecting",
  "preview_rendering",
  "preview_ready",
  "render_failed",
  "complete"
] as const;

export type CreateCardStatus = (typeof CREATE_CARD_STATUSES)[number];

export const CREATE_CARD_EVENTS = [
  "UPLOAD_FAILED",
  "OCR_FAILED",
  "MANUAL_INPUT",
  "AI_FAILED",
  "TEMPLATE_RECOMMENDED",
  "RENDER_FAILED",
  "RETRY_RENDER",
  "PREVIEW_READY",
  "SAVE_LIBRARY_REQUIRED_AUTH"
] as const;

export type CreateCardEvent = (typeof CREATE_CARD_EVENTS)[number];

export type CreateCardInputMode = "ocr" | "manual";

export type CreateCardState = {
  step: CreateCardStep;
  status: CreateCardStatus;
  mode: CreateCardInputMode;
  selectedQuote: string | null;
  selectedTemplateId: string | null;
  useFallbackRecommendation: boolean;
  lastErrorCode: ErrorCode | null;
};

export const initialCreateCardState: CreateCardState = {
  step: "upload",
  status: "idle",
  mode: "ocr",
  selectedQuote: null,
  selectedTemplateId: null,
  useFallbackRecommendation: false,
  lastErrorCode: null
};

export function patchCreateCardState(
  state: CreateCardState,
  patch: Partial<CreateCardState>
): CreateCardState {
  return {
    ...state,
    ...patch
  };
}

export function nextCreateCardState(
  state: CreateCardState
): ValidationResult<CreateCardState> {
  switch (state.step) {
    case "upload":
      return ok(
        patchCreateCardState(state, {
          step: "ocr",
          status: "ocr_processing",
          lastErrorCode: null
        })
      );
    case "ocr":
      if (state.status === "ocr_failed") {
        return invalidTransition(
          "status",
          ErrorCode.OCR_FAILED,
          "OCR 실패 상태에서는 직접 입력으로 전환해야 합니다."
        );
      }

      return ok(
        patchCreateCardState(state, {
          step: "selectQuote",
          status: "quote_selecting",
          lastErrorCode: null
        })
      );
    case "selectQuote":
      if (!hasSelectedQuote(state)) {
        return invalidTransition(
          "selectedQuote",
          ErrorCode.QUOTE_REQUIRED,
          "문장 미선택 상태에서는 기록 입력 단계로 이동할 수 없습니다."
        );
      }

      return ok(
        patchCreateCardState(state, {
          step: "details",
          status: "details_editing",
          lastErrorCode: null
        })
      );
    case "details":
      return ok(
        patchCreateCardState(state, {
          step: "templates",
          status: "template_recommending",
          useFallbackRecommendation: false,
          lastErrorCode: null
        })
      );
    case "templates":
      if (!state.selectedTemplateId) {
        return invalidTransition(
          "selectedTemplateId",
          ErrorCode.TEMPLATE_NOT_FOUND,
          "템플릿 미선택 상태에서는 미리보기 단계로 이동할 수 없습니다."
        );
      }

      return ok(
        patchCreateCardState(state, {
          step: "preview",
          status: "preview_rendering",
          lastErrorCode: null
        })
      );
    case "preview":
      if (state.status === "render_failed") {
        return invalidTransition(
          "status",
          ErrorCode.RENDER_FAILED,
          "렌더링 실패 상태에서는 다시 렌더링해야 합니다."
        );
      }

      return ok(
        patchCreateCardState(state, {
          step: "done",
          status: "complete",
          lastErrorCode: null
        })
      );
    case "done":
      return ok(state);
  }
}

export function previousCreateCardState(state: CreateCardState): CreateCardState {
  switch (state.step) {
    case "upload":
      return state;
    case "ocr":
      return patchCreateCardState(state, {
        step: "upload",
        status: "idle"
      });
    case "selectQuote":
      return patchCreateCardState(state, {
        step: "ocr",
        status: "ocr_processing"
      });
    case "details":
      return patchCreateCardState(state, {
        step: "selectQuote",
        status: "quote_selecting"
      });
    case "templates":
      return patchCreateCardState(state, {
        step: "details",
        status: "details_editing"
      });
    case "preview":
      return patchCreateCardState(state, {
        step: "templates",
        status: "template_selecting"
      });
    case "done":
      return patchCreateCardState(state, {
        step: "preview",
        status: "preview_ready"
      });
  }
}

export function applyCreateCardEvent(
  state: CreateCardState,
  event: CreateCardEvent
): ValidationResult<CreateCardState> {
  switch (event) {
    case "UPLOAD_FAILED":
      return ok({
        ...initialCreateCardState,
        lastErrorCode: ErrorCode.INVALID_IMAGE
      });
    case "OCR_FAILED":
      return requireStatus(state, "ocr_processing", () =>
        patchCreateCardState(state, {
          step: "ocr",
          status: "ocr_failed",
          lastErrorCode: ErrorCode.OCR_FAILED
        })
      );
    case "MANUAL_INPUT":
      return requireStatus(state, "ocr_failed", () =>
        patchCreateCardState(state, {
          step: "selectQuote",
          status: "quote_selecting",
          mode: "manual",
          lastErrorCode: null
        })
      );
    case "AI_FAILED":
      return requireStatus(state, "template_recommending", () =>
        patchCreateCardState(state, {
          step: "templates",
          status: "template_selecting",
          useFallbackRecommendation: true,
          lastErrorCode: ErrorCode.AI_CLASSIFY_FAILED
        })
      );
    case "TEMPLATE_RECOMMENDED":
      return requireStatus(state, "template_recommending", () =>
        patchCreateCardState(state, {
          step: "templates",
          status: "template_selecting",
          lastErrorCode: null
        })
      );
    case "RENDER_FAILED":
      return requireStatus(state, "preview_rendering", () =>
        patchCreateCardState(state, {
          step: "preview",
          status: "render_failed",
          lastErrorCode: ErrorCode.RENDER_FAILED
        })
      );
    case "RETRY_RENDER":
      return requireStatus(state, "render_failed", () =>
        patchCreateCardState(state, {
          step: "preview",
          status: "preview_rendering",
          lastErrorCode: null
        })
      );
    case "PREVIEW_READY":
      return requireStatus(state, "preview_rendering", () =>
        patchCreateCardState(state, {
          step: "preview",
          status: "preview_ready",
          lastErrorCode: null
        })
      );
    case "SAVE_LIBRARY_REQUIRED_AUTH":
      return requireStatus(state, "preview_ready", () =>
        patchCreateCardState(state, {
          step: "preview",
          status: "preview_ready",
          lastErrorCode: ErrorCode.UNAUTHORIZED
        })
      );
  }
}

function hasSelectedQuote(state: CreateCardState) {
  return state.selectedQuote !== null && state.selectedQuote.trim().length > 0;
}

function requireStatus(
  state: CreateCardState,
  status: CreateCardStatus,
  createNextState: () => CreateCardState
): ValidationResult<CreateCardState> {
  if (state.status === status) {
    return ok(createNextState());
  }

  return invalidTransition(
    "status",
    ErrorCode.REQUIRED_FIELD_MISSING,
    `현재 상태에서는 이 이벤트를 처리할 수 없습니다.`
  );
}

function invalidTransition(
  field: string,
  code: ErrorCode,
  message: string
): ValidationResult<CreateCardState> {
  return invalid({
    field,
    code,
    message
  });
}
