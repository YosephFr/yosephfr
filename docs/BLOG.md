# Blog

Posts are Markdown files. Adding one is copying a file into `content/blog/`. The next build renders it to static HTML, an Open Graph image, the sitemap, the feeds, and `llms.txt`. Nothing else in the app has to change.

Deploys stay on `scripts/deploy-hostinger.sh` from the machine that has the SSH key. This repo does not deploy by itself.

## Frontmatter

```yaml
---
title: "Los límites del agente viven en el código" # 60 characters max
description: "120 to 160 characters. This is the meta description and the feed summary."
date: "2026-10-22"       # quoted YYYY-MM-DD
updated: "2026-10-22"   # quoted YYYY-MM-DD, same day or later
lang: es                # es or en
tags:
  - agentes
  - producción
cover: /blog/covers/example.jpg   # optional, site path or https URL
canonical: https://example.com/original  # optional absolute https URL
translation: other-slug           # optional slug of the other language
draft: false
faq:                              # optional; each item is q and a, both non-empty strings
  - q: "¿Por qué un prompt no alcanza?"
    a: "Porque el modelo puede ignorarlo. El código no."
---
```

The slug is the filename without `.md` or `.mdx`: `content/blog/limites-de-agentes-en-codigo.md` becomes `/blog/limites-de-agentes-en-codigo`. Slugs are lowercase words separated by hyphens. `page` and `tag` are reserved.

`lang: es` is published at `/blog/<slug>`. `lang: en` is published at `/en/blog/<slug>`. `draft: true` is validated but not built, not listed, and not sent to IndexNow.

`translation` links two posts. Both files must point at each other and use different languages. hreflang is emitted only then. Pages with no translation do not advertise a fake alternate.

`.md` and `.mdx` are both read as Markdown (GFM). Imports, exports, and React components are rejected. That keeps a few thousand posts as HTML with no client bundle for the article.

Internal links are root-relative: `/blog/otro-post`, `/blog/tag/agentes`, `/`. Tag URLs use the slug of the tag (`producción` → `/blog/tag/produccion`).

## What a post page includes

Reading time (about 200 words per minute), a table of contents from `h2` and `h3`, canonical URL, Open Graph and Twitter cards, and a 1200×630 PNG generated at build time (`public/blog/og/<slug>.png`) in charcoal `#1F2024` and cyan `#0A93D8`, with the title in Be Vietnam Pro Black.

JSON-LD on each post:

- `BlogPosting`, with `author` and `publisher` pointing at `https://yosephfr.com/#person`
- `BreadcrumbList`
- `FAQPage` when `faq` is present (the same questions are visible on the page)

The author box links to the homepage and to the same profiles as the Person entity. Related posts are the ones that share tags.

## Index, tags, feeds

| URL | What it is |
| --- | --- |
| `/blog` | Spanish index. Newest post is featured. Tags filter. Page size is 10. |
| `/blog/page/2` | Later pages. Page 1 is `/blog`, not `/blog/page/1`. |
| `/blog/tag/<tag>` | Posts with that tag. |
| `/en/blog` | English index. Same shape. Empty until an `lang: en` file exists. |
| `/rss.xml` | RSS 2.0, latest 100 posts. |
| `/feed.json` | JSON Feed 1.1, latest 100 posts. |
| `/llms.txt` | Identity text from `content/llms-preamble.txt`, then every post title, URL, and description. |
| `/llms-full.txt` | Same identity text, plus the full Markdown of each post. |

The sitemap is an index (`/sitemap.xml`) plus chunks of 2,000 URLs (`/sitemap/0.xml`, then `1.xml`, and so on). Next writes the chunks; `postbuild` writes the index. Posts and tag pages include `lastmod`. Easter-egg routes are `noindex` and are not in the sitemap.

Static export needs at least one path for every dynamic route. Until English posts or a second page exist, the build emits hidden placeholders (`/en/blog/_`, `/blog/page/0`, `/blog/tag/_/page/0`). They are `noindex`, unlinked, and absent from the sitemap.

Edit the identity block in `content/llms-preamble.txt`. The build overwrites `public/llms.txt`.

## Check, build, deploy

```bash
npm run blog:check   # frontmatter, unique slugs, description length, title length, links, FAQ
npm run build        # check, OG images, feeds, llms, static export in out/
```

`npm run blog:check` exits with code 1 if anything fails. `npm run build` runs that check first (`prebuild`), then `next build`, then a small `postbuild` that sets `<html lang="en">` on `/en/**`, writes `out/sitemap.xml`, and confirms the blog files exist in `out/`.

`scripts/deploy-hostinger.sh` runs `npm ci`, `npm run build`, and rsync to Hostinger. It does not run from this environment. After a successful rsync it calls IndexNow and keeps going if the ping fails, because the files are already on the server.

Apache rules live in `public/.htaccess`: clean `/blog` URLs, a short `Cache-Control` on HTML (`max-age=300, stale-while-revalidate=86400`) so Cloudflare can cache and revalidate, and one year immutable on `/_next/static`.

## IndexNow

`content/indexnow.key` is the public key. The build writes `public/<key>.txt` containing that key. Bing and Yandex fetch it at `https://yosephfr.com/<key>.txt`.

```bash
node scripts/indexnow.mjs             # URLs of posts not yet submitted
node scripts/indexnow.mjs --all       # every published post
node scripts/indexnow.mjs --dry-run   # print only
node scripts/indexnow.mjs https://yosephfr.com/blog/example
```

Submitted URLs are remembered in `.indexnow-state.json` (gitignored) on the machine that deploys. The script POSTs to `api.indexnow.org`, Bing, and Yandex. Run it after the new HTML is on the origin, which the deploy script already does.
