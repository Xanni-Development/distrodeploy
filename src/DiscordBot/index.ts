import 'dotenv/config'

import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'

import './Database/index.js'

import { ICommand } from './Commands/Types.js'
import Commands from './Commands/index.js'
import ParseExec from './Messages/ParseExec.js'
import UpdateShellsMessageInterval from './Messages/UpdateShellsMessageInterval.js'

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.MessageContent,
	],
})

const commands = new Collection<string, ICommand>()

for (const command of Commands) {
	commands.set(command.data.name, command)
}

client.once(Events.ClientReady, botClient => {
	console.log(`Ready! Logged in as ${botClient.user.tag}`)
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

	const command = commands.get(interaction.commandName)

	if (!command)
		return void interaction.reply(
			`No command matching ${interaction.commandName} was found.`
		)

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			})
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			})
		}
	}
})

client.on(Events.MessageCreate, async message => {
	if (message.content.startsWith('>')) {
		const command = message.content.substring(1)

		await ParseExec(message, command)
	} else if (message.content.startsWith('|>')) {
		const command = message.content.substring(2)

		await ParseExec(message, command, false)
	}
})

UpdateShellsMessageInterval()

client.login(process.env.DISCORD_TOKEN)

export default client
