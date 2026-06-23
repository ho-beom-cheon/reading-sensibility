import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "문장순간",
  description: "종이책의 짧은 문장을 개인 소장용 이미지 카드로 남기는 모바일 웹",
  manifest: "/manifest.webmanifest"
};

export const viewport = {
  themeColor: "#2f6f62",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
