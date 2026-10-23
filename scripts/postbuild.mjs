#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { getPublishedPosts, getTags, site } from "../src/lib/content.mjs"

const root = process.cwd()
const out = path.join(root, "out")
const key = fs.readFileSync(path.join(root, "content/indexnow.key"), "utf8").trim()

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else files.push(full)
  }
  return files
}

let rewritten = 0
for (const file of walk(path.join(out, "en"))) {
  if (!file.endsWith(".html")) continue
  const html = fs.readFileSync(file, "utf8")
  const next = html.replace(/<html lang="es"/, '<html lang="en"')
  if (next !== html) {
    fs.writeFileSync(file, next)
    rewritten += 1
  }
}

function writeSitemapIndex() {
  const dir = path.join(out, "sitemap")
  const chunks = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((name) => name.endsWith(".xml")).sort()
    : []
  if (!chunks.length) {
    console.error("postbuild: no sitemap chunks in out/sitemap")
    process.exit(1)
  }

  const bodies = chunks.map((name) => fs.readFileSync(path.join(dir, name), "utf8"))
  const joined = bodies.join("\n")
  if (!joined.includes("/blog/")) {
    console.error("postbuild: sitemap chunks do not include the blog")
    process.exit(1)
  }
  if (joined.includes("/blog/page/0") || joined.includes("/blog/tag/_") || joined.includes("/en/blog/_")) {
    console.error("postbuild: sitemap includes a placeholder route")
    process.exit(1)
  }

  const index = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...chunks.map((name, index) => {
      const lastmods = [...bodies[index].matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]).sort()
      const lastmod = lastmods.at(-1)
      return [
        `  <sitemap>`,
        `    <loc>${site.url}/sitemap/${name}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
        `  </sitemap>`,
      ].filter(Boolean).join("\n")
    }),
    `</sitemapindex>`,
    ``,
  ].join("\n")
  fs.writeFileSync(path.join(out, "sitemap.xml"), index)
}

writeSitemapIndex()

const expected = [
  "blog.html",
  "en/blog.html",
  "rss.xml",
  "feed.json",
  "llms.txt",
  "llms-full.txt",
  "sitemap.xml",
  `${key}.txt`,
  "blog/og/_blog.png",
]

for (const post of getPublishedPosts()) {
  const prefix = post.lang === "en" ? "en/blog" : "blog"
  expected.push(`${prefix}/${post.slug}.html`)
  expected.push(`blog/og/${post.slug}.png`)
}

for (const lang of ["es", "en"]) {
  const base = lang === "en" ? "en/blog/tag" : "blog/tag"
  for (const tag of getTags(lang)) expected.push(`${base}/${tag.slug}.html`)
}

const missing = expected.filter((relative) => !fs.existsSync(path.join(out, relative)))
if (missing.length) {
  console.error("postbuild: missing output files:")
  for (const file of missing) console.error(`  ${file}`)
  process.exit(1)
}

const sitemap = fs.readFileSync(path.join(out, "sitemap.xml"), "utf8")
if (!sitemap.includes("<sitemapindex") || !sitemap.includes("/sitemap/")) {
  console.error("postbuild: sitemap.xml is not an index of chunks")
  process.exit(1)
}
const englishHtml = walk(path.join(out, "en")).filter((file) => file.endsWith(".html"))
const stillSpanish = englishHtml.filter((file) => fs.readFileSync(file, "utf8").includes('<html lang="es"'))
if (!englishHtml.length || stillSpanish.length) {
  console.error("postbuild: English pages are missing or still lang=es")
  for (const file of stillSpanish) console.error(`  ${path.relative(out, file)}`)
  process.exit(1)
}

console.log(`postbuild: lang rewritten on ${rewritten} English page(s); ${expected.length} outputs present`)
