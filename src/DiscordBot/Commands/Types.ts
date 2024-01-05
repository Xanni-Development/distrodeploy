import {
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	CommandInteraction,
	ChatInputCommandInteraction,
} from 'discord.js'

export interface ICommand {
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}
