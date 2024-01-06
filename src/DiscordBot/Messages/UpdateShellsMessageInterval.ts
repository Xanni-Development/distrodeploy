import client from '..'
import ActiveShells from '../Data/ActiveShells'
import SelectedShells from '../Data/SelectedShells'
import prisma from '../Database'

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

			await message.edit(`${Math.random()}`)
		}
	}, 500)
}

export default UpdateShellsMessageInterval
