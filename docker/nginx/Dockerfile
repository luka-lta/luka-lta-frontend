FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock /app/

RUN bun install --frozen-lockfile

COPY . /app

RUN bun run build


FROM nginx:stable-alpine

WORKDIR /app

RUN adduser -D -H -g '' app \
    && mkdir -p /var/run/nginx /var/cache/nginx \
    && chown -R app:app /var/run/nginx /var/cache/nginx /var/log/nginx

COPY --from=builder /app/dist /app/public

COPY /docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

USER app