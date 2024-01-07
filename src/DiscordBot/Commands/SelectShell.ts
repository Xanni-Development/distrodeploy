import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import prisma from '../Database/index.js'
import SelectedShells from '../Data/SelectedShells.js'
import ActiveShells from '../Data/ActiveShells.js'

const SelectShell: ICommand = {
	data: new SlashCommandBuilder()
		.setName('select-shell')
		.setDescription('Select a shell in the selected vm!')
		.addIntegerOption(option =>
			option
				.setName('shell-id')
				.setDescription('Shell ID')
				.setRequired(true)
		) as SlashCommandBuilder,
	async execute(interaction) {
		await interaction.deferReply()

		const shellID = interaction.options.getInteger('shell-id')

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

		const shell = await prisma.vMShell.findFirst({
			where: {
				id: shellID,
				virtualMachine: user.selectedVM,
			},
		})

		if (shell === null)
			return void (await interaction.editReply(
				`Cannot find shell with id ${shellID} in VM ${user.selectedVM.id}.`
			))

		if (![...ActiveShells.keys()].includes(shellID))
			return void (await interaction.editReply(
				`Shell with id ${shellID} in VM ${user.selectedVM.id} is not active.`
			))

		const previousSelectedShellDBID = user.selectedShell?.id

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				selectedShell: {
					connect: shell,
				},
			},
		})

		if (previousSelectedShellDBID)
			SelectedShells.delete(previousSelectedShellDBID)
		
		SelectedShells.add(shellID)

		await interaction.editReply(
			`You have selected shell ${shellID} in VM ${user.selectedVM.id}.`
		)
	},
}

export default SelectShell
