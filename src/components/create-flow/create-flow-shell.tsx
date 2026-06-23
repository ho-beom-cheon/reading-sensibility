"use client";

import { useMemo, useState } from "react";
import {
  activeCardTemplates,
  READING_MOMENT_POLICY,
  SUPPORTED_CARD_RATIOS,
  type CardRatio
} from "@/contracts";
import {
  applyCreateCardEvent,
  CREATE_CARD_STEPS,
  initialCreateCardState,
  nextCreateCardState,
  patchCreateCardState,
  previousCreateCardState,
  type CreateCardState,
  type CreateCardStep
} from "@/features/create-flow";

const stepLabels: Record<CreateCardStep, string> = {
  upload: "업로드",
  ocr: "OCR",
  selectQuote: "문장 선택",
  details: "기록 입력",
  templates: "템플릿",
  preview: "미리보기",
  done: "완료"
};

const mockSentences = [
  "나는 내가 읽은 문장들이 내 하루의 온도를 바꾼다는 사실을 천천히 배웠다.",
  "좋은 문장은 지나간 시간을 붙잡는 대신, 다시 걸어갈 수 있는 마음을 남긴다.",
  "책장을 덮은 뒤에도 오래 남는 것은 줄거리보다 그 순간의 나 자신이었다."
];

const defaultTemplateId = activeCardTemplates[0]?.id ?? "quiet_margin_01";

const ratioClassNames: Record<CardRatio, string> = {
  "1:1": "ratio-square",
  "4:5": "ratio-portrait",
  "9:16": "ratio-story"
};

type DraftForm = {
  selectedQuote: string;
  bookTitle: string;
  author: string;
  pageNumber: string;
  reflection: string;
  ratio: CardRatio;
};

const initialDraft: DraftForm = {
  selectedQuote: mockSentences[0],
  bookTitle: "작은 독서의 기록",
  author: "문장수집가",
  pageNumber: "42",
  reflection: "오늘의 문장은 조용히 멈춰 서는 시간을 만들어 주었다.",
  ratio: "4:5"
};

