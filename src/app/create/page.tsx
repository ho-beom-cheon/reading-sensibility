import { AppShell } from "@/components/app-shell";

const createSteps = [
  "업로드",
  "문장 선택",
  "기록 입력",
  "템플릿",
  "미리보기"
] as const;

export default function CreatePage() {
  return (
    <AppShell>
      <main className="page">
        <section className="stack">
          <p className="eyebrow">Create</p>
          <h1>새 카드 만들기</h1>
          <div className="workspace-grid">
            <div className="panel">
              <div className="panel-inner">
                <h2>진행 단계</h2>
                <ol className="step-list">
                  {createSteps.map((step, index) => (
                    <li className="step-item" key={step}>
                      <strong>
                        {index + 1}. {step}
                      </strong>
                      <span className={index === 0 ? "status" : "status pending"}>
                        {index === 0 ? "현재" : "대기"}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <form className="panel" aria-label="카드 초안">
              <div className="panel-inner form-grid">
                <h2>카드 초안</h2>
                <div className="field">
                  <label htmlFor="quote">선택 문장</label>
                  <textarea id="quote" maxLength={100} placeholder="100자 이내" />
                </div>
                <div className="field">
                  <label htmlFor="book">책 제목</label>
                  <input id="book" />
                </div>
                <div className="field">
                  <label htmlFor="reflection">감상</label>
                  <textarea id="reflection" />
                </div>
                <button className="button" type="button">
                  초안 저장
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
