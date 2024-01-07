import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import prisma from '../Database'
import BotProvider from '../Data/BotProvider'
import { ContainerState } from '../../Providers/Base/VM'

const StopVM: ICommand = {
	data: new SlashCommandBuilder()
		.setName('stop-vm')
		.setDescription('Stop selected vm!')
		.addNumberOption(option =>
			option
				.setName('seconds-wait-before-kill-vm')
				.setDescription('How many seconds to wait before kill VM')
				.setRequired(false)
		) as SlashCommandBuilder,
	async execute(interaction) {
		await interaction.deferReply()

		const secondsWaitBeforeKillVM =
			interaction.options.getNumber(
				'seconds-wait-before-kill-vm',
				false
			) ?? 5

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
				`Cannot stop VM with id ${user.selectedVM.id} as it's not running.`
			))

		const shells = await prisma.vMShell.findMany({
			where: { virtualMachine: user.selectedVM },
		})

		for (const shell of shells){
			const channel = await interaction.client.channels.fetch(
				shell.discordMessageChannelID
			)

			if (!channel.isTextBased()) return

			const message = await channel.messages.fetch(
				shell.discordMessageID
			)

			await message.edit("VM Stopped.")
		}

		await prisma.vMShell.deleteMany({
			where: { virtualMachine: user.selectedVM },
		})

		await providerVM.stop(secondsWaitBeforeKillVM)

		await interaction.editReply(
			`VM with id ${user.selectedVM.id} succesfully stopped.`
		)
	},
}

export default StopVM
