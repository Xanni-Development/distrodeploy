import { ICreateVMOptions } from './Provider'
import Shell from './Shell'

abstract class VM {
	abstract createShell(): Promise<Shell>

	abstract get createOptions(): ICreateVMOptions
}

export default VM
