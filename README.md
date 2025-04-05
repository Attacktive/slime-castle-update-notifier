# Slime Castle Update Notifier

An application that monitors *Slime Castle — Idle TD Game* for updates on Google Play Store and sends notifications through Discord and Slack.

## Features

- 🎮 Monitors Slime Castle's [Google Play Store page](https://play.google.com/store/search?q=slime%20castle&c=apps) for version updates
- 🤖 Sends notifications through Discord and Slack
- ⏰ Runs checks hourly
- 🔄 Only notifies when a new version is detected

## Prerequisites

- Node.js
- Discord bot token with proper permissions
- Slack bot token with proper permissions

## Environment Variables

Create a `.env.dev` file with the following variables:

```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=your_discord_channel_id
SLACK_TOKEN=your_slack_bot_token
SLACK_CHANNEL_ID=your_slack_channel_id
```

## Installation

1. Clone the repository
2. Install dependencies:
	```bash
	npm install
	```
3. Install the internal browsers for Playwright:
	```bash
	npx playwright install
	```
	See the [System requirements of Playwright](https://playwright.dev/docs/intro#system-requirements)

## Usage

For development with hot-reload:
```bash
npm run start
```
