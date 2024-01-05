import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import OperatingSystem from '../../Providers/OperatingSystem'

const CreateVM: ICommand = {
	data: new SlashCommandBuilder()
		.setName('create-vm')
		.setDescription('Create new vm!')
		.addStringOption(option =>
			option
				.setName('operating-system')
				.setDescription('Operating System')
				.setRequired(true)
				.addChoices(
					...Object.entries(OperatingSystem).map(os => ({
						name: os[0],
						value: os[1],
					}))
				)
		) as SlashCommandBuilder,
	async execute(interaction) {
		const osString = interaction.options.getString('operating-system')

		if (!Object.keys(OperatingSystem).includes(osString))
			await interaction.reply(`Invalid OS: ${osString}`)

		const os = OperatingSystem[osString]

		await interaction.reply(`soon: ${os}`)
	},
}

export default CreateVM
