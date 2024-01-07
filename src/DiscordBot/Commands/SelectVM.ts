import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import prisma from '../Database'

const SelectVM: ICommand = {
	data: new SlashCommandBuilder()
		.setName('select-vm')
		.setDescription('Select a vm!')
		.addIntegerOption(option =>
			option
				.setName('vm-id')
				.setDescription('Virtual Machine ID')
				.setRequired(true)
		) as SlashCommandBuilder,
	async execute(interaction) {
		await interaction.deferReply()

		const vmID = interaction.options.getInteger('vm-id')

		const user = await prisma.user.findFirst({
			where: { discordID: interaction.user.id },
			select: { id: true },
		})

		if (user === null)
			return void (await interaction.editReply(
				`You need to create an account to use this.`
			))

		const vm = await prisma.virtualMachine.findFirst({
			where: {
				id: vmID,
				owner: {
					discordID: interaction.user.id,
				},
			},
		})

		if (vm === null)
			return void (await interaction.editReply(
				`Cannot find VM with id ${vmID}. Either it doesn't exist or you're not the owner`
			))

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				selectedVM: {
					connect: vm,
				},
				selectedShell: { disconnect: true },
			},
		})

		await interaction.editReply(
			`You have selected vm ${vm.id}.\nVM OS: ${vm.operatingSystem}`
		)
	},
}

export default SelectVM
