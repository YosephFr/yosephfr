import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yoseph Franco | Full Stack Developer",
    short_name: "Yoseph Franco",
    description:
      "Full Stack Developer: React, Next.js, Node.js, TypeScript, IA. Productos digitales completos.",
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
