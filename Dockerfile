# syntax=docker/dockerfile:1
# Vista local del export estático; producción vive en Hostinger (scripts/deploy-hostinger.sh).
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY <<'NGINX' /etc/nginx/conf.d/default.conf
server {
    listen 3000;
    root /usr/share/nginx/html;
    error_page 404 /404.html;
    location / {
        try_files $uri $uri.html $uri/ =404;
    }
}
NGINX
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 3000
