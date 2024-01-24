import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import prisma from '../Database/index.js'
import ActiveShells from '../Data/ActiveShells.js'
import ANSISequence from '../../Constants/ANSISequence.js'

const Sigint: ICommand = {
	data: new SlashCommandBuilder()
		.setName('sigint')
		.setDescription(
			'Send SIGINT signal to currently selected shell! SIGINT signal is equivalent to CTRL+C'
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true })

		const user = await prisma.user.findFirst({
			where: { discordID: interaction.user.id },
			select: { id: true, selectedVM: true, selectedShell: true },
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

		if (![...ActiveShells.keys()].includes(user.selectedShell.id))
			return void (await interaction.editReply(
				`Shell with id ${user.selectedShell.id} in VM ${user.selectedVM.id} is not active.`
			))

		const shell = ActiveShells.get(user.selectedShell.id)

		shell.write(ANSISequence.SIGINT)

		await interaction.editReply(`SIGINT signal sent.`)
	},
}

export default Sigint
