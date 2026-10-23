import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import Script from "next/script"
import JsonLd from "@/components/JsonLd"
import { site } from "@/lib/content.mjs"
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
    default: site.siteTitle,
    template: "%s | Yoseph Franco",
  },
  description: site.positioning.es,
  keywords: [
    "Agentic AI",
    "AI Automation Expert",
    "Multi-Agent Orchestration",
    "LLM Integration",
    "Function Calling",
    "MCP",
    "OpenAI API",
    "Anthropic Claude",
    "GHL Integration",
    "GoHighLevel",
    "n8n Automation",
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
    "IA conversacional",
    "Automatizacion con IA",
    "Agentes inteligentes",
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
    url: "https://yosephfr.com",
    siteName: site.siteTitle,
    title: site.siteTitle,
    description: site.positioning.es,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: site.siteTitle,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.siteTitle,
    description: site.positioning.es,
    images: ["/og-image.jpg"],
    creator: site.twitter,
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
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
      <body className="font-sans antialiased">
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
