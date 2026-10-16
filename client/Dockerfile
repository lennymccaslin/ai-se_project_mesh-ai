FROM node:20-alpine AS meshai-frontend

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
COPY public ./public
COPY index.html vite.config.ts tsconfig*.json ./
RUN npm run build

FROM caddy:2-alpine AS frontend
COPY --from=meshai-frontend /app/dist /usr/share/caddy
EXPOSE 80