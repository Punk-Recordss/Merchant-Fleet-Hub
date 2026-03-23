# base image
FROM node:22-slim AS base
WORKDIR /app

# install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js 16+ requires standalone output for best Docker performance
ENV NEXT_PRIVATE_STANDALONE=true
RUN npm run build

# runner
FROM base AS runner
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV HOSTNAME 0.0.0.0
CMD ["node", "server.js"]
