import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fishtheflip.github.io/frontend-base-interview/"),
  title: "Frontend Base — база подготовки",
  description: "793 вопроса с подробными ответами, включая SSR, SSG, React, Nuxt, NestJS, Angular, Vue и Redux.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Frontend Base — база подготовки",
    description: "793 вопроса с подробными ответами, включая SSR, SSG, React, Nuxt, NestJS, Angular, Vue и Redux.",
    images: [{ url: "/og-frameworks.png", width: 1536, height: 1024, alt: "Frontend Base — 793 вопроса с ответами" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Base — база подготовки",
    description: "793 вопроса с подробными ответами, включая SSR, SSG, React, Nuxt, NestJS, Angular, Vue и Redux.",
    images: ["/og-frameworks.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
