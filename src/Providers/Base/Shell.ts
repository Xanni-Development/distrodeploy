abstract class Shell {
	abstract write(command: string): void
	abstract getStdoutStream(): ReadableStream
}

export default Shell
