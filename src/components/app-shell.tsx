import Link from "next/link";
import type { ReactNode } from "react";
import { primaryRoutes } from "@/lib/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            문
          </span>
          <span>문장순간</span>
        </Link>
        <nav className="nav-links" aria-label="주요 메뉴">
          {primaryRoutes.map((route) => (
            <Link className="nav-link" href={route.href} key={route.href}>
              {route.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
