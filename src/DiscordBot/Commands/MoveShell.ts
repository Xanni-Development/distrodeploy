import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import prisma from '../Database/index.js'
import ActiveShells from '../Data/ActiveShells.js'

const MoveShell: ICommand = {
	data: new SlashCommandBuilder()
		.setName('move-shell')
		.setDescription('Move shell output to a new message!'),
	async execute(interaction) {
		await interaction.deferReply()

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

		const shellMessage = await interaction.channel.send(
			`Shell will be here.`
		)

		await prisma.vMShell.update({
			where: {
				id: user.selectedShell.id,
			},
			data: {
				discordMessageChannelID: shellMessage.channel.id,
				discordMessageID: shellMessage.id,
			},
		})

		await interaction.editReply(
			`You have moved shell ${user.selectedShell.id} output in VM ${user.selectedVM.id} to ${shellMessage.url}.`
		)
	},
}

export default MoveShell
