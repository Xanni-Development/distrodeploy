import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import prisma from '../Database/index.js'
import BotProvider from '../Data/BotProvider.js'
import { ContainerState } from '../../Providers/Base/VM.js'
import ActiveShells from '../Data/ActiveShells.js'

const CreateShell: ICommand = {
	data: new SlashCommandBuilder()
		.setName('create-shell')
		.setDescription('Create new shell on selected VM!'),
	async execute(interaction) {
		await interaction.deferReply()

		const user = await prisma.user.findFirst({
			where: { discordID: interaction.user.id },
			select: { id: true, selectedVM: true },
		})

		if (user === null)
			return void (await interaction.editReply(
				`You need to create an account to use this.`
			))

		if (user.selectedVM === null)
			return void (await interaction.editReply(
				`You haven't selected any VM.`
			))

		const providerVM = await BotProvider.getVMByID(user.selectedVM.vmID)

		if ((await providerVM.state) !== ContainerState.Running)
			return void (await interaction.editReply(
				`Cannot create shell in an inactive VM.`
			))

		const shell = await providerVM.createShell()

		// Need this to get the message for shell
		const shellMessage = await interaction.channel.send(
			`Shell will be here. Creating...`
		)

		const shellResult = await prisma.vMShell.create({
			data: {
				shellID: shell.id,

				discordMessageChannelID: shellMessage.channel.id,
				discordMessageID: shellMessage.id,

				virtualMachine: { connect: user.selectedVM },
			},
		})

		// Handle shell removed
		ActiveShells.set(shellResult.id, shell)

		await interaction.editReply(
			`Shell with id ${shellResult.id} in VM ${user.selectedVM.id} succesfully started.`
		)
	},
}

export default CreateShell
