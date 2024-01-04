import OperatingSystem from './OperatingSystem'
import DockerProvider from './Providers/Docker/DockerProvider'

const provider = new DockerProvider()

const vm = await provider.createVM(OperatingSystem['Ubuntu:20.04'], {
	cpus: 1,
	memory: 100 * 1024 * 1024, //100MB
})

await vm.start()

console.log(`VM id: ${vm.id}`)

const shell = await vm.createShell()

shell.getStdoutStream().pipe(process.stdout)

shell.write('ls\n')
