import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackSpend | AI Spend Audit",
  description: "Audit AI tool spend, uncover savings, and share optimization reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
