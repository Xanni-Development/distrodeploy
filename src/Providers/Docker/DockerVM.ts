import Dockerode from 'dockerode'
import VM from '../Base/VM'
import Shell from '../Base/Shell'
import DockerShell from './DockerShell'

class DockerVM extends VM {
	private container: Dockerode.Container

	constructor(container: Dockerode.Container) {
		super()

		this.container = container
	}

	async createShell(): Promise<Shell> {
		const shell = await this.container.exec({
			Cmd: ['/bin/bash'],
			AttachStderr: true,
			AttachStdout: true,
			AttachStdin: true,
			Tty: true,
		})

		const shellStream = await shell.start({
			hijack: true,
			stdin: true,
			Tty: true,
		})

		return new DockerShell(shell, shellStream)
	}
}

export default DockerVM
