import { Message } from 'discord.js'
import prisma from '../Database/index.js'
import ActiveShells from '../Data/ActiveShells.js'
import SelectedShells from '../Data/SelectedShells.js'

const ParseExec = async (
	message: Message<boolean>,
	command: string,
	sendNewLineWhenWritingCommand = true
) => {
	const user = await prisma.user.findFirst({
		where: { discordID: message.author.id },
		select: { selectedVM: true, selectedShell: true },
	})

	if (user === null)
		return void (await message.reply(
			`You need to create an account to use this.`
		))

	if (user.selectedVM === null)
		return void (await message.reply(`You haven't selected any VM.`))

	if (user.selectedShell === null)
		return void (await message.reply(`You haven't selected any shell.`))

	if (!ActiveShells.has(user.selectedShell.id))
		return void (await message.reply(`Your selected shell is not active.`))

	if (!SelectedShells.has(user.selectedShell.id))
		return void (await message.reply(
			`Internal Error: Your selected shell is not selected.`
		))

	const shell = ActiveShells.get(user.selectedShell.id)

	shell.write(`${command}${sendNewLineWhenWritingCommand ? '\n' : ''}`)
}

export default ParseExec
