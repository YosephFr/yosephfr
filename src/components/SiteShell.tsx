import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { LocaleProvider } from "@/i18n"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ModalProvider } from "@/providers/ModalProvider"
import { EasterEggProvider } from "@/providers/EasterEggProvider"
import Navbar from "@/components/Navbar"
import CommandPalette from "@/components/CommandPalette"
import JsonLd from "@/components/JsonLd"
import "@/app/globals.css"
import { PROFILE } from "@/data/profile"
import AnalyticsEvents from "@/components/AnalyticsEvents"
import SocialStickyCta from "@/components/SocialStickyCta"
import type { Lang } from "@/lib/lang"

// Cada idioma tiene su layout raíz (app/(es) y app/(en)) para que <html lang> sea el correcto; los dos usan este marco.
const SHARED: Metadata = {
  authors: [{ name: PROFILE.name, url: PROFILE.url }],
  creator: PROFILE.name,
  publisher: PROFILE.brand,
  metadataBase: new URL(PROFILE.url),
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  category: 'technology',
}

const COPY = {
  es: { title: 'Arncof · Yoseph Franco | IA y software', description: PROFILE.description, locale: 'es_AR', alt: 'Arncof · IA que llega al trabajo real', skip: 'Ir al contenido', feed: '/feed.xml' },
  en: { title: 'Arncof · Yoseph Franco | AI and software', description: 'AI agents, software and automation for real work. Experience, guides and analysis by Yoseph Franco, Arncof.', locale: 'en_US', alt: 'Arncof · AI that reaches real work', skip: 'Skip to content', feed: '/en/feed.xml' },
}

export function siteMetadata(lang: Lang): Metadata {
  const c = COPY[lang]
  return {
    ...SHARED,
    title: { default: c.title, template: '%s | Arncof' },
    description: c.description,
    // Cada ruta declara su canonical; la 404 no hereda la de la portada.
    alternates: { types: { 'application/rss+xml': c.feed } },
    openGraph: { type: 'website', locale: c.locale, url: PROFILE.url, siteName: PROFILE.brand, title: c.title, description: c.description,
      images: [{ url: '/og-arncof-v2.jpg', width: 1200, height: 630, alt: c.alt, type: 'image/jpeg' }] },
    twitter: { card: 'summary_large_image', title: 'Arncof · Yoseph Franco', description: c.description, images: ['/og-arncof-v2.jpg'], creator: '@arncof' },
  }
}

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
  colorScheme: "dark",
}

export default function SiteShell({ lang, children }: Readonly<{ lang: Lang; children: React.ReactNode }>) {
  return (
    <html lang={lang} data-theme="dark">
      <head>
        <link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "w40vc61h1p");
        `}</Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-F7PKB9996F" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F7PKB9996F');
        `}</Script>
      </head>
      <body>
        <a href="#contenido" className="skip-link">{COPY[lang].skip}</a>
        <JsonLd />
        <AnalyticsEvents />
        <SocialStickyCta />
        <ThemeProvider>
          <LocaleProvider>
            <ModalProvider>
              <EasterEggProvider>
                <Navbar />
                {children}
                <CommandPalette />
              </EasterEggProvider>
            </ModalProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
