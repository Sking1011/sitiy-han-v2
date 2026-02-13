# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Отключаем телеметрию и проверки, которые могут требовать БД или много ресурсов
ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_TYPES_CHECK 1
ENV SKIP_LINT 1
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache openssl libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public

# Настройка кеша и прав доступа
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Копируем результат сборки (Standalone mode)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
