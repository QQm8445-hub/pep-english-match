import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🐣 英语消消乐 - 人教PEP版",
  description: "面向小学生的英语单词消消乐教育游戏，同步人教PEP版教材内容",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
