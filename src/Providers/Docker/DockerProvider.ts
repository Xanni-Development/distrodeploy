import Dockerode from 'dockerode'
import OperatingSystem from '../../Constants/OperatingSystem.js'
import Provider, { ICreateVMOptions } from '../Base/Provider.js'
import VM from '../Base/VM.js'
import DockerVM from './DockerVM.js'

class DockerProvider extends Provider {
	private docker = new Dockerode()

	async createVM(
		os: OperatingSystem,
		options: ICreateVMOptions
	): Promise<VM> {
		const imageName = this.getDockerImageNameFromOS(os)

		if (imageName === null) {
			throw new Error(
				`Docker provider doesn't support os ${OperatingSystem[os]}`
			)
		}

		const pullStream = await this.docker.pull(imageName)

		await new Promise((resolve, reject) => {
			this.docker.modem.followProgress(pullStream, (err, res) =>
				err ? reject(err) : resolve(res)
			)
		})

		// https://docs.docker.com/engine/api/v1.43/#tag/Container/operation/ContainerCreate
		const container = await this.docker.createContainer({
			Image: imageName,
			Cmd: ['sleep', 'infinity'],
			HostConfig: {
				Memory: options.memory,
				CpuPeriod: Math.max(
					(options.cpus >= 1
						? Math.floor(options.cpus)
						: options.cpus) * 100000,
					1000000
				),
				CpuQuota: options.cpus * 100000,
			},
			...(options.name != null ? { name: options.name } : {}),
		})

		return new DockerVM(this.docker, container)
	}

	async getVMByID(id: string): Promise<VM | null> {
		const containers = await this.docker.listContainers({ all: true })

		const container =
			containers.find(container => container.Id === id) ?? null

		if (container === null) return null

		return new DockerVM(this.docker, this.docker.getContainer(id))
	}

	private getDockerImageNameFromOS(os: OperatingSystem): string | null {
		switch (os) {
			case OperatingSystem['Ubuntu:22.04']:
				return 'ubuntu:22.04'
			case OperatingSystem['Debian:12.4']:
				return 'debian:12.4'
			default:
				return null
		}
	}
}

export default DockerProvider
