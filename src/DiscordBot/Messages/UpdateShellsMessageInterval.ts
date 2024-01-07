import client from '..'
import ActiveShells from '../Data/ActiveShells'
import BotProvider from '../Data/BotProvider'
import SelectedShells from '../Data/SelectedShells'
import ShellOutputCache from '../Data/ShellOutputCache'
import prisma from '../Database'

const UpdateShellsMessageInterval = () => {
	// TODO: Refactor with IntervalRegistry class that support async
	setInterval(async () => {
		for (const [selectedShellID, shell] of ActiveShells) {
			const shellDB = await prisma.vMShell.findFirst({
				where: {
					id: selectedShellID,
				},
				select: {
					virtualMachine: true,
					id: true,
					discordMessageID: true,
					discordMessageChannelID: true,
				},
			})

			// TODO: Null shellDB
			const vm = await BotProvider.getVMByID(shellDB.virtualMachine.vmID)

			const runningShells = await vm.shellsID

			const isShellStillRunnning = runningShells.includes(shell.id)

			if (!isShellStillRunnning) {
				await prisma.vMShell.delete({
					where: {
						id: selectedShellID,
					},
				})

				await prisma.user.updateMany({
					where: {
						selectedShell: shellDB,
					},
					data: {
						selectedShellID: null,
					},
				})

				SelectedShells.delete(selectedShellID)
				ActiveShells.delete(selectedShellID)
				ShellOutputCache.delete(shellDB.id)
			}

			const channel = await client.channels.fetch(
				shellDB.discordMessageChannelID
			)

			if (!channel.isTextBased()) return

			const message = await channel.messages.fetch(
				shellDB.discordMessageID
			)

			if (!isShellStillRunnning) return await message.edit('Shell died')

			const stdoutBuffer = shell.getStdoutBuffer()

			const newOutput = stdoutBuffer.toString(
				'utf8',
				Math.max(stdoutBuffer.length - 1000, 0),
				stdoutBuffer.length
			)

			const cache = ShellOutputCache.get(shellDB.id)

			// No need to update message if it's same as previous
			if (
				ShellOutputCache.has(shellDB.id) &&
				cache.discordMessageChannelID ===
					shellDB.discordMessageChannelID &&
				cache.discordMessageID === shellDB.discordMessageID &&
				cache.output === newOutput
			)
				return

			ShellOutputCache.set(shellDB.id, {
				discordMessageChannelID: shellDB.discordMessageChannelID,
				discordMessageID: shellDB.discordMessageID,
				output: newOutput,
			})

			await message.edit(`\`\`\`ansi\n${newOutput}\n\`\`\``)
		}
	}, 500)
}

export default UpdateShellsMessageInterval
