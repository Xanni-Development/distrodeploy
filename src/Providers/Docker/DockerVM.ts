import Dockerode from 'dockerode'
import VM from '../Base/VM'
import Shell from '../Base/Shell'
import DockerShell from './DockerShell'
import { ICreateVMOptions } from '../Base/Provider'

class DockerVM extends VM {
	private container: Dockerode.Container
	private createOptions: ICreateVMOptions

	constructor(
		container: Dockerode.Container,
		createOptions: ICreateVMOptions
	) {
		super()

		this.container = container
		this.createOptions = createOptions
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
