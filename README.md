# Slime Castle Update Notifier

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ea8593e81db2440b870f8d92559427dc)](https://app.codacy.com/gh/Attacktive/slime-castle-update-notifier?utm_source=github.com&utm_medium=referral&utm_content=Attacktive/slime-castle-update-notifier&utm_campaign=Badge_Grade)
[![CodeFactor](https://www.codefactor.io/repository/github/attacktive/slime-castle-update-notifier/badge)](https://www.codefactor.io/repository/github/attacktive/slime-castle-update-notifier)
[![ESLint](https://github.com/Attacktive/slime-castle-update-notifier/actions/workflows/eslint.yaml/badge.svg)](https://github.com/Attacktive/slime-castle-update-notifier/actions/workflows/eslint.yaml)
[![Package as a Docker Image](https://github.com/Attacktive/slime-castle-update-notifier/actions/workflows/package.yaml/badge.svg)](https://github.com/Attacktive/slime-castle-update-notifier/actions/workflows/package.yaml)

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
## Usage

For development with hot-reload:
```bash
npm run dev
```
