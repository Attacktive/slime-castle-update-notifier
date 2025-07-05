FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM mcr.microsoft.com/playwright:latest

WORKDIR /app

COPY package*.json ./
RUN npm install --global playwright
RUN npm ci --omit=dev

RUN mkdir ./dist
COPY --from=builder /app/dist ./dist

RUN playwright install

RUN addgroup --system appuser && adduser --system --group appuser
USER appuser

CMD ["npm", "run", "start"]
