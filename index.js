import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

//Import slash commands
import ping from "./commands/Ping/ping.js";
import soundtrack from "./commands/Soundtrack/soundtrack.js";
import player from "./commands/Player/player.js";
import refresh from "./commands/Refresh/refresh.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commands = [ping, soundtrack, player, refresh];

commands.map((command) => {
	client.commands.set(command.data.name, command);
});

client.once(Events.ClientReady, () => {
	console.log("Ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		} else {
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	}
});
console.log(process.env.DISCORD_TOKEN);

client.login(process.env.DISCORD_TOKEN);
