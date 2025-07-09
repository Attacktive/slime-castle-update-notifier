import { useDiscord } from "./discord";
import { useSlack } from "./slack";
import { retrieveVersion } from "./utils";

console.debug(`The Node.js environment: ${JSON.stringify(process.env, null, 2)}`);

const toEnableDiscord = true;
const toEnableSlack = true;

const { notifyIfUpdated: notifyIfUpdatedViaDiscord, isLoggedIn: isLoggedInToDiscord } = useDiscord(toEnableDiscord);
const { notify: notifyViaSlack } = useSlack(toEnableSlack);

const execute = () => {
	retrieveVersion()
		.then(currentVersion => {
			console.log(`The current version is "${currentVersion}".`);

			if (isLoggedInToDiscord()) {
				notifyIfUpdatedViaDiscord(currentVersion)
					.then(message => console.log("Notified via Discord", message))
					.catch(console.error);
			}

			if (toEnableSlack) {
				notifyViaSlack(currentVersion)
					.then(message => console.log("Notified via Slack", message))
					.catch(console.error);
			}
		})
		.catch(console.error);
};

setInterval(execute, 60 * 60 * 1000);

execute();
