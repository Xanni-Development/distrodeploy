abstract class Shell {
	abstract write(command: string): void
	abstract getStdoutStream(): NodeJS.ReadableStream
}

export default Shell
