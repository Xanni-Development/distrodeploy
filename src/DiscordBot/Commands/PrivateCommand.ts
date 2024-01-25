import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import ActiveShells from '../Data/ActiveShells.js'
import SelectedShells from '../Data/SelectedShells.js'
import prisma from '../Database/index.js'

const PrivateCommand: ICommand = {
	data: new SlashCommandBuilder()
		.setName('private-command')
		.setDescription('Send a command to the selected shell privately!')
		.addStringOption(option =>
			option
				.setName('command')
				.setRequired(true)
				.setDescription('The command to send to the selected shell.')
		)
		.addBooleanOption(option =>
			option
				.setName('send-new-line')
				.setDescription(
					'Send new line when writing command? Default to true.'
				)
		) as SlashCommandBuilder,
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true })

		const command = interaction.options.getString('command')
		const sendNewLineWhenWritingCommand =
			interaction.options.getBoolean('send-new-line') ?? true

		const user = await prisma.user.findFirst({
			where: { discordID: interaction.user.id },
			select: {
				selectedVM: true,
				selectedShell: true,
				deleteCommandMessage: true,
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

		shell.write(`${command}${sendNewLineWhenWritingCommand ? '\n' : ''}`)

		interaction.editReply('Private command sent.')
	},
}

export default PrivateCommand
