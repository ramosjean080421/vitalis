# Backend (API) Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json tsconfig.json prisma/ ./
RUN npm ci
RUN npx prisma generate

FROM deps AS build
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
EXPOSE 4001
CMD ["node", "dist/index.js"]

