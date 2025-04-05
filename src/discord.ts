import { Channel, Client, Events, GatewayIntentBits, SendableChannels } from "discord.js";

import { retrieveVersion } from "./utils";

export const useDiscord = (enabled = true) => {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent
		]
	});

	const TOKEN = process.env.DISCORD_TOKEN;
	if (!TOKEN) {
		throw new Error('The environment variable "DISCORD_TOKEN" is not found in environment variables!');
	}

	const MESSAGE_LABEL = "The current version";

	const parseLastVersion = async (channel: SendableChannels): Promise<string> => {
		 // TODO: It only checks the last 100 messages for now. 😏
		const messages = await channel.messages.fetch({ limit: 100 });
		for (const message of messages) {
			const [, { author, content }] = message;

			if (author.bot) {
				const regExp = new RegExp(`${MESSAGE_LABEL}: \`([\\d.]*?)\``);
				const match = regExp.exec(content);
				if (match) {
					const [, version] = Array.from(match);

					return version;
				}
			}
		}

		throw new Error("Failed to parse the HTML document.")
	};

	const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
	if (!CHANNEL_ID) {
		throw new Error('The environment variable "DISCORD_CHANNEL_ID" is not found in environment variables!');
	}

	const notify = async (version: string, channel: SendableChannels) => {
		return await channel.send(`${MESSAGE_LABEL}: \`${version}\``);
	}

	const notifyIfUpdated = async (currentVersion?: string, channel?: Channel) => {
		if (!enabled) {
			throw new Error("Discord is not enabled.");
		}

		const channelById = await client.channels.fetch(CHANNEL_ID);
		if (!channelById) {
			throw new Error(`Failed to find the channel: ${CHANNEL_ID}`);
		}

		const targetChannel = channel ?? channelById;
		if (!targetChannel.isSendable()) {
			throw new Error(`The channel ${CHANNEL_ID} is not sendable.`);
		}

		const loadingMessage = await targetChannel.send("💻 Parsing store page...");
		const lastVersion = await parseLastVersion(targetChannel);

		if (currentVersion !== lastVersion) {
			await notify(lastVersion, targetChannel);
		}

		return await loadingMessage.delete();
	};

	const triggers = ["version", "update"] as const;
	client.on(
		Events.MessageCreate,
		async (message) => {
			if (message.author.bot) {
				return;
			}

			const normalizedMessage = message.content.trim().toLowerCase();
			if (triggers.some(trigger => normalizedMessage.includes(trigger))) {
				try {
					const currentVersion = await retrieveVersion();
					const messageSent = await notify(currentVersion, message.channel);

					console.debug("message sent", messageSent.content);
				} catch (error) {
					console.error(error);

					if (error instanceof Error) {
						await message.channel.send(`❌ Error parsing store page: ${error.message}`);
					}
				}
			}
		}
	);

	client.on(
		Events.Debug,
		(message) => console.debug("Debug:", message)
	);

	client.on(
		Events.Error,
		(error) => console.error("Error:", error)
	);

	let loginSucceeded = false;
	client.once(
		Events.ClientReady,
		(readyClient) => {
			console.log(`Logged in to Discord as "${readyClient.user.tag}".`);

			loginSucceeded = true;
		}
	);

	if (enabled) {
		client.login(TOKEN)
			.then(token => console.debug("Login succeeded.", token))
			.catch(error => console.error("Login failed:", error));
	}

	return { notifyIfUpdated, loginSucceeded };
};
