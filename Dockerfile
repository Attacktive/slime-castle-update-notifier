FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM mcr.microsoft.com/playwright

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

RUN mkdir ./dist
COPY --from=builder /app/dist ./dist

RUN npx playwright install chromium

RUN addgroup --system appuser && adduser --system --group appuser
USER appuser

ARG DISCORD_TOKEN
ARG DISCORD_CHANNEL_ID
ARG SLACK_TOKEN
ARG SLACK_CHANNEL_ID

CMD ["npm", "run", "start"]
