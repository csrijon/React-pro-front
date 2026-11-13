# ---------- build the React app ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Relative /api means "same domain" - nginx below proxies it to the API container.
ARG VITE_API_URL=/api
ARG VITE_USE_MOCK=false
ARG INLINE_CSS=0
ARG ROUTE_PRELOAD=0
ENV VITE_API_URL=$VITE_API_URL VITE_USE_MOCK=$VITE_USE_MOCK INLINE_CSS=$INLINE_CSS ROUTE_PRELOAD=$ROUTE_PRELOAD
RUN npm run build

# ---------- serve with nginx ----------
# unprivileged image: nginx runs as a non-root user and listens on 8080
FROM nginxinc/nginx-unprivileged:1.27-alpine
# nginx renders templates in /etc/nginx/templates with the environment on start-up
ENV API_UPSTREAM=http://api:5000
COPY deploy/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY deploy/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY deploy/html-headers.conf /etc/nginx/snippets/html-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
