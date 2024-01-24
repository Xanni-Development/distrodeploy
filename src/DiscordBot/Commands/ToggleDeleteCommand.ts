import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import prisma from '../Database/index.js'
import SelectedShells from '../Data/SelectedShells.js'
import ActiveShells from '../Data/ActiveShells.js'

const ToggleDeleteCommand: ICommand = {
	data: new SlashCommandBuilder()
		.setName('toggle-delete-command')
		.setDescription('Toggle to delete command message after sent or no!'),
	async execute(interaction) {
		await interaction.deferReply()

		const user = await prisma.user.findFirst({
			where: { discordID: interaction.user.id },
			select: { id: true, deleteCommandMessage: true },
		})

		if (user === null)
			return void (await interaction.editReply(
				`You need to create an account to use this.`
			))

		const newDeleteCommandMessage = !user.deleteCommandMessage

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				deleteCommandMessage: newDeleteCommandMessage,
			},
		})

		if (newDeleteCommandMessage)
			await interaction.editReply(
				'Commands message will now be deleted after sent! Run this command again to disable it.'
			)
		else
			await interaction.editReply(
				'Commands message now not be deleted after sent! Run this command again to enable it.'
			)
	},
}

export default ToggleDeleteCommand
