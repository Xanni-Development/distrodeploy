import Dockerode from 'dockerode'
import VM from '../Base/VM'
import Shell from '../Base/Shell'
import DockerShell from './DockerShell'
import { ICreateVMOptions } from '../Base/Provider'

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

	async start(): Promise<void> {
		await this.container.start()
	}

	async pause(): Promise<void> {
		await this.container.pause()
	}

	async unpause(): Promise<void> {
		await this.container.unpause()
	}

	async stop(secondsWaitBeforeKillVM: number): Promise<void> {
		await this.container.stop({ t: secondsWaitBeforeKillVM })
	}

	async restart(): Promise<void> {
		await this.container.restart()
	}

	async kill(): Promise<void> {
		await this.container.kill()
	}

	async remove(): Promise<void> {
		await this.container.remove()
	}

	get id() {
		return this.container.id
	}
}

export default DockerVM
