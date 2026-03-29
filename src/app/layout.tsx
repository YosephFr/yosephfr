import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import { LocaleProvider } from "@/i18n"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ModalProvider } from "@/providers/ModalProvider"
import { EasterEggProvider } from "@/providers/EasterEggProvider"
import Navbar from "@/components/Navbar"
import CommandPalette from "@/components/CommandPalette"
import ContextMenu from "@/components/ContextMenu"
import JsonLd from "@/components/JsonLd"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["700"],
})

export const metadata: Metadata = {
  title: {
    default: "Yoseph Franco | AI Engineer",
    template: "%s | Yoseph Franco",
  },
  description:
    "AI Engineer con +6 anos de experiencia full stack. Construyo agentes inteligentes, plataformas SaaS con IA y sistemas de automatizacion en produccion real. Node.js, TypeScript, OpenAI, Anthropic, React, Docker, AWS.",
  keywords: [
    "AI Engineer",
    "Agentic AI",
    "Multi-Agent Orchestration",
    "LLM Integration",
    "Function Calling",
    "MCP",
    "OpenAI API",
    "Anthropic Claude",
    "SaaS Architecture",
    "Node.js",
    "TypeScript",
    "React",
    "Next.js",
    "Full Stack Developer",
    "Docker",
    "AWS",
    "Buenos Aires",
    "Argentina",
  ],
  authors: [{ name: "Yoseph Franco", url: "https://yosephfr.com" }],
  creator: "Yoseph Franco",
  publisher: "Yoseph Franco",
  metadataBase: new URL("https://yosephfr.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    alternateLocale: "en_US",
    url: "https://yosephfr.com",
    siteName: "Yoseph Franco",
    title: "Yoseph Franco | AI Engineer",
    description:
      "Agentes inteligentes, plataformas SaaS y sistemas de automatizacion con IA en produccion. Full stack, de la arquitectura al deploy.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yoseph Franco - AI Engineer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoseph Franco | AI Engineer",
    description:
      "AI Engineer: agentes inteligentes, plataformas SaaS con IA, Node.js, TypeScript, React. Sistemas autonomos en produccion real.",
    images: ["/og-image.jpg"],
    creator: "@yosephfr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
  category: "technology",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <JsonLd />
        <ThemeProvider>
          <LocaleProvider>
            <ModalProvider>
              <EasterEggProvider>
                <Navbar />
                {children}
                <CommandPalette />
                <ContextMenu />
              </EasterEggProvider>
            </ModalProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
