import { SlashCommandBuilder } from "discord.js";

const soundtrack = {
	data: new SlashCommandBuilder()
		.setName("soundtrack")
		.setDescription("Responds with some motivational music to brighten your day."),
	async execute(interaction) {
		await interaction.reply(`Some music, yes yes! https://www.youtube.com/watch?v=NQsGrEakzqw`);
	},
};

export default soundtrack;
