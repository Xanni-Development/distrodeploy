import client from '..'
import ActiveShells from '../Data/ActiveShells'
import SelectedShells from '../Data/SelectedShells'
import prisma from '../Database'

// TODO: Need to remove deleted shell data from cache or it will be memory leak
const shellLast1000BytesStringCache = new Map<number, string>()

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

			const channel = await client.channels.fetch(
				shellDB.discordMessageChannelID
			)

			if (!channel.isTextBased()) return

			const message = await channel.messages.fetch(
				shellDB.discordMessageID
			)

			const stdoutBuffer = shell.getStdoutBuffer()

			const last1000BytesString = stdoutBuffer.toString(
				'utf8',
				Math.max(stdoutBuffer.length - 1000, 0),
				stdoutBuffer.length
			)

            // TODO: No need to update message if it's same as previous
			if (
				shellLast1000BytesStringCache.has(shellDB.id) &&
				shellLast1000BytesStringCache.get(shellDB.id) ===
					last1000BytesString
			)
				return

			await message.edit(`\`\`\`ansi\n${last1000BytesString}\n\`\`\``)
		}
	}, 500)
}

export default UpdateShellsMessageInterval
