import { SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'

const Hi: ICommand = {
	data: new SlashCommandBuilder()
		.setName('hi')
		.setDescription('Replies with Hi!'),
	async execute(interaction) {
		await interaction.reply('Hi!')
	},
}

export default Hi
