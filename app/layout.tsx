import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://frontend-base-interview.ataflava.chatgpt.site"),
  title: "Frontend Base — база подготовки",
  description: "Темы и вопросы для подготовки к frontend-собеседованию.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Frontend Base — база подготовки",
    description: "Темы и вопросы для подготовки к frontend-собеседованию.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Frontend Base — 540 вопросов для собеседования" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Base — база подготовки",
    description: "Темы и вопросы для подготовки к frontend-собеседованию.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
