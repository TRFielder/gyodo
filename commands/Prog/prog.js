import { request, gql, GraphQLClient } from "graphql-request";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import dotenv from "dotenv";
dotenv.config();

const bearer = "Bearer " + process.env.ACCESS_TOKEN;
const endpoint = process.env.FFLOGS_API_URI;

const graphClient = new GraphQLClient(endpoint, {
	headers: {
		authorization: bearer,
	},
});

const encounterID = [
	{
		id: 88,
		name: "Kokytos",
	},
	{
		id: 89,
		name: "Pandaemonium",
	},
	{
		id: 90,
		name: "Themis",
	},
	{
		id: 91,
		name: "Athena",
	},
	{
		id: 92,
		name: "Pallas Athena",
	},
];

const characterName = "Capo Nhyvah";
const serverSlug = "Lich";
const serverRegion = "EU";

const populateQuery = (characterName, serverSlug, serverRegion) => gql`
	query {
		characterData {
			character(name: "${characterName}", serverSlug: "${serverSlug}", serverRegion: "${serverRegion}"){
				name
				lodestoneID
				kokytos: encounterRankings(encounterID: ${encounterID[0].id}, difficulty: 101)
				pandaemonium: encounterRankings(encounterID: ${encounterID[1].id}, difficulty: 101)
				themis: encounterRankings(encounterID: ${encounterID[2].id}, difficulty: 101)
				athena: encounterRankings(encounterID: ${encounterID[3].id}, difficulty: 101)
				pallas: encounterRankings(encounterID: ${encounterID[4].id}, difficulty: 101)
			}
		}
	}
`;

const prog = {
	data: new SlashCommandBuilder()
		.setName("prog")
		.setDescription("Looks up the named character's proggies through the current savage tier.")
		.addStringOption((option) => option.setName("name").setDescription("The name of the player").setRequired(true))
		.addStringOption((option) =>
			option.setName("server").setDescription("The server they play on").setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("region").setDescription("The region they play on (EU, NA etc)").setRequired(true)
		),

	async execute(interaction) {
		const name = interaction.options.getString("name");
		const server = interaction.options.getString("server");
		const region = interaction.options.getString("region");

		try {
			const query = populateQuery(name, server, region);

			const data = await graphClient.request(query);

			const clearStatus = {
				P9: data.characterData.character.kokytos.totalKills,
				P10: data.characterData.character.pandaemonium.totalKills,
				P11: data.characterData.character.themis.totalKills,
				P12p1: data.characterData.character.athena.totalKills,
				P12p2: data.characterData.character.pallas.totalKills,
			};

			const reply = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(`${name}: Proggies Status`)
				.addFields(
					{
						name: "Kokytos",
						value: clearStatus.P9 > 0 ? "Cleared!" : "Nope",
					},
					{
						name: "Pandaemonium",
						value: clearStatus.P10 > 0 ? "Cleared!" : "Nope",
					},
					{
						name: "Themis",
						value: clearStatus.P11 > 0 ? "Cleared!" : "Nope",
					},
					{
						name: "Athena",
						value: clearStatus.P12p1 > 0 ? "Cleared!" : "Nope",
					},
					{
						name: "Pallas Athena",
						value: clearStatus.P12p2 > 0 ? "Cleared!" : "Nope",
					}
				);

			await interaction.reply(`Looking up proggies for ${name} on ${server} (${region})`);
			await interaction.channel.send({ embeds: [reply] });
		} catch (error) {
			console.error(error);
			await interaction.reply(
				`There was an error whilst looking for ${name} on ${server} (${region}): ${error.message}`
			);
		}
	},
};

export default prog;
