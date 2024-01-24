import client from '../index.js'
import SetAsyncInterval from '../../Common/SetAsyncInterval.js'
import ActiveShells from '../Data/ActiveShells.js'
import BotProvider from '../Data/BotProvider.js'
import SelectedShells from '../Data/SelectedShells.js'
import ShellOutputCache from '../Data/ShellOutputCache.js'
import prisma from '../Database/index.js'

const maxOutputLengthInBytes = 1900

const UpdateShellsMessageInterval = () => {
	SetAsyncInterval(async () => {
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

			if (!channel.isTextBased()) continue

			const message = await channel.messages.fetch(
				shellDB.discordMessageID
			)

			if (!isShellStillRunnning) {
				await message.edit('Shell died')

				continue
			}
			const stdoutBuffer = shell.getStdoutBuffer()

			const newOutput =
				stdoutBuffer === null
					? ''
					: stdoutBuffer.toString(
							'utf8',
							Math.max(
								stdoutBuffer.length - maxOutputLengthInBytes,
								0
							),
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
				continue

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
