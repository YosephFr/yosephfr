import type { MetadataRoute } from "next"
import { site } from "@/lib/content.mjs"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.siteTitle,
    short_name: site.name,
    description: site.positioning.es,
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
