import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import { ApexLegendsCharacters } from "../../resources/resources.js";

const apexwin = {
	data: new SlashCommandBuilder()
		.setName("apexwin")
		.setDescription("Log a game of Battle Royale in Apex, build up your stats!")
		.addStringOption((option) =>
			option
				.setName("legend")
				.setDescription("Who were you playing?")
				.addChoices(
					{
						name: "Ash",
						value: "ash",
					},
					{
						name: "Ballistic",
						value: "ballistic",
					},
					{
						name: "Bangalore",
						value: "bangalore",
					},
					{
						name: "Fuse",
						value: "fuse",
					},
					{
						name: "Mad Maggie",
						value: "madmaggie",
					},
					{
						name: "Revenant",
						value: "revenant",
					},
					{
						name: "Horizon",
						value: "horizon",
					},
					{
						name: "Octane",
						value: "octane",
					},
					{
						name: "Pathfinder",
						value: "pathfinder",
					},
					{
						name: "Valkyrie",
						value: "valkyrie",
					},
					{
						name: "Wraith",
						value: "wraith",
					},
					{
						name: "Bloodhound",
						value: "bloodhound",
					},
					{
						name: "Crypto",
						value: "crypto",
					},
					{
						name: "Seer",
						value: "seer",
					},
					{
						name: "Vantage",
						value: "vantage",
					},
					{
						name: "Catalyst",
						value: "catalyst",
					},
					{
						name: "Caustic",
						value: "caustic",
					},
					{
						name: "Rampart",
						value: "rampart",
					},
					{
						name: "Wattson",
						value: "wattson",
					},
					{
						name: "Gibraltar",
						value: "gibraltar",
					},
					{
						name: "Lifeline",
						value: "lifeline",
					},
					{
						name: "Loba",
						value: "loba",
					},
					{
						name: "Mirage",
						value: "mirage",
					},
					{
						name: "Newcastle",
						value: "newcastle",
					}
				)
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option.setName("damage").setDescription("Amount of damage you dealt").setMinValue(0).setRequired(true)
		)
		.addIntegerOption((option) => option.setName("kills").setDescription("Kills").setMinValue(0).setRequired(true))

		.addIntegerOption((option) =>
			option.setName("deaths").setDescription("Deaths").setMinValue(0).setRequired(true)
		)
		.addIntegerOption((option) =>
			option.setName("assists").setDescription("Assists").setMinValue(0).setRequired(true)
		)
		.addBooleanOption((option) => option.setName("win").setDescription("Did you win?").setRequired(true)),

	async execute(interaction) {
		await interaction.deferReply();
		const legend = interaction.options.getString("legend");
		const damage = interaction.options.getInteger("damage");
		const kills = interaction.options.getInteger("kills");
		const deaths = interaction.options.getInteger("deaths");
		const assists = interaction.options.getInteger("assists");
		const win = interaction.options.getBoolean("win");

		try {
			const reply = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(`${interaction.user.username} - ${legend} ${win === true ? "win" : "loss"} acknowledged`)
				.addFields(
					{
						name: "K/D/A",
						value: `${kills}/${deaths}/${assists}`,
					},
					{
						name: "Damage",
						value: damage,
					}
				);

			await interaction.followUp({ embeds: [reply] });
		} catch (error) {
			console.error(error);
			await interaction.followUp(`There was an error whilst trying to log your game: ${error.message}`);
		}
	},
};

export default apexwin;
