import Dockerode from 'dockerode'
import OperatingSystem from '../../OperatingSystem'
import Provider, { ICreateVMOptions } from '../Base/Provider'
import VM from '../Base/VM'
import DockerVM from './DockerVM'

class DockerProvider extends Provider {
	private docker = new Dockerode()

	async createVM(
		os: OperatingSystem,
		options: ICreateVMOptions
	): Promise<VM> {
		const pullStream = await this.docker.pull('ubuntu:22.04')

		await new Promise((resolve, reject) => {
			this.docker.modem.followProgress(pullStream, (err, res) =>
				err ? reject(err) : resolve(res)
			)
		})

		// https://gdevillele.github.io/engine/reference/api/docker_remote_api_v1.24/#/create-a-container
		const container = await this.docker.createContainer({
			Image: 'ubuntu:20.04',
			Cmd: ['sleep', 'infinity'],
			HostConfig: {
				Memory: options.memory,
				CpuPeriod: Math.floor(options.cpus) * 100000,
				CpuQuota: options.cpus * 100000,
			},
		})

		await container.start()

		return new DockerVM(container, options)
	}
}

export default DockerProvider
