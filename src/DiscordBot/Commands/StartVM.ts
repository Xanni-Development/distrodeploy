import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import prisma from '../Database'
import BotProvider from '../Data/BotProvider'

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
				`Cannot find VM with id ${user.selectedVM.id}.`
			))

		const providerVM = await BotProvider.getVMByID(user.selectedVM.vmID)

		await providerVM.start()

		await interaction.editReply(
			`VM with id ${user.selectedVM.id} succesfully started.`
		)
	},
}

export default StartVM
