import { AppShell } from "@/components/app-shell";

const savedMoments = [
  {
    title: "새벽 독서",
    book: "아직 연결되지 않은 책",
    status: "샘플"
  },
  {
    title: "퇴근길 문장",
    book: "private 보관함 자리",
    status: "샘플"
  }
] as const;

export default function LibraryPage() {
  return (
    <AppShell>
      <main className="page">
        <section className="stack">
          <p className="eyebrow">Library</p>
          <h1>보관함</h1>
          <div className="panel">
            <div className="panel-inner">
              <h2>개인 카드</h2>
              <ul className="library-list">
                {savedMoments.map((moment) => (
                  <li className="library-item" key={moment.title}>
                    <strong>{moment.title}</strong>
                    <span>{moment.book}</span>
                    <span className="status pending">{moment.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
