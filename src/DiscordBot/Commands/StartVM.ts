import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import prisma from '../Database/index.js'
import BotProvider from '../Data/BotProvider.js'
import { ContainerState } from '../../Providers/Base/VM.js'

const StartVM: ICommand = {
	data: new SlashCommandBuilder()
		.setName('start-vm')
		.setDescription('Start selected vm!'),
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

		if ((await providerVM.state) === ContainerState.Running)
			return void (await interaction.editReply(
				`Cannot start VM with id ${user.selectedVM.id} as it's already running.`
			))

		await providerVM.start()

		await interaction.editReply(
			`VM with id ${user.selectedVM.id} succesfully started.`
		)
	},
}

export default StartVM
