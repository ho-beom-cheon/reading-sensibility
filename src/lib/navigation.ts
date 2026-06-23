export type AppRoute = {
  href: "/" | "/create" | "/library";
  label: string;
  description: string;
  status: "ready" | "pending";
};

export const primaryRoutes = [
  {
    href: "/",
    label: "홈",
    description: "오늘의 작업 시작점",
    status: "ready"
  },
  {
    href: "/create",
    label: "만들기",
    description: "카드 생성 흐름",
    status: "ready"
  },
  {
    href: "/library",
    label: "보관함",
    description: "private 카드 목록",
    status: "ready"
  }
] satisfies AppRoute[];
