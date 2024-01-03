import Shell from './Shell'

abstract class VM {
	abstract createShell(): Shell
}

export default VM
