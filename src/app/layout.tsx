import type { Metadata } from "next";
import "./globals.css";
import "reflect-metadata";

export const metadata: Metadata = {
  title: "Todo App - Organize Your Tasks",
  description:
    "A modern todo application built with Next.js, TypeScript, and PostgreSQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
