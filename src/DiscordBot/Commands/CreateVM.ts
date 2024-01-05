import { SlashCommandBuilder } from 'discord.js'
import { ICommand } from './Types'
import OperatingSystem from '../../Constants/OperatingSystem'
import prisma from '../Database'
import BotProvider from '../Data/BotProvider'

const CreateVM: ICommand = {
	data: new SlashCommandBuilder()
		.setName('create-vm')
		.setDescription('Create new vm!')
		.addStringOption(option =>
			option
				.setName('operating-system')
				.setDescription('Operating System')
				.setRequired(true)
				.addChoices(
					...Object.entries(OperatingSystem).map(os => ({
						name: os[0],
						value: os[1],
					}))
				)
		) as SlashCommandBuilder,
	async execute(interaction) {
		await interaction.deferReply()

		const osString = interaction.options.getString('operating-system')

		if (!Object.keys(OperatingSystem).includes(osString))
			await interaction.reply(`Invalid OS: ${osString}`)

		const os = OperatingSystem[osString]

		const user = await prisma.user.findFirst({
			where: { discordID: interaction.user.id },
			select: { id: true },
		})

		if (user === null)
			return void (await interaction.editReply(
				`You need to create an account to use this.`
			))

		const vm = await BotProvider.createVM(os, {
			cpus: 1,
			memory: 100 * 1024 * 1024, //100MB
		})

		const vmResult = await prisma.virtualMachine.create({
			data: {
				owner: {
					connect: user,
				},
				vmID: vm.id,
			},
		})

		await interaction.editReply(
			`Your vm with OS ${os} has been created. Select and start it to use it.\nThe vm id is \`${vmResult.id}\``
		)
	},
}

export default CreateVM
