import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const player = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName("player")
		.setDescription(
			"Look up a player on the Lodestone. Name and Server must be provided in order to get a response"
		)
		.addStringOption((option) =>
			option.setName("name").setDescription("The name of the player you want to find").setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("server").setDescription("The server you think the character is on").setRequired(true)
		),

	async execute(interaction) {
		await interaction.deferReply();
		const name = encodeURI(interaction.options.getString("name"));
		const server = encodeURI(interaction.options.getString("server"));
		try {
			console.log(
				`Fetching from ${process.env.XIV_API_BASEURL}/character/search?name=${name}&server=${server}&private_key=${process.env.XIV_API_KEY}`
			);

			const response = await fetch(
				`${process.env.XIV_API_BASEURL}/character/search?name=${name}&server=${server}&private_key=${process.env.XIV_API_KEY}`
			);

			const data = await response.json();
			const player = await data.Results[0];
			const lodestoneID = await player.ID;

			const lodestoneResp = await fetch(
				`${process.env.XIV_API_BASEURL}/character/${lodestoneID}&private_key=${process.env.XIV_API_KEY}`
			);
			const character = await lodestoneResp.json();
			const characterInfo = await character.Character;

			const reply = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(`${player.Name}`)
				.setThumbnail(`${player.Avatar}`)
				.addFields(
					{
						name: "Server",
						value: player.Server,
					},
					{
						name: "Free Company",
						value: characterInfo.FreeCompanyName,
					},
					{
						name: "Job",
						value: characterInfo.ActiveClassJob?.UnlockedState.Name,
					},
					{
						name: "Lodestone",
						value: `https://eu.finalfantasyxiv.com/lodestone/character/${player.ID}`,
					}
				);

			await interaction.followUp({ embeds: [reply] });
		} catch (error) {
			console.error(error);
			await interaction.followUp(`There was an error whilst looking for ${name} on ${server}: ${error.message}`);
		}
	},
};

export default player;
