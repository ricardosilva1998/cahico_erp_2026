FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production stage
FROM node:20-slim

WORKDIR /app

RUN npm install express node-cron @supabase/supabase-js

COPY server.mjs ./
COPY server/ ./server/
COPY --from=build /app/dist ./dist

ENV PORT=3000

CMD ["node", "server.mjs"]
