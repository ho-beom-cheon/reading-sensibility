export const ErrorCode = {
  INVALID_IMAGE: "INVALID_IMAGE",
  IMAGE_TOO_LARGE: "IMAGE_TOO_LARGE",
  IMAGE_TOO_BLURRY: "IMAGE_TOO_BLURRY",
  OCR_FAILED: "OCR_FAILED",
  OCR_SESSION_EXPIRED: "OCR_SESSION_EXPIRED",
  QUOTE_REQUIRED: "QUOTE_REQUIRED",
  QUOTE_TOO_LONG: "QUOTE_TOO_LONG",
  REFLECTION_REQUIRED: "REFLECTION_REQUIRED",
  REQUIRED_FIELD_MISSING: "REQUIRED_FIELD_MISSING",
  AI_CLASSIFY_FAILED: "AI_CLASSIFY_FAILED",
  TEMPLATE_NOT_FOUND: "TEMPLATE_NOT_FOUND",
  TEMPLATE_UNSUPPORTED_RATIO: "TEMPLATE_UNSUPPORTED_RATIO",
  RENDER_FAILED: "RENDER_FAILED",
  DOWNLOAD_EXPIRED: "DOWNLOAD_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN"
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export type ErrorCodeDefinition = {
  httpStatus: number;
  userMessage: string;
  recovery: string;
};

export const ERROR_CODE_DEFINITIONS = {
  [ErrorCode.INVALID_IMAGE]: {
    httpStatus: 400,
    userMessage: "사용할 수 없는 이미지입니다.",
    recovery: "다른 이미지 선택"
  },
  [ErrorCode.IMAGE_TOO_LARGE]: {
    httpStatus: 413,
    userMessage: "이미지 용량이 너무 큽니다.",
    recovery: "압축 또는 재촬영"
  },
  [ErrorCode.IMAGE_TOO_BLURRY]: {
    httpStatus: 422,
    userMessage: "글자가 흐릿할 수 있습니다.",
    recovery: "재촬영 권장"
  },
  [ErrorCode.OCR_FAILED]: {
    httpStatus: 422,
    userMessage: "문장을 충분히 인식하지 못했습니다.",
    recovery: "재촬영/직접 입력"
  },
  [ErrorCode.OCR_SESSION_EXPIRED]: {
    httpStatus: 410,
    userMessage: "인식 결과가 만료되었습니다.",
    recovery: "다시 업로드"
  },
  [ErrorCode.QUOTE_REQUIRED]: {
    httpStatus: 400,
    userMessage: "저장할 문장을 선택해 주세요.",
    recovery: "문장 선택"
  },
  [ErrorCode.QUOTE_TOO_LONG]: {
    httpStatus: 422,
    userMessage: "120자 이내로 줄여 주세요.",
    recovery: "문장 수정"
  },
  [ErrorCode.REFLECTION_REQUIRED]: {
    httpStatus: 400,
    userMessage: "이 문장을 만난 감상을 적어 주세요.",
    recovery: "감상 입력"
  },
  [ErrorCode.REQUIRED_FIELD_MISSING]: {
    httpStatus: 400,
    userMessage: "필수 정보를 입력해 주세요.",
    recovery: "필드 보완"
  },
  [ErrorCode.AI_CLASSIFY_FAILED]: {
    httpStatus: 502,
    userMessage: "기본 추천으로 보여드립니다.",
    recovery: "fallback 추천"
  },
  [ErrorCode.TEMPLATE_NOT_FOUND]: {
    httpStatus: 404,
    userMessage: "템플릿을 찾을 수 없습니다.",
    recovery: "다른 템플릿 선택"
  },
  [ErrorCode.TEMPLATE_UNSUPPORTED_RATIO]: {
    httpStatus: 422,
    userMessage: "이 템플릿은 선택한 비율을 지원하지 않습니다.",
    recovery: "비율 변경"
  },
  [ErrorCode.RENDER_FAILED]: {
    httpStatus: 500,
    userMessage: "카드를 생성하지 못했습니다.",
    recovery: "재시도"
  },
  [ErrorCode.DOWNLOAD_EXPIRED]: {
    httpStatus: 410,
    userMessage: "다운로드 링크가 만료되었습니다.",
    recovery: "다시 생성"
  },
  [ErrorCode.UNAUTHORIZED]: {
    httpStatus: 401,
    userMessage: "보관함 저장은 로그인이 필요합니다.",
    recovery: "로그인"
  },
  [ErrorCode.FORBIDDEN]: {
    httpStatus: 403,
    userMessage: "접근할 수 없습니다.",
    recovery: "요청 중단"
  }
} satisfies Record<ErrorCode, ErrorCodeDefinition>;

export const ERROR_CODES = Object.values(ErrorCode) as ErrorCode[];
