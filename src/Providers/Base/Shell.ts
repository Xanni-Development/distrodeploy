abstract class Shell {
	abstract write(command: string): void
	abstract getStdoutStream(): NodeJS.ReadableStream
	abstract getStdoutBuffer(): Buffer
	abstract resize(width: number, height: number): Promise<void>

	abstract get id(): string
}

export default Shell
