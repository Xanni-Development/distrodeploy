import Docker from 'dockerode'
import { ReadStream, WriteStream } from 'fs'

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

console.log(container.id)
console.log(`Container ID: ${container.id}`)

await container.start()

const shell = await container.exec({
	Cmd: ['/bin/bash'],
	AttachStderr: true,
	AttachStdout: true,
	AttachStdin: true,
	Tty: true,
})

console.log(`Shell ID: ${shell.id}`)

const shellStream = await shell.start({ hijack: true, stdin: true, Tty: true })

shellStream.pipe(process.stdout)

shellStream.write('ls\n')
