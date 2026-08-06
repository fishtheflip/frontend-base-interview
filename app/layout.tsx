import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fishtheflip.github.io/frontend-base-interview/"),
  title: "Frontend Base — база подготовки",
  description: "951 вопрос с подробными ответами, включая DevOps, CI/CD, Docker, Node.js, интернет-протоколы и frontend-фреймворки.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Frontend Base — база подготовки",
    description: "951 вопрос с подробными ответами, включая DevOps, CI/CD, Docker, Node.js, интернет-протоколы и frontend-фреймворки.",
    images: [{ url: "/og-frameworks.png", width: 1536, height: 1024, alt: "Frontend Base — 951 вопрос с ответами" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Base — база подготовки",
    description: "951 вопрос с подробными ответами, включая DevOps, CI/CD, Docker, Node.js, интернет-протоколы и frontend-фреймворки.",
    images: ["/og-frameworks.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("frontend-base-theme")!=="light")document.documentElement.classList.add("dark")}catch{document.documentElement.classList.add("dark")}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
