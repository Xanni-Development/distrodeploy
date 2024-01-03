import Shell from './Shell'

abstract class VM {
	abstract createShell(): Promise<Shell>
}

export default VM
