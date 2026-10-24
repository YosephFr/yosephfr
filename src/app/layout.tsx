import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { LocaleProvider } from "@/i18n"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ModalProvider } from "@/providers/ModalProvider"
import { EasterEggProvider } from "@/providers/EasterEggProvider"
import Navbar from "@/components/Navbar"
import CommandPalette from "@/components/CommandPalette"
import JsonLd from "@/components/JsonLd"
import "./globals.css"
import { PROFILE } from "@/data/profile"
import AnalyticsEvents from "@/components/AnalyticsEvents"

export const metadata: Metadata = {
  title: { default: 'Arncof · Yoseph Franco | IA y software', template: '%s | Arncof' },
  description: PROFILE.description,
  authors: [{ name: PROFILE.name, url: PROFILE.url }],
  creator: PROFILE.name,
  publisher: PROFILE.brand,
  metadataBase: new URL(PROFILE.url),
  // Cada ruta declara su canonical; la 404 no hereda la de la portada.
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: { type: 'website', locale: 'es_AR', url: PROFILE.url, siteName: PROFILE.brand,
    title: 'Arncof · Yoseph Franco | IA y software', description: PROFILE.description,
    images: [{ url: '/og-arncof-v2.jpg', width:1200, height:630, alt:'Arncof · IA que llega al trabajo real', type:'image/jpeg' }] },
  twitter: {card:'summary_large_image',title:'Arncof · Yoseph Franco',description:PROFILE.description,images:['/og-arncof-v2.jpg'],creator:'@arncof'},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-video-preview':-1,'max-image-preview':'large','max-snippet':-1}},
  category:'technology',
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        <link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "w40vc61h1p");
        `}</Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CSHLE1CLD9" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CSHLE1CLD9');
        `}</Script>
      </head>
      <body>
        <a href="#contenido" className="skip-link">Ir al contenido</a>
        <JsonLd />
        <AnalyticsEvents />
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
