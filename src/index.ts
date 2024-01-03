import Docker from 'dockerode'

const docker = new Docker()

console.log('pull start')

const pullStream = await docker.pull('ubuntu:22.04')

await new Promise((resolve, reject) => {
	docker.modem.followProgress(pullStream, (err, res) =>
		err ? reject(err) : resolve(res)
	)
})

console.log('pull end')

// await docker.run('ubuntu:22.04', ['/bin/bash'], process.stdout, {}, {})

const container = await docker.createContainer({
	Image: 'ubuntu:20.04',
	Cmd: ['sleep', 'infinity'],
})

await container.start()
