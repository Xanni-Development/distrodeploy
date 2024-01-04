import Dockerode from 'dockerode'
import Shell from '../Base/Shell'
import { Duplex, Readable, Writable } from 'stream'

class DockerShell extends Shell {
	private shell: Dockerode.Exec
	private shellStream: Duplex
	private outputStream: Readable = new Readable()

	constructor(shell: Dockerode.Exec, shellStream: Duplex) {
		super()

		this.shell = shell
		this.shellStream = shellStream

		const outputStream = this.outputStream

		const copyWritable = new Writable({
			write: (chunk, encoding, callback) => {
				outputStream.push(chunk, encoding)

				callback()
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
}

export default DockerShell