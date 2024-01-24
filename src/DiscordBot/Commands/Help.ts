import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'
import Commands from './index.js'

const Help: ICommand = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show help!'),
	async execute(interaction) {
		await interaction.deferReply()

		const embed = new EmbedBuilder()
			.setColor(0x00ff00)
			.setTitle('Distro Deploy Help')
			.setDescription(
				'Distro Deploy, a quick way to run command on linux distributions'
			)

		for (const command of Commands) {
			embed.addFields({
				name: command.data.name,
				value: command.data.description,
			})
		}

		await interaction.editReply({ embeds: [embed] })
	},
}

export default Help
