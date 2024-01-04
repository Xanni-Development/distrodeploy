import Dockerode from 'dockerode'
import OperatingSystem from '../../OperatingSystem'
import Provider from '../Base/Provider'
import VM from '../Base/VM'
import DockerVM from './DockerVM'

class DockerProvider extends Provider {
	private docker = new Dockerode()

	async createVM(os: OperatingSystem): Promise<VM> {
		const pullStream = await this.docker.pull('ubuntu:22.04')

		await new Promise((resolve, reject) => {
			this.docker.modem.followProgress(pullStream, (err, res) =>
				err ? reject(err) : resolve(res)
			)
		})

		const container = await this.docker.createContainer({
			Image: 'ubuntu:20.04',
			Cmd: ['sleep', 'infinity'],
		})

		await container.start()

		return new DockerVM(container)
	}
}

export default DockerProvider
