import OperatingSystem from './Providers/OperatingSystem'
import DockerProvider from './Providers/Docker/DockerProvider'

const provider = new DockerProvider()

const vm = await provider.createVM(OperatingSystem['Ubuntu:22.04'], {
	cpus: 1,
	memory: 100 * 1024 * 1024, //100MB
})

await vm.start()

console.log(`VM id: ${vm.id}`)

const shell = await vm.createShell()

shell.getStdoutStream().pipe(process.stdout)

shell.write('echo "hi lol" > test.txt\n')
shell.write('pwd\n')
shell.write('ls\n')
// shell.write('ls bin\n')
shell.write('cat test.txt\n')
// shell.write('apt update\n')
// shell.write('apt install nano\n')
shell.write('nano test.txt\n')
