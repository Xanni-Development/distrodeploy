import {
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	CommandInteraction,
} from 'discord.js'

export interface ICommand {
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder
	execute: (interaction: CommandInteraction) => Promise<void>
}
