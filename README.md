# Yoseph Franco

**Full Stack Developer** | Ciudad Autonoma de Buenos Aires, Argentina

I build digital products with modern technologies. From high-performance landing pages to complex AI-powered automation systems, with +6 years leading projects across Latin America and Spain.

---

### What I Do

**Full Stack Development** --- React, Next.js, Node.js, and TypeScript. From SPAs to complex platforms with AI integration, online academies, and real-time booking systems.

**Cloud & Infrastructure** --- Production environments on AWS and Google Cloud. Docker, CI/CD, 30+ servers managed with zero-downtime migrations and automated backups.

**Web Development** --- 50+ websites delivered. Landing pages that load in under 2 seconds and consistently score 90+ on PageSpeed Insights.

---

### Tech Stack

```
React  |  Next.js  |  TypeScript  |  Node.js  |  Express  |  Tailwind CSS
OpenAI API  |  PHP  |  MySQL  |  PostgreSQL  |  Redis  |  Docker
AWS (EC2, RDS, CloudFront)  |  Google Cloud  |  Linux  |  CI/CD
WordPress  |  WooCommerce  |  Google Ads  |  Meta Ads  |  GTM  |  GA4
```

---

### About This Repo

This repository is my interactive portfolio --- a Next.js application that goes beyond a static CV. It features a complete design system with light and dark themes, bilingual support (ES/EN), a Cmd+K command palette, 93 hidden easter eggs, 5 mini-games, and an achievement tracking system.

**Built with:** Next.js 16 --- TypeScript --- Tailwind CSS 4 --- Framer Motion --- Lucide React --- Docker

**Try it locally:**

```bash
docker compose up -d
# Open http://localhost:3000
```

Or without Docker:

```bash
npm install && npm run dev
```

---

### Numbers

| | |
|---|---|
| **50+** | Websites delivered |
| **90+** | Average PageSpeed score |
| **30+** | Servers managed |
| **6+** | Years of experience |
| **8+** | Countries served |
| **93** | Easter eggs hidden in this portfolio |

---

### UTM

Social links use lowercase parameters: `utm_source` (`x`, `linkedin`, `tiktok`, `instagram` or `facebook`), `utm_medium=social`, `utm_campaign` (article slug or `bio`) and `utm_content` (`cuerpo`, `respuesta`, `bio`, `fijado` or `video`). The first visit in the tab is stored in `sessionStorage` and attached to the GA4 events `newsletter_submit` and `generate_lead`. `article_read` fires once per article per tab, at 75% of the article or after 60 seconds with the tab visible.

### Get In Touch

| | |
|---|---|
| **Email** | contacto@yosephfr.com |
| **Location** | CABA, Argentina |
| **Availability** | Immediate |

---

<sub>This portfolio was built with Next.js, Tailwind CSS, and an unhealthy amount of attention to detail. Try pressing Cmd+K.</sub>

## Publicación a su hora

El sitio es estático: un artículo, una entrada de material o un número del newsletter con fecha futura entra recién en el primer despliegue después de esa fecha. Nadie tiene que desplegar a mano:

1. `scripts/pendientes.mjs` compara lo que ya cumplió su fecha (`src/data/articles.json`, `src/data/material.ts`, `src/data/newsletter.ts`) con el sitemap en vivo y lista lo que falta.
2. El workflow `.github/workflows/publicar-a-su-hora.yml` corre ese script; si falta algo, deja un commit vacío «Publica a su hora: …» en `main` (Hostinger no acepta volver a desplegar el mismo commit) y lanza `deploy-hostinger.yml`. Si no falta nada, no hace nada. No corre si hay un despliegue en curso o si el último falló.
3. Quién lo lanza: el cron del propio workflow (:23 y :53, de 9 a 23 de Buenos Aires) y, como respaldo porque ese cron no disparó nunca en este repo, un launchd en la Mac de Franco que lo lanza a los :05 de cada hora de 9 a 23 (`~/Library/LaunchAgents/com.yosephfr.publicar.plist`, que corre `~/.local/bin/yosephfr-publicar.sh`, copia de `scripts/publicar-a-su-hora-mac.sh`; registro en `~/Library/Logs/yosephfr-publicar.log`). Necesita la Mac encendida y `gh` con sesión.

Para programar algo nuevo basta con ponerle su fecha y hacer push a `main`. Para comprobar: `gh run list -R YosephFr/yosephfr -w publicar-a-su-hora.yml`.

Quitar el respaldo de la Mac:

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.yosephfr.publicar.plist
rm ~/Library/LaunchAgents/com.yosephfr.publicar.plist ~/.local/bin/yosephfr-publicar.sh
```
