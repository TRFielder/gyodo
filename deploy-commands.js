import dotenv from "dotenv";
dotenv.config();
import { REST, Routes } from "discord.js";

//Import slash commands
import ping from "./commands/Ping/ping.js";
import soundtrack from "./commands/Soundtrack/soundtrack.js";
import player from "./commands/Player/player.js";
import prog from "./commands/Prog/prog.js";
import apexwin from "./commands/ApexWin/apexwin.js";
import refresh from "./commands/Refresh/refresh.js";

const commands = [ping, soundtrack, player, prog, apexwin, refresh];

const commandData = commands.map((command) => command.data);

//Prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);
//Deploy commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: commandData,
		});

		console.log(`Successfully reloaded ${data.length} application (/) commands`);
	} catch (error) {
		console.error(error);
	}
})();
