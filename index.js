import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

//Import slash commands
import ping from "./commands/Ping/ping.js";
import soundtrack from "./commands/Soundtrack/soundtrack.js";
import player from "./commands/Player/player.js";
import refresh from "./commands/Refresh/refresh.js";
import prog from "./commands/Prog/prog.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

const commands = [ping, soundtrack, player, prog, refresh];

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

	const { cooldowns } = client;

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimeStamp = Math.round(expirationTime / 1000);
			return interaction.reply({
				content: `Please wait, you are on a cooldown for /${command.data.name}, You can use it again <t:${expiredTimeStamp}:R>`,
				ephemeral: true,
			});
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

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
