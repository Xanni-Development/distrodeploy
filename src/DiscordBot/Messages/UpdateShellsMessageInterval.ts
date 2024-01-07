import client from '..'
import ActiveShells from '../Data/ActiveShells'
import BotProvider from '../Data/BotProvider'
import SelectedShells from '../Data/SelectedShells'
import prisma from '../Database'

// TODO: Need to remove deleted shell data from cache or it will be memory leak
const shellLastBytesStringCache = new Map<number, string>()

const UpdateShellsMessageInterval = () => {
	// TODO: Refactor with IntervalRegistry class that support async
	setInterval(async () => {
		for (const selectedShellID of SelectedShells) {
			const shell = ActiveShells.get(selectedShellID)

			const shellDB = await prisma.vMShell.findFirst({
				where: {
					id: selectedShellID,
				},
			})

			const vmDB = await prisma.virtualMachine.findFirst({
				where: {
					id: shellDB.virtualMachineID,
				},
			})

			const vm = await BotProvider.getVMByID(vmDB.vmID)

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
				shellLastBytesStringCache.delete(shellDB.id)
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

			const lastBytesString = stdoutBuffer.toString(
				'utf8',
				Math.max(stdoutBuffer.length - 1000, 0),
				stdoutBuffer.length
			)

			// No need to update message if it's same as previous
			if (
				shellLastBytesStringCache.has(shellDB.id) &&
				shellLastBytesStringCache.get(shellDB.id) === lastBytesString
			)
				return

			shellLastBytesStringCache.set(shellDB.id, lastBytesString)

			await message.edit(`\`\`\`ansi\n${lastBytesString}\n\`\`\``)
		}
	}, 500)
}

export default UpdateShellsMessageInterval
