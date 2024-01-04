import { Message } from 'discord.js'

const ParseExec = async (message: Message<boolean>, command: string) => {
	message.reply(`Exec \`${command}\``)
}

export default ParseExec
