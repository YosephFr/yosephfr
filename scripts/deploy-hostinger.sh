#!/usr/bin/env bash
# Publica el sitio en Hostinger como export estático (alias SSH "hostinger", cuenta u381549037).
set -euo pipefail
cd "$(dirname "$0")/.."
npm ci
npm run build
# Los assets de _next/static llevan hash en el nombre: caché de un año.
printf 'Header set Cache-Control "public, max-age=31536000, immutable"\n' > out/_next/static/.htaccess
rsync -az --delete --exclude .well-known out/ hostinger:domains/yosephfr.com/public_html/
