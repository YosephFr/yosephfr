import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yoseph Franco",
    short_name: "Yoseph Franco",
    description:
      "Construyo IA que conversa con clientes. ~14.000 conversaciones al mes, diseñadas y operadas por una sola persona. Escribo lo que funciona (y lo que se rompe) en producción.",
    start_url: "/",
    display: "standalone",
    background_color: "#161616",
    theme_color: "#14B8A6",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
