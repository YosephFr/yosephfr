import type { Metadata } from "next"
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
    default: "Yoseph Franco | Full Stack Developer",
    template: "%s | Yoseph Franco",
  },
  description:
    "Full Stack Developer especializado en React, Next.js, Node.js, TypeScript e inteligencia artificial. Creo productos digitales completos, desde landing pages de alto rendimiento hasta sistemas complejos con IA. +6 anos de experiencia liderando proyectos en Latinoamerica y Espana.",
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript",
    "Desarrollador Full Stack",
    "Desarrollador Web",
    "OpenAI API",
    "Inteligencia Artificial",
    "Buenos Aires",
    "Argentina",
    "Freelance",
    "WordPress Expert",
    "Landing Pages",
    "Cloud Infrastructure",
    "AWS",
    "Docker",
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
    title: "Yoseph Franco | Full Stack Developer",
    description:
      "Creo productos digitales completos con React, Next.js, Node.js e IA. Un profesional multidisciplinario que puede llevar un proyecto de cero a produccion sin necesitar un equipo de 10 personas.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yoseph Franco - Full Stack Developer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoseph Franco | Full Stack Developer",
    description:
      "Full Stack Developer: React, Next.js, Node.js, TypeScript, IA. Productos digitales completos, de landing pages a sistemas con inteligencia artificial.",
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
