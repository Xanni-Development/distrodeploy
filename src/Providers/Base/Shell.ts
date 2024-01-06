abstract class Shell {
	abstract write(command: string): void
	abstract getStdoutStream(): NodeJS.ReadableStream
	abstract getStdoutBuffer(): Buffer

	abstract get id(): string
}

export default Shell
