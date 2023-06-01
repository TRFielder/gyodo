import { SlashCommandBuilder } from "discord.js";
import { buildSdk } from "@rpglogs/api-sdk";
import btoa from "btoa";

import dotenv from "dotenv";
dotenv.config();

const getAccessToken = async () => {
	const authHeader = "Basic " + btoa(process.env.FFLOGS_CLIENT_ID + ":" + process.env.FFLOGS_CLIENT_SECRET);

	const response = await fetch("https://www.fflogs.com/oauth/token", {
		method: "POST",
		headers: {
			Authorization: authHeader,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "grant_type=client_credentials",
	});

	const json = await response.json();

	if (response.status === 200) {
		return json.access_token;
	} else {
		throw new Error("Reponse was not OK: " + JSON.stringify(json));
	}
};

const accessToken = await getAccessToken();
const ffSdk = buildSdk(accessToken, "ff");

(async () => {
	const response = await ffSdk.getCharacter({ characterName: "Nhinh Pon" });
	const json = await response.json();
	console.log(JSON.stringify(json));
})();
