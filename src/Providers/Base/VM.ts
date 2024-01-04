import { ICreateVMOptions } from './Provider'
import Shell from './Shell'

abstract class VM {
	abstract createShell(): Promise<Shell>

	abstract get createOptions(): ICreateVMOptions

	abstract get id(): string
}

export default VM
