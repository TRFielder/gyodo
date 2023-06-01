import { SlashCommandBuilder } from "discord.js";

const refresh = {
	data: new SlashCommandBuilder()
		.setName("refresh")
		.setDescription("Refreshes a slash command")
		.addStringOption((option) =>
			option.setName("command").setDescription("The command to be refreshed").setRequired(true)
		),
	async execute(interaction) {
		const commandName = interaction.options.getString("command", true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) return interaction.reply(`There is no command called "${commandName}"!`);

		try {
			interaction.client.commands.delete(command.data.name);
			//Capitalise first letter for directory name
			const dirname = command.data.name.charAt(0).toUpperCase() + command.data.name.slice(1);
			const { default: defaultExp } = await import(`../${dirname}/${command.data.name}.js`);

			console.log(`Trying to import ../${dirname}/${command.data.name}.js`);
			console.log(`Refreshing ${defaultExp.data.name}`);

			interaction.client.commands.set(defaultExp.data.name, defaultExp);
			await interaction.reply(`Command "${defaultExp.data.name}" was refreshed`);
		} catch (error) {
			console.error(error);
			await interaction.reply(`There was an error whilst refreshing "${command.data.name}: ${error.message}`);
		}
	},
};

export default refresh;
