import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ReadingCardPreview } from "@/components/reading-card-preview";
import { primaryRoutes } from "@/lib/navigation";

export default function HomePage() {
  return (
    <AppShell>
      <main className="page">
        <div className="workspace-grid">
          <section className="stack">
            <p className="eyebrow">문장순간</p>
            <h1>오늘 남길 문장을 고른다</h1>
            <p className="lede">
              종이책의 짧은 문장과 감상을 개인 보관용 카드로 정리하는
              모바일 웹 스캐폴드입니다.
            </p>
            <div className="action-row">
              <Link className="button" href="/create">
                새 카드 만들기
              </Link>
              <Link className="button secondary" href="/library">
                보관함
              </Link>
            </div>

            <section className="section">
              <h2>작업 공간</h2>
              <ul className="route-list">
                {primaryRoutes.map((route) => (
                  <li className="route-item" key={route.href}>
                    <strong>{route.label}</strong>
                    <span>{route.description}</span>
                    <span
                      className={
                        route.status === "ready"
                          ? "status"
                          : "status pending"
                      }
                    >
                      {route.status === "ready" ? "준비됨" : "대기"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </section>

          <ReadingCardPreview />
        </div>
      </main>
    </AppShell>
  );
}
