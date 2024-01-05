import { SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'
import prisma from '../Database'

const Register: ICommand = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register your account!'),
	async execute(interaction) {
		await interaction.deferReply()

		const user = await prisma.user.findFirst({
			where: { discordID: interaction.user.id },
			select: { id: true },
		})

		if (user !== null)
			return void (await interaction.editReply(
				`You already has an account.`
			))

		await prisma.user.create({
			data: {
				discordID: interaction.user.id,
			},
		})

		await interaction.editReply(
			`Hi <@${interaction.user.id}>, Your account has been created`
		)
	},
}

export default Register
