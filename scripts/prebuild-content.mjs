#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { getPublishedPosts, site } from "../src/lib/content.mjs"

const check = spawnSync(process.execPath, ["scripts/blog-check.mjs"], { stdio: "inherit" })
if (check.status !== 0) process.exit(check.status ?? 1)

const root = process.cwd()
const font = fs.readFileSync(path.join(root, "assets/fonts/BeVietnamPro-Black.ttf"))
const posts = getPublishedPosts()
const ogDir = path.join(root, "public/blog/og")
fs.mkdirSync(ogDir, { recursive: true })

function titleSize(title) {
  if (title.length > 48) return 52
  if (title.length > 32) return 64
  return 72
}

function ogTree(title, kicker) {
  return {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        backgroundColor: "#1F2024",
        color: "#ffffff",
        fontFamily: "Be Vietnam Pro",
      },
      children: [
        {
          type: "div",
          props: { style: { width: "18px", height: "630px", backgroundColor: "#0A93D8" } },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "68px 72px",
              width: "1182px",
              height: "630px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    color: "#0A93D8",
                    fontSize: "24px",
                    letterSpacing: "0.16em",
                    fontWeight: 900,
                  },
                  children: kicker,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: `${titleSize(title)}px`,
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "#ffffff",
                  },
                  children: title,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#c7c9ce",
                    fontSize: "28px",
                    fontWeight: 900,
                  },
                  children: [
                    { type: "div", props: { style: { display: "flex" }, children: "yosephfr.com" } },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", color: "#0A93D8" },
                        children: "●",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

async function writeOg(filename, title, kicker) {
  const svg = await satori(ogTree(title, kicker), {
    width: 1200,
    height: 630,
    fonts: [{ name: "Be Vietnam Pro", data: font, weight: 900, style: "normal" }],
  })
  const png = new Resvg(svg).render().asPng()
  fs.writeFileSync(path.join(ogDir, filename), png)
}

await writeOg("_blog.png", "Notas desde producción", "EN PRODUCCIÓN")
for (const post of posts) {
  const kicker = post.lang === "en" ? "IN PRODUCTION" : "EN PRODUCCIÓN"
  await writeOg(`${post.slug}.png`, post.title, kicker)
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

const feedPosts = posts.slice(0, 100)
const lastBuild = feedPosts.reduce(
  (latest, post) => (post.updated > latest ? post.updated : latest),
  feedPosts[0]?.updated ?? "1970-01-01",
)
const rssItems = feedPosts
  .map((post) => {
    const pub = new Date(`${post.date}T00:00:00Z`).toUTCString()
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${post.url}</link>
      <guid isPermaLink="true">${post.url}</guid>
      <pubDate>${pub}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.lang)}</category>
    </item>`
  })
  .join("\n")

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}/blog</link>
    <description>${escapeXml(site.positioning.es)}</description>
    <language>es</language>
    <lastBuildDate>${new Date(`${lastBuild}T00:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>
`
fs.writeFileSync(path.join(root, "public/rss.xml"), rss)

const feed = {
  version: "https://jsonfeed.org/version/1.1",
  title: site.name,
  home_page_url: site.url,
  feed_url: `${site.url}/feed.json`,
  description: site.positioning.es,
  language: "es",
  authors: [{ name: site.name, url: site.url }],
  items: feedPosts.map((post) => ({
    id: post.url,
    url: post.url,
    title: post.title,
    summary: post.description,
    content_html: post.html,
    date_published: `${post.date}T00:00:00Z`,
    date_modified: `${post.updated}T00:00:00Z`,
    language: post.lang,
    tags: post.tags,
    image: `${site.url}${post.ogImage}`,
    authors: [{ name: site.name, url: site.url }],
  })),
}
fs.writeFileSync(path.join(root, "public/feed.json"), `${JSON.stringify(feed, null, 2)}\n`)

const preamble = fs.readFileSync(path.join(root, "content/llms-preamble.txt"), "utf8").trimEnd()
const noteLines = posts.map((post) => `- [${post.title}](${post.url}): ${post.description}`)
const llms = `${preamble}\n\n## Notes\n\n${noteLines.join("\n")}\n`
fs.writeFileSync(path.join(root, "public/llms.txt"), llms)

const fullNotes = posts
  .map((post) =>
    [
      `### ${post.title}`,
      "",
      `- URL: ${post.url}`,
      `- Updated: ${post.updated}`,
      `- Language: ${post.lang}`,
      `- Tags: ${post.tags.join(", ")}`,
      "",
      post.description,
      "",
      post.body.trim(),
      "",
    ].join("\n"),
  )
  .join("\n")
fs.writeFileSync(path.join(root, "public/llms-full.txt"), `${preamble}\n\n## Notes\n\n${fullNotes}`)

const key = fs.readFileSync(path.join(root, "content/indexnow.key"), "utf8").trim()
fs.writeFileSync(path.join(root, "public", `${key}.txt`), `${key}\n`)

console.log(`prebuild: ${posts.length} posts, og images, feeds, llms, indexnow key`)
