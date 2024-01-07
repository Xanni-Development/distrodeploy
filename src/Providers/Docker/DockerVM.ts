import Dockerode from 'dockerode'
import VM, { ContainerState } from '../Base/VM'
import Shell from '../Base/Shell'
import DockerShell from './DockerShell'
import { ICreateVMOptions } from '../Base/Provider'

class DockerVM extends VM {
	private container: Dockerode.Container
	private docker: Dockerode

	constructor(docker: Dockerode, container: Dockerode.Container) {
		super()

		this.container = container
		this.docker = docker
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

	async inspect(): Promise<Dockerode.ContainerInspectInfo> {
		return await this.container.inspect()
	}

	async getShellByID(id: string): Promise<DockerShell | null> {
		try {
			const shell = this.docker.getExec(id)

			const inspect = await shell.inspect()

			if (inspect.ContainerID !== this.id) return null

			const shellStream = await shell.start({
				hijack: true,
				stdin: true,
				Tty: true,
			})

			return new DockerShell(shell, shellStream)
		} catch (error) {
			if (error instanceof Error) {
				// TODO: Hacky
				if (error.message.includes('(HTTP code 404) no such exec'))
					return null
			}

			throw error
		}
	}

	get id() {
		return this.container.id
	}

	get state() {
		return this.inspect().then(data => {
			switch (data.State.Status) {
				case 'created':
					return ContainerState.Created
				case 'running':
					return ContainerState.Running
				case 'paused':
					return ContainerState.Paused
				case 'restarting':
					return ContainerState.Restarting
				case 'removing':
					return ContainerState.Removing
				case 'exited':
					return ContainerState.Exited
				case 'dead':
					return ContainerState.Dead

				default:
					throw new Error(
						`Docker inspect returned invalid State.Status: ${data.State.Status}`
					)
			}
		})
	}

	get shellsID() {
		return this.inspect().then(data => data.ExecIDs ?? [])
	}
}

export default DockerVM
