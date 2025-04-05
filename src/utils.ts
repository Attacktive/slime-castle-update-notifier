import { chromium } from "@playwright/test";

const URL_TO_POKE = "https://play.google.com/store/apps/details?id=com.redtailworks.slimetd";
const retrieveVersion = async (): Promise<string> => {
	const browser = await chromium.launch({ headless: true });

	try {
		const context = await browser.newContext();
		const page = await context.newPage();
		console.debug("navigating to the page...");

		await page.setViewportSize({ width: 1080, height: 1920 });
		await page.goto(URL_TO_POKE, { waitUntil: "networkidle", timeout: 30000 });
		console.debug("page loaded", page);

		await page.waitForLoadState("domcontentloaded");
		console.debug("DOM content loaded");

		const buttonSelector = "button[data-idom-class]";
		console.debug("looking for the button", buttonSelector);
		const button = page.locator(buttonSelector)
			.filter({ hasText: "arrow_forward" })
			.first();

		console.debug("found the button; going to click it", button);
		await button.click();

		const dialogSelector = "div[jsshadow] div[role=dialog]";
		console.debug("waiting for the dialog", dialogSelector);
		const dialog = await page.waitForSelector(dialogSelector, { state: "visible", timeout: 10000 });
		if (!dialog) {
			throw new Error(`The dialog (${dialogSelector}) not found.`);
		}

		console.debug("found the dialog", dialog);

		// fixme
		console.debug("unconditionally waiting for the animation to finish. 🤢🤮");
		await page.waitForTimeout(2000);

		const versionSelector = "div[jsslot][jsname] > div[jscontroller] > div[jsaction][jsshadow][jscontroller] > div[jsname][jsslot] > div:nth-child(3) > div > div:nth-child(2)";
		console.debug(`looking for the version division`, versionSelector);
		const versionDiv = await dialog.waitForSelector(versionSelector, { timeout: 10000 });
		if (!versionDiv) {
			throw new Error(`The division element (${dialogSelector}) not found.`);
		}

		console.debug("found the version division", versionDiv);

		const versionDivText = await versionDiv.textContent();
		if (!versionDivText) {
			throw new Error(`The "textContent" is evaluated to ${versionDivText}.`);
		}

		console.debug(`the "textContent" of the version division: ${versionDivText}`);

		const regExp = /v?(\d+(?:\.\d+(?:\.\d+)?)?)/i;
		const match = regExp.exec(versionDivText);
		if (!match) {
			throw new Error(`${versionDivText} failed to pass the pattern: ${regExp}`);
		}

		console.debug(`found the match against ${regExp}`, match);

		const [, version] = match;

		console.debug("finally found the version", version);

		return version;
	} finally {
		await browser.close();
	}
};

export { retrieveVersion };
