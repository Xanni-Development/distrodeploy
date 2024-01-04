import { ICreateVMOptions } from './Provider'
import Shell from './Shell'

abstract class VM {
	abstract start(): Promise<void>
	abstract createShell(): Promise<Shell>
	abstract pause(): Promise<void>
	abstract unpause(): Promise<void>
	abstract stop(secondsWaitBeforeKillVM: number): Promise<void>
	abstract restart(): Promise<void>
	abstract kill(): Promise<void>
	abstract remove(): Promise<void>

	abstract get id(): string
}

export default VM
