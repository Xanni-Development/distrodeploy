import { Message, TextBasedChannel } from 'discord.js'
import BotProvider from '../Data/BotProvider'
import OperatingSystem from '../../Constants/OperatingSystem'
import { Writable } from 'stream'
import client from '..'
import ANSISequence from '../../Constants/ANSISequence'

// let stdoutBuffer: null | Buffer = null

// const vm = await BotProvider.createVM(OperatingSystem['Ubuntu:22.04'], {
// 	cpus: 1,
// 	memory: 100 * 1024 * 1024, //100MB
// })

// await vm.start()

// console.log(`VM id: ${vm.id}`)

// const shell = await vm.createShell()

// console.log(`Shell id: ${shell.id}`)

// shell.getStdoutStream().pipe(
// 	new Writable({
// 		write(chunk: Buffer, encoding, callback) {
// 			if (stdoutBuffer === null) stdoutBuffer = chunk
// 			else stdoutBuffer = Buffer.concat([stdoutBuffer, chunk])

// 			console.log(chunk.includes(ANSISequence.Clear))
// 			console.log(chunk)
// 			callback()
// 		},
// 	})
// )

const ParseExec = async (message: Message<boolean>, command: string) => {
// 	await message.reply(`Exec \`${command}\``)

// 	shell.write(`${command}\n`)

// 	const last1000BytesString = stdoutBuffer.toString(
// 		'utf8',
// 		Math.max(stdoutBuffer.length - 1000, 0),
// 		stdoutBuffer.length
// 	)

// 	await message.reply(`\`\`\`ansi
// ${last1000BytesString}
// \`\`\``)
}

export default ParseExec
