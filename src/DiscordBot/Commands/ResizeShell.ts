import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import ActiveShells from '../Data/ActiveShells.js'
import SelectedShells from '../Data/SelectedShells.js'
import prisma from '../Database/index.js'

const ResizeShell: ICommand = {
	data: new SlashCommandBuilder()
		.setName('resize-shell')
		.setDescription('Resize the TTY characters size!')
		.addIntegerOption(option =>
			option
				.setName('width')
				.setRequired(true)
				.setDescription('Width of the TTY session in characters.')
		)
		.addIntegerOption(option =>
			option
				.setName('height')
				.setRequired(true)
				.setDescription('Height of the TTY session in characters.')
		) as SlashCommandBuilder,
	async execute(interaction) {
		await interaction.deferReply()

		const width = interaction.options.getInteger('width')
		const height = interaction.options.getInteger('height')

		const user = await prisma.user.findFirst({
			where: { discordID: interaction.user.id },
			select: {
				selectedVM: true,
				selectedShell: true,
			},
		})

		if (user === null)
			return void (await interaction.editReply(
				`You need to create an account to use this.`
			))

		if (user.selectedVM === null)
			return void (await interaction.editReply(
				`You haven't selected any VM.`
			))

		if (user.selectedShell === null)
			return void (await interaction.editReply(
				`You haven't selected any shell.`
			))

		if (!ActiveShells.has(user.selectedShell.id))
			return void (await interaction.editReply(
				`Your selected shell is not active.`
			))

		if (!SelectedShells.has(user.selectedShell.id))
			return void (await interaction.editReply(
				`Internal Error: Your selected shell is not selected.`
			))

		const shell = ActiveShells.get(user.selectedShell.id)

		await shell.resize(width, height)

		interaction.editReply(
			`Shell TTY Resized to ${width}x${height} characters`
		)
	},
}

export default ResizeShell
