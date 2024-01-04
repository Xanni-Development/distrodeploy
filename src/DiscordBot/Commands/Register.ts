import { SlashCommandBuilder } from 'discord.js'

import { ICommand } from './Types'
import User from '../Models/User'

const Register: ICommand = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register your account!'),
	async execute(interaction) {
		await interaction.deferReply()

		const user = await User.findOne({
			where: { discordID: interaction.user.id },
			attributes: ['id'],
		})

		if (user !== null)
			return void (await interaction.editReply(
				`You already has an account.`
			))

		await User.create({ discordID: interaction.user.id })

		await interaction.editReply(
			`Hi <@${interaction.user.id}>, Your account has been created`
		)
	},
}

export default Register