export function CreateFlowShell() {
  const [flowState, setFlowState] = useState<CreateCardState>(() =>
    patchCreateCardState(initialCreateCardState, {
      selectedQuote: initialDraft.selectedQuote
    })
  );
  const [draft, setDraft] = useState(initialDraft);
  const [notice, setNotice] = useState("샘플 데이터로 전체 흐름을 먼저 눌러볼 수 있습니다.");
  const [downloadReady, setDownloadReady] = useState(false);

  const recommendedTemplates = useMemo(
    () =>
      activeCardTemplates
        .filter((template) => template.ratios.includes(draft.ratio))
        .slice(0, 3),
    [draft.ratio]
  );

  const selectedTemplate =
    activeCardTemplates.find(
      (template) => template.id === flowState.selectedTemplateId
    ) ??
    recommendedTemplates[0] ??
    activeCardTemplates[0];

  function updateDraft<TField extends keyof DraftForm>(
    field: TField,
    value: DraftForm[TField]
  ) {
    setDraft((current) => ({ ...current, [field]: value }));

    if (field === "selectedQuote") {
      setFlowState((current) =>
        patchCreateCardState(current, {
          selectedQuote: String(value)
        })
      );
    }
  }

  function applyState(nextState: CreateCardState, nextNotice: string) {
    setFlowState(nextState);
    setNotice(nextNotice);
  }

  function applyResult(
    result: ReturnType<typeof nextCreateCardState>,
    successNotice: string
  ) {
    if (result.ok) {
      applyState(result.value, successNotice);
      return;
    }

    setNotice(result.issues[0]?.message ?? "다음 단계로 이동할 수 없습니다.");
  }

  function goNext() {
    if (flowState.step === "details") {
      if (!draft.bookTitle.trim() || !draft.author.trim()) {
        setNotice("책 제목과 저자를 입력해야 다음 단계로 이동할 수 있습니다.");
        return;
      }

      if (!draft.reflection.trim()) {
        setNotice("감상을 입력해야 카드에 개인 기록으로 남길 수 있습니다.");
        return;
      }
    }

    if (flowState.step === "preview" && flowState.status !== "preview_ready") {
      setNotice("렌더링 완료 상태에서만 저장 완료 단계로 이동할 수 있습니다.");
      return;
    }

    applyResult(nextCreateCardState(flowState), "다음 단계로 이동했습니다.");
  }

  function goBack() {
    setFlowState((current) => previousCreateCardState(current));
    setNotice("이전 단계로 돌아왔습니다.");
  }

  function runEvent(
    event: Parameters<typeof applyCreateCardEvent>[1],
    successNotice: string,
    patch?: Partial<CreateCardState>
  ) {
    const result = applyCreateCardEvent(flowState, event);

    if (!result.ok) {
      setNotice(result.issues[0]?.message ?? "상태를 변경할 수 없습니다.");
      return;
    }

    applyState(patch ? patchCreateCardState(result.value, patch) : result.value, successNotice);
  }

  function completeRecommendation(useFallback: boolean) {
    const templateId = recommendedTemplates[0]?.id ?? defaultTemplateId;

    runEvent(
      useFallback ? "AI_FAILED" : "TEMPLATE_RECOMMENDED",
      useFallback
        ? "AI 추천 실패 경로입니다. 기본 추천 목록으로 계속 진행합니다."
        : "추천 템플릿 3개를 준비했습니다.",
      { selectedTemplateId: templateId }
    );
  }

  function markPreviewReady() {
    runEvent("PREVIEW_READY", "PNG 미리보기 렌더링이 완료된 상태로 전환했습니다.");
  }

  function renderCurrentStep() {
    switch (flowState.step) {
      case "upload":
        return (
          <section className="flow-panel" aria-labelledby="upload-title">
            <div className="flow-section-heading">
              <p className="eyebrow">CREATE_UPLOAD</p>
              <h2 id="upload-title">책 페이지 사진 준비</h2>
              <p>
                실제 파일 업로드는 아직 연결하지 않고, 샘플 이미지 입력으로 OCR
                흐름을 확인합니다.
              </p>
            </div>

            <div className="upload-dropzone" aria-label="샘플 업로드 영역">
              <span className="upload-icon">IMG</span>
              <strong>책 페이지 이미지 mock</strong>
              <span>JPG, PNG 한 장 기준 UI shell</span>
            </div>

            <p className="privacy-note">
              원본 책 사진은 OCR 처리 후 저장하지 않습니다. 선택한 문구와 직접
              입력한 기록만 저장됩니다.
            </p>

            <div className="flow-actions">
              <button className="button" type="button" onClick={goNext}>
                OCR 시작
              </button>
              <button
                className="button secondary"
                type="button"
                onClick={() =>
                  applyState(
                    patchCreateCardState(flowState, {
                      step: "selectQuote",
                      status: "quote_selecting",
                      mode: "manual"
                    }),
                    "OCR 없이 직접 입력 경로로 이동했습니다."
                  )
                }
              >
                직접 입력
              </button>
            </div>
          </section>
        );
      case "ocr":
        return (
          <section className="flow-panel" aria-labelledby="ocr-title">
            <div className="flow-section-heading">
              <p className="eyebrow">OCR_PROCESSING</p>
              <h2 id="ocr-title">문장 인식 결과 확인</h2>
              <p>
                현재 단계는 OCR provider 연결 전 mock 상태입니다. 성공과 실패
                경로를 모두 눌러볼 수 있습니다.
              </p>
            </div>

            <div className="process-state">
              <span className="process-dot" aria-hidden="true" />
              <strong>
                {flowState.status === "ocr_failed"
                  ? "OCR 결과 없음"
                  : "OCR 처리 mock 완료 대기"}
              </strong>
              <span>
                {flowState.status === "ocr_failed"
                  ? "재시도하거나 직접 입력으로 전환합니다."
                  : "성공 버튼을 누르면 문장 후보가 표시됩니다."}
              </span>
            </div>

            <div className="flow-actions">
              {flowState.status === "ocr_failed" ? (
                <>
                  <button
                    className="button"
                    type="button"
                    onClick={() =>
                      applyState(
                        patchCreateCardState(flowState, {
                          status: "ocr_processing",
                          lastErrorCode: null
                        }),
                        "OCR 재시도 상태로 돌아왔습니다."
                      )
                    }
                  >
                    OCR 재시도
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() =>
                      runEvent(
                        "MANUAL_INPUT",
                        "직접 입력 경로로 전환했습니다."
                      )
                    }
                  >
                    직접 입력으로 계속
                  </button>
                </>
              ) : (
                <>
                  <button className="button" type="button" onClick={goNext}>
                    OCR 성공
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() =>
                      runEvent("OCR_FAILED", "OCR 실패 경로를 확인합니다.")
                    }
                  >
                    OCR 실패 보기
                  </button>
                </>
              )}
            </div>
          </section>
        );
      case "selectQuote":
        return (
          <section className="flow-panel" aria-labelledby="quote-title">
            <div className="flow-section-heading">
              <p className="eyebrow">SELECT_QUOTE</p>
              <h2 id="quote-title">저장할 문장 선택</h2>
              <p>문장 후보 중 하나를 선택하거나 120자 이내로 직접 수정합니다.</p>
            </div>

            <div className="quote-candidates">
              {mockSentences.map((sentence) => (
                <button
                  className={
                    sentence === draft.selectedQuote
                      ? "choice-button selected"
                      : "choice-button"
                  }
                  key={sentence}
                  type="button"
                  onClick={() => updateDraft("selectedQuote", sentence)}
                >
                  {sentence}
                </button>
              ))}
            </div>

            <label className="field">
              <span>선택 문장</span>
              <textarea
                maxLength={READING_MOMENT_POLICY.quoteMaxLength}
                value={draft.selectedQuote}
                onChange={(event) =>
                  updateDraft("selectedQuote", event.target.value)
                }
              />
            </label>
            <p className="field-hint">
              권장 100자, 최대 {READING_MOMENT_POLICY.quoteMaxLength}자 · 현재{" "}
              {draft.selectedQuote.length}자
            </p>

            <div className="flow-actions">
              <button className="button secondary" type="button" onClick={goBack}>
                이전
              </button>
              <button
                className="button"
                type="button"
                disabled={!draft.selectedQuote.trim()}
                onClick={goNext}
              >
                기록 입력
              </button>
            </div>
          </section>
        );
      case "details":
        return (
          <section className="flow-panel" aria-labelledby="details-title">
            <div className="flow-section-heading">
              <p className="eyebrow">MOMENT_DETAILS</p>
              <h2 id="details-title">책 정보와 감상 입력</h2>
              <p>카드에는 긴 원문보다 선택 문장, 감상, 책 정보가 중심이 됩니다.</p>
            </div>

            <div className="form-grid two-column">
              <label className="field">
                <span>책 제목</span>
                <input
                  maxLength={READING_MOMENT_POLICY.bookTitleMaxLength}
                  value={draft.bookTitle}
                  onChange={(event) => updateDraft("bookTitle", event.target.value)}
                />
              </label>
              <label className="field">
                <span>저자</span>
                <input
                  maxLength={READING_MOMENT_POLICY.authorMaxLength}
                  value={draft.author}
                  onChange={(event) => updateDraft("author", event.target.value)}
                />
              </label>
              <label className="field">
                <span>쪽수</span>
                <input
                  value={draft.pageNumber}
                  onChange={(event) => updateDraft("pageNumber", event.target.value)}
                />
              </label>
              <label className="field span-two">
                <span>감상</span>
                <textarea
                  maxLength={READING_MOMENT_POLICY.reflectionMaxLength}
                  value={draft.reflection}
                  onChange={(event) =>
                    updateDraft("reflection", event.target.value)
                  }
                />
              </label>
            </div>
            <p className="field-hint">
              감상 최대 {READING_MOMENT_POLICY.reflectionMaxLength}자 · 현재{" "}
              {draft.reflection.length}자
            </p>

            <div className="flow-actions">
              <button className="button secondary" type="button" onClick={goBack}>
                이전
              </button>
              <button className="button" type="button" onClick={goNext}>
                템플릿 추천
              </button>
            </div>
          </section>
        );
      case "templates":
        return (
          <section className="flow-panel" aria-labelledby="templates-title">
            <div className="flow-section-heading">
              <p className="eyebrow">TEMPLATE_SELECT</p>
              <h2 id="templates-title">비율과 템플릿 선택</h2>
              <p>
                AI 추천은 아직 mock입니다. 비율별로 사용 가능한 활성 템플릿을
                선택합니다.
              </p>
            </div>

            <div className="segmented-control" aria-label="카드 비율 선택">
              {SUPPORTED_CARD_RATIOS.map((ratio) => (
                <button
                  className={draft.ratio === ratio ? "selected" : ""}
                  key={ratio}
                  type="button"
                  onClick={() => {
                    updateDraft("ratio", ratio);
                    setFlowState((current) =>
                      patchCreateCardState(current, {
                        selectedTemplateId: null
                      })
                    );
                  }}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {flowState.status === "template_recommending" ? (
              <div className="process-state">
                <span className="process-dot" aria-hidden="true" />
                <strong>추천 분석 mock</strong>
                <span>선택 문장과 감상을 기준으로 추천 목록을 준비합니다.</span>
                <div className="flow-actions compact">
                  <button
                    className="button"
                    type="button"
                    onClick={() => completeRecommendation(false)}
                  >
                    추천 결과 보기
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => completeRecommendation(true)}
                  >
                    AI 실패 fallback
                  </button>
                </div>
              </div>
            ) : (
              <div className="template-grid">
                {recommendedTemplates.map((template) => (
                  <button
                    className={
                      flowState.selectedTemplateId === template.id
                        ? "template-option selected"
                        : "template-option"
                    }
                    key={template.id}
                    type="button"
                    onClick={() =>
                      setFlowState((current) =>
                        patchCreateCardState(current, {
                          selectedTemplateId: template.id
                        })
                      )
                    }
                  >
                    <span className="template-swatch" aria-hidden="true" />
                    <strong>{template.name}</strong>
                    <span>{template.description}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flow-actions">
              <button className="button secondary" type="button" onClick={goBack}>
                이전
              </button>
              <button
                className="button"
                type="button"
                disabled={
                  flowState.status === "template_recommending" ||
                  !flowState.selectedTemplateId
                }
                onClick={goNext}
              >
                미리보기
              </button>
            </div>
          </section>
        );
      case "preview":
        return (
          <section className="flow-panel" aria-labelledby="preview-title">
            <div className="flow-section-heading">
              <p className="eyebrow">PREVIEW</p>
              <h2 id="preview-title">카드 미리보기</h2>
              <p>HTML/CSS 카드로 렌더링 전 화면 구성을 먼저 확인합니다.</p>
            </div>

            {flowState.status === "render_failed" ? (
              <div className="process-state error">
                <strong>렌더링 실패</strong>
                <span>재시도 버튼으로 preview_rendering 상태로 복구합니다.</span>
              </div>
            ) : (
              renderPreviewCard(draft, selectedTemplate?.name ?? "문장 카드")
            )}

            <p className="privacy-note">
              이 이미지는 개인 독서 기록용으로 생성됩니다. 공개 게시 또는 상업적
              이용 시 저작권 문제가 발생할 수 있습니다.
            </p>

            <div className="flow-actions">
              <button className="button secondary" type="button" onClick={goBack}>
                이전
              </button>
              {flowState.status === "preview_rendering" && (
                <>
                  <button className="button" type="button" onClick={markPreviewReady}>
                    렌더링 완료
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => runEvent("RENDER_FAILED", "렌더링 실패 경로입니다.")}
                  >
                    실패 보기
                  </button>
                </>
              )}
              {flowState.status === "render_failed" && (
                <button
                  className="button"
                  type="button"
                  onClick={() => runEvent("RETRY_RENDER", "렌더링을 다시 시도합니다.")}
                >
                  다시 렌더링
                </button>
              )}
              {flowState.status === "preview_ready" && (
                <>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => {
                      setDownloadReady(true);
                      setNotice("PNG 다운로드 mock이 준비됐습니다.");
                    }}
                  >
                    PNG 다운로드
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() =>
                      runEvent(
                        "SAVE_LIBRARY_REQUIRED_AUTH",
                        "보관함 저장은 로그인 후 사용할 수 있습니다."
                      )
                    }
                  >
                    보관함 저장
                  </button>
                  <button className="button" type="button" onClick={goNext}>
                    완료
                  </button>
                </>
              )}
            </div>
          </section>
        );
      case "done":
        return (
          <section className="flow-panel" aria-labelledby="done-title">
            <div className="flow-section-heading">
              <p className="eyebrow">SAVE_COMPLETE</p>
              <h2 id="done-title">카드 생성 흐름 완료</h2>
              <p>
                현재는 mock 완료 상태입니다. 다음 단계에서 실제 렌더링과 저장 API를
                연결할 수 있습니다.
              </p>
            </div>

            <div className="done-summary">
              <strong>{downloadReady ? "다운로드 mock 준비됨" : "미리보기 완료"}</strong>
              <span>기본 공개 범위는 private이며 공개 피드는 만들지 않습니다.</span>
              <span>비로그인 사용자는 PNG 다운로드까지, 보관함 저장은 로그인 후 진행합니다.</span>
            </div>

            <div className="flow-actions">
              <button className="button secondary" type="button" onClick={goBack}>
                미리보기로 돌아가기
              </button>
              <button
                className="button"
                type="button"
                onClick={() => {
                  setFlowState(
                    patchCreateCardState(initialCreateCardState, {
                      selectedQuote: initialDraft.selectedQuote
                    })
                  );
                  setDraft(initialDraft);
                  setDownloadReady(false);
                  setNotice("새 카드 흐름을 다시 시작합니다.");
                }}
              >
                새 카드 만들기
              </button>
            </div>
          </section>
        );
    }
  }

  return (
    <section className="create-flow" aria-labelledby="create-flow-title">
      <div className="create-header">
        <div>
          <p className="eyebrow">Create</p>
          <h1 id="create-flow-title">문장 카드 만들기</h1>
          <p className="lede">
            책 페이지에서 건진 문장을 개인 독서 기록 카드로 만드는 MVP 흐름입니다.
          </p>
        </div>
        <div className="status-panel" aria-live="polite">
          <span>현재 상태</span>
          <strong>{flowState.status}</strong>
          <small>{notice}</small>
        </div>
      </div>

      <div className="create-flow-layout">
        <aside className="stepper-panel" aria-label="생성 단계">
          <ol className="flow-stepper">
            {CREATE_CARD_STEPS.map((step) => {
              const currentIndex = CREATE_CARD_STEPS.indexOf(flowState.step);
              const stepIndex = CREATE_CARD_STEPS.indexOf(step);
              const state =
                stepIndex < currentIndex
                  ? "done"
                  : stepIndex === currentIndex
                    ? "current"
                    : "pending";

              return (
                <li className={`flow-step ${state}`} key={step}>
                  <span>{stepIndex + 1}</span>
                  <strong>{stepLabels[step]}</strong>
                </li>
              );
            })}
          </ol>
        </aside>

        {renderCurrentStep()}

        <aside className="preview-panel" aria-label="현재 카드 초안">
          {renderPreviewCard(draft, selectedTemplate?.name ?? "문장 카드")}
        </aside>
      </div>
    </section>
  );
}

function renderPreviewCard(draft: DraftForm, templateName: string) {
  return (
    <div className={`live-card ${ratioClassNames[draft.ratio]}`}>
      <div className="live-card-inner">
        <p className="live-card-template">{templateName}</p>
        <blockquote>{draft.selectedQuote}</blockquote>
        <p className="live-card-reflection">{draft.reflection}</p>
        <div className="live-card-meta">
          <strong>{draft.bookTitle}</strong>
          <span>
            {draft.author}
            {draft.pageNumber ? ` · p.${draft.pageNumber}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
