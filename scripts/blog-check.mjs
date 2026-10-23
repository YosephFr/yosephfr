#!/usr/bin/env node
import { findBrokenLinks, loadPosts } from "../src/lib/content.mjs"

const { posts, errors } = loadPosts()
const linkErrors = posts.length ? findBrokenLinks(posts) : []
const all = [...errors, ...linkErrors]

if (all.length) {
  for (const error of all) {
    console.error(`${error.file}: ${error.message}`)
  }
  console.error(`blog:check failed (${all.length} problem${all.length === 1 ? "" : "s"})`)
  process.exit(1)
}

const published = posts.filter((post) => !post.draft).length
console.log(`blog:check ok (${posts.length} file${posts.length === 1 ? "" : "s"}, ${published} published)`)
