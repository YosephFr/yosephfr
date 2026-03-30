import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yoseph Franco | AI Engineer & Automation Expert",
    short_name: "Yoseph Franco",
    description:
      "AI Engineer: intelligent agents, SaaS platforms, automation systems. Node.js, TypeScript, OpenAI, Anthropic, React, Docker.",
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
