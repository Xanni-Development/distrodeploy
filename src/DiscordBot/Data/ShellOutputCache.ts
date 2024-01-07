export interface IShellOutput {
	output: string
	discordMessageChannelID: string
	discordMessageID: string
}

const ShellOutputCache = new Map<number, IShellOutput>()

export default ShellOutputCache
