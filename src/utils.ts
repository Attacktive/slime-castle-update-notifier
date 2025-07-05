import axios from "axios";

interface Metadata {
	screenshotUrls: string[];
	appletvScreenshotUrls: string[];
	ipadScreenshotUrls: string[];
	artworkUrl512: string;
	artworkUrl60: string;
	artworkUrl100: string;
	isGameCenterEnabled: boolean;
	features: string[];
	supportedDevices: string[];
	advisories: string[];
	kind: string;
	artistViewUrl: string;
	userRatingCountForCurrentVersion: number;
	averageUserRatingForCurrentVersion: number;
	fileSizeBytes: string;
	formattedPrice: string;
	trackContentRating: string;
	sellerUrl: string;
	languageCodesISO2A: string[];
	artistId: number;
	artistName: string;
	genres: string[];
	price: number;
	primaryGenreName: string;
	primaryGenreId: number;
	bundleId: string;
	releaseDate: string;
	trackId: number;
	trackName: string;
	isVppDeviceBasedLicensingEnabled: boolean;
	sellerName: string;
	currentVersionReleaseDate: string;
	releaseNotes: string;
	version: string;
	wrapperType: string;
	currency: string;
	description: string;
	minimumOsVersion: string;
	trackCensoredName: string;
	trackViewUrl: string;
	contentAdvisoryRating: string;
	averageUserRating: number;
	genreIds: string[];
	userRatingCount: number;
}

interface ItunesResponse {
	resultCount: number;
	results: Metadata[];
}

const APP_ID = 6480410032;
const URL_TO_APP = `https://itunes.apple.com/lookup?id=${APP_ID}`;

const retrieveVersion = async () => {
	console.debug(`Trying to look up: ${URL_TO_APP}`);

	const { data } = await axios.get<ItunesResponse>(URL_TO_APP);
	const { results, resultCount } = data;

	if (resultCount === 0 || results.length === 0) {
		throw new Error(`No result found for app ID: ${APP_ID}`);
	}

	const metadata = results.find(({ trackId }) => trackId === APP_ID);
	if (!metadata) {
		const message = `No relevant result found for app ID: ${APP_ID}`;
		const ids = results.map(({ trackId }) => trackId);

		console.warn(message, ids);

		throw new Error(message);
	}

	return metadata.version;
};

export { retrieveVersion };
