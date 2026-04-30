FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./
COPY --from=frontend-builder /app/server/public ./public

RUN mkdir -p /data/logos

ENV NODE_ENV=production
ENV DATA_DIR=/data
ENV PORT=3005

EXPOSE 3005
CMD ["node", "index.js"]
