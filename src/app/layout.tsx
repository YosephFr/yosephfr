import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import Script from "next/script"
import JsonLd from "@/components/JsonLd"
import "./globals.css"

const positioning =
  "Construyo IA que conversa con clientes. ~14.000 conversaciones al mes, diseñadas y operadas por una sola persona. Escribo lo que funciona (y lo que se rompe) en producción."

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
    default: "Yoseph Franco",
    template: "%s | Yoseph Franco",
  },
  description: positioning,
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
    siteName: "Yoseph Franco",
    title: "Yoseph Franco",
    description: positioning,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yoseph Franco",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoseph Franco",
    description: positioning,
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
