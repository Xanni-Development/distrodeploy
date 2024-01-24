import Dockerode from 'dockerode'
import Shell from '../Base/Shell.js'
import { Duplex, Readable, Writable } from 'stream'
import ANSISequence from '../../Constants/ANSISequence.js'

class DockerShell extends Shell {
	private shell: Dockerode.Exec
	private shellStream: Duplex
	private outputStream: Readable = new Readable({
		read() {},
	})
	private stdoutBuffer: Buffer | null = null

	constructor(shell: Dockerode.Exec, shellStream: Duplex) {
		super()

		this.shell = shell
		this.shellStream = shellStream

		const outputStream = this.outputStream

		const copyWritable = new Writable({
			write: (chunk: Buffer, encoding, callback) => {
				outputStream.push(chunk, encoding)

				if (chunk.includes(ANSISequence.Clear)) this.stdoutBuffer = null
				else {
					if (this.stdoutBuffer === null) this.stdoutBuffer = chunk
					else
						this.stdoutBuffer = Buffer.concat([
							this.stdoutBuffer,
							chunk,
						])

					callback()
				}
			},
		})

		this.shellStream.pipe(copyWritable)
	}

	write(command: string): void {
		this.shellStream.write(command)
	}

	getStdoutStream(): NodeJS.ReadableStream {
		return this.outputStream
	}

	getStdoutBuffer(): Buffer {
		return this.stdoutBuffer
	}

	get id() {
		return this.shell.id
	}
}

export default DockerShell
