import { ChatPostMessageResponse, WebClient } from "@slack/web-api";

// TODO: make Slack App listen to the chats
export const useSlack = (enabled = true) => {
	const webClient = new WebClient(process.env.SLACK_TOKEN);

	const MESSAGE_LABEL = "The current version";

	const regExp = new RegExp(`${MESSAGE_LABEL}: \`([\\d.]*?)\``);
	const retrieveLastVersion = async (channel: string) => {
		try {
			const { messages } = await webClient.conversations.history({ channel });
			if (!messages) {
				return undefined;
			}

			for (const { bot_id, text } of messages) {
				if (!bot_id || !text) {
					continue;
				}

				const match = regExp.exec(text);
				if (!match) {
					continue;
				}

				return match[1];
			}

			console.debug("No matching message found.");
		} catch (error) {
			if (typeof error === "object") {
				console.error(error!.constructor.name, error);
			} else {
				console.error(error);
			}
		}

		return undefined;
	};

	const notify = async (currentVersion: string) => {
		if (!enabled) {
			throw new Error("Slack is not enabled.");
		}

		const channel = process.env.SLACK_CHANNEL_ID;
		if (!channel) {
			throw new Error('The environment variable "SLACK_CHANNEL_ID" is not found in environment variables!');
		}

		let message: ChatPostMessageResponse | undefined = undefined;

		try {
			const lastVersion = await retrieveLastVersion(channel);
			console.debug(`[Slack] The last version: ${lastVersion}`);

			if (currentVersion !== lastVersion) {
				message = await webClient.chat.postMessage({ channel, text: `${MESSAGE_LABEL}: \`${currentVersion}\`` });
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error!.constructor.name, error);
				await webClient.chat.postMessage({ channel, text: `❌ Error parsing store page: ${error.message}` });
				if (error.stack) {
					await webClient.chat.postMessage({ channel, text: error.stack });
				}
			} else {
				console.error(error);
			}

			throw error;
		}

		return message;
	};

	return { notify };
};
