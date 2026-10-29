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
import MetaPixelPageView from "@/components/MetaPixelPageView"
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
        <Script id="metricool" strategy="afterInteractive">{`
          function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"be2c96b9534d2f1175ea97793b959468"})});
        `}</Script>
        <Script id="meta-pixel" strategy="lazyOnload">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1106312705637430');fbq('track','PageView');`}</Script>
      </head>
      <body>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{display:'none'}} alt="" src="https://www.facebook.com/tr?id=1106312705637430&ev=PageView&noscript=1" />
        </noscript>
        <a href="#contenido" className="skip-link">{COPY[lang].skip}</a>
        <JsonLd />
        <AnalyticsEvents />
        <MetaPixelPageView />
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
