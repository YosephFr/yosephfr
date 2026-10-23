#!/usr/bin/env node
// Pings IndexNow (shared endpoint, Bing, and Yandex) with new post URLs after deploy.
// Usage:
//   node scripts/indexnow.mjs            # posts not yet submitted
//   node scripts/indexnow.mjs --all      # every published post
//   node scripts/indexnow.mjs --dry-run  # print URLs, do not ping or save state
//   node scripts/indexnow.mjs https://yosephfr.com/blog/example
import fs from "node:fs"
import path from "node:path"
import { getPublishedPosts } from "../src/lib/content.mjs"

const root = process.cwd()
const host = "yosephfr.com"
const key = fs.readFileSync(path.join(root, "content/indexnow.key"), "utf8").trim()
const statePath = path.join(root, ".indexnow-state.json")
const endpoints = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
]

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const all = args.includes("--all")
const explicit = args.filter((arg) => arg.startsWith("https://"))

function readState() {
  if (!fs.existsSync(statePath)) return []
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath, "utf8"))
    return Array.isArray(parsed.urls) ? parsed.urls : []
  } catch {
    return []
  }
}

const published = getPublishedPosts().map((post) => post.url)
const known = new Set(readState())
let urls = explicit.length ? explicit : all ? published : published.filter((url) => !known.has(url))
urls = [...new Set(urls)]

if (!urls.length) {
  console.log("indexnow: no new post URLs")
  process.exit(0)
}

console.log(`indexnow: ${urls.length} URL${urls.length === 1 ? "" : "s"}`)
for (const url of urls) console.log(`  ${url}`)

if (dryRun) process.exit(0)

const body = {
  host,
  key,
  keyLocation: `https://${host}/${key}.txt`,
  urlList: urls,
}

let failed = false
for (const endpoint of endpoints) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    })
    console.log(`indexnow: ${endpoint} -> ${response.status}`)
    if (response.status !== 200 && response.status !== 202) {
      failed = true
      const text = await response.text()
      if (text) console.error(text.slice(0, 500))
    }
  } catch (error) {
    failed = true
    console.error(`indexnow: ${endpoint} failed: ${error instanceof Error ? error.message : error}`)
  }
}

if (failed) process.exit(1)

if (!explicit.length) {
  const next = [...new Set([...known, ...urls])]
  fs.writeFileSync(statePath, `${JSON.stringify({ urls: next }, null, 2)}\n`)
}
